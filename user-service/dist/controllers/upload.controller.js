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
exports.abortMultipartUpload = exports.completeMultipartUpload = exports.uploadPart = exports.initiateMultipartUpload = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const utils_1 = require("../lib/utils");
require('dotenv').config();
// Initialize AWS S3 client
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
const sqs = new aws_sdk_1.default.SQS({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
// Initialize multipart upload
const initiateMultipartUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename, mimeType, userId } = req.body;
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: `videos/${userId}/${Date.now()}-${filename}`,
            ContentType: mimeType,
        };
        yield s3.createMultipartUpload(params)
            .promise()
            .then((data) => {
            res.status(200).json({
                uploadId: data.UploadId,
                key: data.Key,
            });
            console.log("Initialized multipart upload with upload id", data.UploadId);
        })
            .catch((err) => {
            res.status(500).json({
                message: 'Failed to initialize multipart upload from AWS'
            });
            console.log("Failed to initialize multipart upload from AWS", err.message);
        });
        return;
    }
    catch (error) {
        console.error('Error initiating multipart upload', error);
        res.status(500).json({ error: 'Error initiating multipart upload' });
    }
});
exports.initiateMultipartUpload = initiateMultipartUpload;
// Upload a part
const uploadPart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uploadId, partNumber, key } = req.body;
    if (!req.file) {
        res.status(400).json({ error: "No file found" });
        return;
    }
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
            PartNumber: parseInt(partNumber, 10),
            UploadId: uploadId,
            Body: req.file.buffer,
        };
        yield s3.uploadPart(params)
            .promise()
            .then((data) => {
            res.status(200).json({
                ETag: data.ETag,
                PartNumber: parseInt(partNumber, 10)
            });
        })
            .catch((err) => {
            res.status(500).json({
                message: 'Error to upload part ' + partNumber + ' from AWS' + err.message
            });
        });
        return;
    }
    catch (error) {
        console.error('Error uploading part', error);
        res.status(500).json({ error: 'Error uploading part' });
    }
});
exports.uploadPart = uploadPart;
// Complete multipart upload
const completeMultipartUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uploadId, key, parts, title, description, thumbnail, userId } = req.body;
    try {
        if (!uploadId || !key || !parts || parts.length === 0) {
            res.status(400).json({ error: 'Missing required fields or parts' });
            return;
        }
        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: {
                Parts: parts.map((part) => ({
                    ETag: part.ETag,
                    PartNumber: part.PartNumber,
                })),
            },
        };
        const completeMultipartUploadResponse = yield s3.completeMultipartUpload(params).promise();
        if (!completeMultipartUploadResponse.Location) {
            res.status(400).json({ message: "Error while uploading video" });
            return;
        }
        const videoId = yield (0, utils_1.addVideoToDB)(completeMultipartUploadResponse.Location, title, description, userId);
        console.log(videoId);
        if (!videoId) {
            console.log("Error while uploading video to DB");
            //?? Write a function to handle situation where the multipart upload is finished and there is an issue while writing it to db
        }
        //TODO: Put this in a function
        //Send the video to a transcoder service
        // const paramsSendMessage:SQS.Types.SendMessageRequest = {
        //   MessageBody: JSON.stringify({
        //     type: 'video-topic',
        //     value: completeMultipartUploadResponse.Location,
        //     key:key
        //   }),
        //   QueueUrl: process.env.AWS_SQS_URL!,
        // };
        //?? Resolve that issue here too
        // sqs.sendMessage(paramsSendMessage)
        // .promise()
        // .then((data)=> console.log('Video URL sent to the queue -',data.MessageId,key))
        // .catch((err:AWSError)=> console.error('Error while sending Video URL to the queue',err.message));
        res.status(200).json({
            message: 'Upload completed successfully',
            location: completeMultipartUploadResponse.Location,
            key: key,
            videoId
        });
        return;
    }
    catch (error) {
        console.error('Error completing multipart upload', error);
        res.status(500).json({ error: 'Error completing multipart upload' });
    }
});
exports.completeMultipartUpload = completeMultipartUpload;
// Abort multipart upload
const abortMultipartUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uploadId, key } = req.body;
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
            UploadId: uploadId,
        };
        yield s3.abortMultipartUpload(params).promise();
        res.status(200).json({ message: 'Multipart upload aborted successfully' });
    }
    catch (error) {
        console.error('Error aborting multipart upload', error);
        res.status(500).json({ error: 'Error aborting multipart upload' });
    }
});
exports.abortMultipartUpload = abortMultipartUpload;
