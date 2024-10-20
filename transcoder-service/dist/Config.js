"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
require('dotenv').config();
exports.Config = {
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsS3Region: process.env.AWS_BUCKET_REGION || 'eu-north-1',
    awsBucketRegion: process.env.AWS_BUCKET_REGION || 'eu-north-1',
    inputBucket: process.env.AWS_INPUT_BUCKET,
    outputBucket: process.env.AWS_OUTPUT_BUCKET,
    sqsQueueUrl: process.env.SQS_QUEUE_URL
};
// Validate config on startup
Object.entries(exports.Config).forEach(([key, value]) => {
    if (!value) {
        throw new Error(`Missing required environment variable for ${key}`);
    }
});
