import dotenv from 'dotenv';


dotenv.config();

export const Config = {
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    awsRegion: process.env.AWS_REGION!,
    sqsQueueUrl: process.env.SQS_QUEUE_URL!,
    inputBucket: process.env.AWS_INPUT_BUCKET!,
    outputBucket: process.env.AWS_OUTPUT_BUCKET!,
    hlsFolder: 'hls',
    //TODO: make the resolutions dynamic for 1080p video we can have 720,480,360p versions for 480p video 360,280 so on
    resolutions: [
        { resolution: '320x180', videoBitrate: '500k', audioBitrate: '64k' },
        { resolution: '854x480', videoBitrate: '1000k', audioBitrate: '128k' },
        { resolution: '1280x720', videoBitrate: '2500k', audioBitrate: '192k' }
    ]
}