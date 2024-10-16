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
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./Config");
const client_sqs_1 = require("@aws-sdk/client-sqs");
const client_s3_1 = require("@aws-sdk/client-s3");
const SQSclient = new client_sqs_1.SQSClient({
    credentials: {
        accessKeyId: Config_1.Config.awsAccessKeyId,
        secretAccessKey: Config_1.Config.awsSecretAccessKey
    },
});
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        //Command to fetch Message from SQS
        const command = new client_sqs_1.ReceiveMessageCommand({
            QueueUrl: Config_1.Config.sqsQueueUrl,
            MaxNumberOfMessages: 1
        });
        //Until a message a received 
        while (true) {
            const { Messages } = yield SQSclient.send(command);
            if (!Messages) {
                continue;
            }
            //For each message in queue
            for (const message of Messages) {
                const { MessageId, Body } = message;
                console.log(`Message Received`, { MessageId, Body });
                if (!Body)
                    continue;
                //Parse this message 
                const JSON_Body = JSON.parse(Body);
                //? Could be in ENUM
                if (JSON_Body.type === 'video-topic') {
                    //Use the S3 command to download the video 
                    const s3Client = new client_s3_1.S3Client({
                        credentials: {
                            accessKeyId: Config_1.Config.awsAccessKeyId,
                            secretAccessKey: Config_1.Config.awsSecretAccessKey
                        }
                    });
                    const command = new client_s3_1.GetObjectCommand({
                        Bucket: Config_1.Config.inputBucket,
                        Key: JSON_Body.value
                    });
                    const resFile = yield s3Client.send(command);
                    console.log(resFile.$metadata);
                }
            }
        }
    });
}
// Use recursive setTimeout instead of setInterval for more control
init();
//Download the video
// Transcode the video 
//? Can use a notification service to send the notification for upload status
// ** Delete the files and folder ** //
