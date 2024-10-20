"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoProcessingService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const client_sqs_1 = require("@aws-sdk/client-sqs");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const Config_1 = require("./Config");
class VideoProcessingService {
    constructor() {
        this.isProcessing = false;
        this.s3Client_input = new client_s3_1.S3Client({
            region: Config_1.Config.awsS3Region,
            credentials: {
                accessKeyId: Config_1.Config.awsAccessKeyId,
                secretAccessKey: Config_1.Config.awsSecretAccessKey
            }
        });
        this.s3Client_output = new client_s3_1.S3Client({
            region: Config_1.Config.awsS3Region,
            credentials: {
                accessKeyId: Config_1.Config.awsAccessKeyId,
                secretAccessKey: Config_1.Config.awsSecretAccessKey
            }
        });
        this.sqsClient = new client_sqs_1.SQSClient({
            credentials: {
                accessKeyId: Config_1.Config.awsAccessKeyId,
                secretAccessKey: Config_1.Config.awsSecretAccessKey
            }
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Starting video processing service...');
            console.log("\n-------------------------------------------\n");
            this.pollMessages();
        });
    }
    pollMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isProcessing) {
                return;
            }
            try {
                this.isProcessing = true;
                yield this.processNextMessage();
            }
            catch (error) {
                console.error('Error in message polling:', error);
            }
            finally {
                this.isProcessing = false;
                // Schedule next poll after 5 seconds
                setTimeout(() => this.pollMessages(), 5000);
            }
        });
    }
    processNextMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new client_sqs_1.ReceiveMessageCommand({
                QueueUrl: Config_1.Config.sqsQueueUrl,
                MaxNumberOfMessages: 1,
                VisibilityTimeout: 1000 // 5 minutes to process the message
            });
            const { Messages } = yield this.sqsClient.send(command);
            if (!Messages || Messages.length === 0) {
                console.log("No messages");
                return;
            }
            const message = Messages[0];
            const { MessageId, Body, ReceiptHandle } = message;
            if (!Body) {
                yield this.deleteMessage(ReceiptHandle);
                throw Error("No Body in message");
            }
            console.log('Processing message:', { MessageId, Body });
            console.log("\n-------------------------------------------\n");
            try {
                const jsonBody = JSON.parse(Body);
                if (jsonBody.type === 'video-topic') {
                    yield this.processVideoMessage(jsonBody);
                }
                yield this.deleteMessage(ReceiptHandle);
            }
            catch (error) {
                console.error('Error processing message:', error);
                throw error;
            }
        });
    }
    deleteMessage(receiptHandle) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteCommand = new client_sqs_1.DeleteMessageCommand({
                QueueUrl: Config_1.Config.sqsQueueUrl,
                ReceiptHandle: receiptHandle
            });
            yield this.sqsClient.send(deleteCommand);
        });
    }
    processVideoMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const downloadPath = yield this.downloadVideo(message.key);
            const outputDir = yield this.transcodeVideo(downloadPath);
            yield this.uploadTranscodedFiles(outputDir, message.key);
            yield this.cleanup(downloadPath, outputDir);
        });
    }
    downloadVideo(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: Config_1.Config.inputBucket,
                Key: key
            });
            const response = yield this.s3Client_input.send(command);
            if (!response.Body) {
                throw new Error('No body in response');
            }
            const fileData = yield response.Body.transformToByteArray();
            const downloadDir = path_1.default.join(process.cwd(), 'downloads'); // downloads/
            yield fs_1.promises.mkdir(downloadDir, { recursive: true });
            const filename = 'video.mp4';
            const filePath = path_1.default.join(downloadDir, filename); // downloads/video.mp4
            yield fs_1.promises.writeFile(filePath, fileData);
            return filePath;
        });
    }
    transcodeVideo(inputPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const outputDir = path_1.default.join(process.cwd(), 'output');
            yield fs_1.promises.mkdir(outputDir, { recursive: true }); // output/
            yield this.transcode(inputPath, outputDir) //Perform transcoding
                .then(() => console.log('Video transcoding complete'));
            console.log("\n-------------------------------------------\n");
            return outputDir;
        });
    }
    transcode(inputPath, outputDir) {
        return __awaiter(this, void 0, void 0, function* () {
            const outputPath = path_1.default.join(outputDir, 'playlist.m3u8');
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
                ffmpeg.stdout.on('data', (data) => {
                    console.log(`FFmpeg stdout: ${data}`);
                });
                ffmpeg.stderr.on('data', (data) => {
                    console.error(`FFmpeg stderr: ${data}`);
                });
                ffmpeg.on('close', (code) => {
                    if (code === 0) {
                        resolve();
                    }
                    else {
                        reject(new Error(`FFmpeg exited with code ${code}`));
                    }
                });
                ffmpeg.on('error', reject);
            });
        });
    }
    uploadTranscodedFiles(outputDir, originalKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield fs_1.promises.readdir(outputDir);
            const baseS3Path = `user_id/${path_1.default.basename(originalKey, path_1.default.extname(originalKey))}`;
            for (const file of files) {
                const filePath = path_1.default.join(outputDir, file);
                const fileContent = yield fs_1.promises.readFile(filePath);
                const uploadCommand = new client_s3_1.PutObjectCommand({
                    Bucket: Config_1.Config.outputBucket,
                    Key: `${baseS3Path}/${file}`,
                    Body: fileContent,
                    ContentType: file.endsWith('.m3u8') ? 'application/x-mpegURL' : 'video/MP2T'
                });
                yield this.s3Client_output.send(uploadCommand);
                console.log(`Uploaded ${file} to S3`);
            }
        });
    }
    cleanup(downloadPath, outputDir) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.all([
                    // Delete download file
                    yield fs_1.promises.rm(downloadPath, { recursive: true, force: true })
                        .then(() => console.log("Deleted Downloads folder")),
                    // Delete output directory and its contents
                    yield fs_1.promises.rm(outputDir, { recursive: true, force: true })
                        .then(() => console.log('Deleted output folder '))
                ])
                    .then(() => console.log("Cleanup success"));
            }
            catch (error) {
                console.error('Error during cleanup:', error);
                throw error;
            }
        });
    }
}
exports.VideoProcessingService = VideoProcessingService;
