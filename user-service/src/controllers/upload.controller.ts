// src/controllers/uploads.controller.ts
import { Request, Response } from 'express';
import AWS, { AWSError, SQS } from 'aws-sdk';
require('dotenv').config();
interface InitiateUploadRequest extends Request {
  body: {
    userId: string;
    filename: string;
    mimeType: string;
  };
}

interface UploadPartRequest extends Request {
  body: {
    uploadId: string;
    partNumber: string;
    key: string;
  };
}

interface CompleteUploadRequest extends Request {
  body: {
    uploadId: string;
    key: string;
    parts: Array<{ ETag: string; PartNumber: number }>;
  };
}

interface AbortUploadRequest extends Request {
  body: {
    uploadId: string;
    key: string;
  };
}

// Initialize AWS S3 client
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const sqs = new AWS.SQS({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;


// Initialize multipart upload
export const initiateMultipartUpload = async (
  req: InitiateUploadRequest,
  res: Response
): Promise<void> => {
  const { filename, mimeType, userId } = req.body;
  try {
    const params = {
      Bucket: BUCKET_NAME!,
      Key: `videos/${userId}/${Date.now()}-${filename}`,
      ContentType: mimeType,
    };
   await s3.createMultipartUpload(params)
    .promise()
    .then((data)=> {
      res.status(200).json({
        uploadId: data.UploadId,
        key: data.Key,
      });
      console.log("Initialized multipart upload with upload id",data.UploadId)
    })
    .catch((err:AWSError)=>{
      res.status(500).json({
        message:'Failed to initialize multipart upload from AWS'
      });
      console.log("Failed to initialize multipart upload from AWS",err.message)
    });
    return;
  } catch (error) {
    console.error('Error initiating multipart upload', error);
    res.status(500).json({ error: 'Error initiating multipart upload' });
  }
};

// Upload a part
export const uploadPart = async (
  req: UploadPartRequest,
  res: Response
): Promise<void> => {
  const { uploadId, partNumber, key } = req.body;
  if(!req.file){
    res.status(400).json({error:"No file found"});
    return;
  }
  try {
    const params = {
      Bucket: BUCKET_NAME!,
      Key: key,
      PartNumber: parseInt(partNumber,10),
      UploadId: uploadId,
      Body: req.file.buffer,
    };

    await s3.uploadPart(params)
    .promise()
    .then((data)=>{
      res.status(200).json({
        ETag: data.ETag,
        PartNumber: parseInt(partNumber, 10)
      });
    })
    .catch((err:AWSError)=>{
      res.status(500).json({
        message:'Error to upload part '+partNumber+' from AWS'+ err.message
      });
    });
    return;
    
  } catch (error) {
    console.error('Error uploading part', error);
    res.status(500).json({ error: 'Error uploading part' });
  }
};

// Complete multipart upload
export const completeMultipartUpload = async (
  req: CompleteUploadRequest,
  res: Response
): Promise<void> => {
  const { uploadId, key, parts } = req.body;

  try {
    if (!uploadId || !key || !parts || parts.length === 0) {
      res.status(400).json({ error: 'Missing required fields or parts' });
      return;
    }
    const params = {
      Bucket: BUCKET_NAME!,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts.map((part) => ({
          ETag: part.ETag,
          PartNumber: part.PartNumber,
        })),
      },
    };

    const completeMultipartUploadResponse = await s3.completeMultipartUpload(params).promise();

    //TODO: Put this in a function
    //Send the video to a transcoder service
    const paramsSendMessage:SQS.Types.SendMessageRequest = {
      MessageBody: JSON.stringify({
        type: 'video-topic',
        value: completeMultipartUploadResponse.Location
      }),
      QueueUrl: process.env.AWS_SQS_URL!,
    };


    sqs.sendMessage(paramsSendMessage)
    .promise()
    .then((data)=> console.log('Video URL sent to the queue -',data.MessageId))
    .catch((err:AWSError)=> console.error('Error while sending Video URL to the queue',err.message));


    
    res.status(200).json({
      message: 'Upload completed successfully',
      location: completeMultipartUploadResponse.Location,
    });
    return;
  } catch (error) {
    console.error('Error completing multipart upload', error);
    res.status(500).json({ error: 'Error completing multipart upload' });
  }
};

// Abort multipart upload
export const abortMultipartUpload = async (
  req: AbortUploadRequest,
  res: Response
): Promise<void> => {
  const { uploadId, key } = req.body;

  try {
    const params = {
      Bucket: BUCKET_NAME!,
      Key: key,
      UploadId: uploadId,
    };

    await s3.abortMultipartUpload(params).promise();

    res.status(200).json({ message: 'Multipart upload aborted successfully' });
  } catch (error) {
    console.error('Error aborting multipart upload', error);
    res.status(500).json({ error: 'Error aborting multipart upload' });
  }
};
