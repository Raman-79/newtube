import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { promises as fs } from 'fs';
import path from 'path';
import { Config } from './Config';
import { BodyType } from './types';

export class VideoProcessingService {
  private s3Client_input: S3Client;
  private s3Client_output: S3Client;
  private sqsClient: SQSClient;
  private isProcessing: boolean = false;

  constructor() {
    this.s3Client_input = new S3Client({
      region: Config.awsS3Region,
      credentials: {
        accessKeyId: Config.awsAccessKeyId,
        secretAccessKey: Config.awsSecretAccessKey
      }
    });
    this.s3Client_output = new S3Client({
        region:Config.awsS3Region,
        credentials:{
            accessKeyId:Config.awsAccessKeyId,
            secretAccessKey:Config.awsSecretAccessKey
        }
    })
    this.sqsClient = new SQSClient({
      credentials: {
        accessKeyId: Config.awsAccessKeyId,
        secretAccessKey: Config.awsSecretAccessKey
      }
    });
  }

  async start(): Promise<void> {
    console.log('Starting video processing service...');
    console.log("\n-------------------------------------------\n")
    this.pollMessages();
  }

  private async pollMessages(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    try {
      this.isProcessing = true;
      await this.processNextMessage();
    } catch (error) {
      console.error('Error in message polling:', error);
    } finally {
      this.isProcessing = false;
      // Schedule next poll after 5 seconds
      setTimeout(() => this.pollMessages(), 5000);
    }
  }

  private async processNextMessage(): Promise<void> {
    const command = new ReceiveMessageCommand({
      QueueUrl: Config.sqsQueueUrl,
      MaxNumberOfMessages: 1,
      VisibilityTimeout: 1000 // 5 minutes to process the message
    });

    const { Messages } = await this.sqsClient.send(command);
    
    if (!Messages || Messages.length === 0) {
        console.log("No messages")
      return;
    }

    const message = Messages[0];
    const { MessageId, Body, ReceiptHandle } = message;

    if (!Body) {
      await this.deleteMessage(ReceiptHandle!);
      throw Error("No Body in message");
    }

    console.log('Processing message:', { MessageId,Body});
    console.log("\n-------------------------------------------\n")

    try {
      const jsonBody = JSON.parse(Body) as BodyType;
      
      if (jsonBody.type === 'video-topic') {
        await this.processVideoMessage(jsonBody);
      }

      await this.deleteMessage(ReceiptHandle!);
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }

  private async deleteMessage(receiptHandle: string): Promise<void> {
    const deleteCommand = new DeleteMessageCommand({
      QueueUrl: Config.sqsQueueUrl,
      ReceiptHandle: receiptHandle
    });
    await this.sqsClient.send(deleteCommand);
  }
 
  private async processVideoMessage(message: BodyType): Promise<void> {
    const downloadPath = await this.downloadVideo(message.key);
    const outputDir = await this.transcodeVideo(downloadPath);
    await this.uploadTranscodedFiles(outputDir, message.key);
    await this.cleanup(downloadPath, outputDir);
  }

  private async downloadVideo(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: Config.inputBucket,
      Key: key
    });

    const response = await this.s3Client_input.send(command);
    if (!response.Body) {
      throw new Error('No body in response');
    }

    const fileData = await response.Body.transformToByteArray();
    const downloadDir = path.join(process.cwd(), 'downloads'); // downloads/
    await fs.mkdir(downloadDir, { recursive: true });

    const filename = 'video.mp4';
    const filePath = path.join(downloadDir, filename); // downloads/video.mp4
    await fs.writeFile(filePath, fileData);

    return filePath;
  }

  private async transcodeVideo(inputPath: string): Promise<string> {
    const outputDir = path.join(process.cwd(), 'output');
    await fs.mkdir(outputDir, { recursive: true }); // output/

    await this.transcode(inputPath, outputDir)  //Perform transcoding
    .then(()=>console.log('Video transcoding complete'));
    console.log("\n-------------------------------------------\n")
    return outputDir;
  }

  private async transcode(inputPath: string, outputDir: string): Promise<void> {
    const outputPath = path.join(outputDir, 'playlist.m3u8');
    
    const ffmpegArgs = [
      '-i', inputPath,
      '-profile:v', 'baseline',
      '-level', '3.0',
      '-start_number', '0',
      '-hls_time', '10',
      '-hls_list_size', '0',
      '-f', 'hls',
      outputPath
    ];

    const { spawn } = require('child_process');
    
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', ffmpegArgs);

      ffmpeg.stdout.on('data', (data: Buffer) => {
        console.log(`FFmpeg stdout: ${data}`);
      });

      ffmpeg.stderr.on('data', (data: Buffer) => {
        console.error(`FFmpeg stderr: ${data}`);
      });

      ffmpeg.on('close', (code: number) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`FFmpeg exited with code ${code}`));
        }
      });

      ffmpeg.on('error', reject); 
    });
  }

  private async uploadTranscodedFiles(outputDir: string, originalKey: string): Promise<void> {
    const files = await fs.readdir(outputDir);
    const baseS3Path = `user_id/${path.basename(originalKey, path.extname(originalKey))}`;

    for (const file of files) {
      const filePath = path.join(outputDir, file);
      const fileContent = await fs.readFile(filePath);
      
      const uploadCommand = new PutObjectCommand({
        Bucket: Config.outputBucket,
        Key: `${baseS3Path}/${file}`,
        Body: fileContent,
        ContentType: file.endsWith('.m3u8') ? 'application/x-mpegURL' : 'video/MP2T'
      });

      await this.s3Client_output.send(uploadCommand);
      console.log(`Uploaded ${file} to S3`);
    }
  }

  private async cleanup(downloadPath: string, outputDir: string): Promise<void> {
    try {

      await Promise.all([
        // Delete download file
      await fs.rm(downloadPath,{recursive:true,force:true})
      .then(()=>console.log("Deleted Downloads folder")),

      // Delete output directory and its contents
      await fs.rm(outputDir, { recursive: true, force: true })
      .then(()=>console.log('Deleted output folder '))
      ])
      .then(()=>console.log("Cleanup success"));
    } catch (error) {
      console.error('Error during cleanup:', error);
      throw error;
    }
  }
}

