"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const logger_1 = require("@tsed/logger");
logger_1.$log.level = "debug";
logger_1.$log.name = "APP";
logger_1.$log.debug("Some debug messages");
const sqs = new aws_sdk_1.default.SQS({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
// async function getMessage(queueUrl: string): Promise<string> {
//     const command = new ReceiveMessageCommand({
//       QueueUrl: queueUrl,
//       MaxNumberOfMessages: 1,
//     });
//     const response = await sqs.send(command);
//     if (response.Messages?.length) {
//       const message = response.Messages[0];
//       return message.Body!;
//     }
//     throw new Error("No messages found in the queue");
// }   
