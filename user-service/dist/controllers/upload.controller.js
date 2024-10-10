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
require('dotenv').config();
// Initialize AWS S3 client
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'raman-vts-project';
console.log("AWS Access Key: ", process.env.AWS_ACCESS_KEY_ID);
console.log("AWS Secret Key: ", process.env.AWS_SECRET_ACCESS_KEY);
// Initialize multipart upload
const initiateMultipartUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename, mimeType, userId } = req.body;
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: `videos/${userId}/${Date.now()}-${filename}`,
            ContentType: mimeType,
        };
        const createMultipartUploadResponse = yield s3.createMultipartUpload(params).promise();
        res.status(200).json({
            uploadId: createMultipartUploadResponse.UploadId,
            key: createMultipartUploadResponse.Key,
        });
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
        const data = yield s3.uploadPart(params).promise();
        res.status(200).json({
            ETag: data.ETag,
            PartNumber: parseInt(partNumber, 10)
        });
    }
    catch (error) {
        console.error('Error uploading part', error);
        res.status(500).json({ error: 'Error uploading part' });
    }
});
exports.uploadPart = uploadPart;
// Complete multipart upload
const completeMultipartUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uploadId, key, parts } = req.body;
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
        res.status(200).json({
            message: 'Upload completed successfully',
            location: completeMultipartUploadResponse.Location,
        });
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
