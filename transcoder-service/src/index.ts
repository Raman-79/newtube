import AWS from 'aws-sdk';
import {Config} from './Config'
const sqs = new AWS.SQS({
  accessKeyId:Config.awsAccessKeyId,
  secretAccessKey:Config.awsSecretAccessKey,
  region: Config.awsRegion
});

const receive_message_req_params:AWS.SQS.ReceiveMessageRequest ={
      QueueUrl: Config.sqsQueueUrl,
      WaitTimeSeconds:20,
      VisibilityTimeout:30
}
//Poll messages : Short polling  (SQS.ts)
async function pollMessages(){
  while(true){
    try{
      const data = sqs.receiveMessage(receive_message_req_params);
    }
    catch(err){
      console.log("Error",err);
    }
  }
}
//Download the video
  // Transcode the video 
//? Can use a notification service to send the notification for upload status
// ** Delete the files and folder ** //