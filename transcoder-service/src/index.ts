import {BodyType} from '../src/types';
import { Config } from './Config';
import {SQSClient,ReceiveMessageCommand} from '@aws-sdk/client-sqs';
import {S3Client,GetObjectCommand} from '@aws-sdk/client-s3';

const SQSclient = new SQSClient({
  credentials:{
    accessKeyId:Config.awsAccessKeyId,
    secretAccessKey:Config.awsSecretAccessKey
  },

});



async function init() {

  //Command to fetch Message from SQS
  const command = new ReceiveMessageCommand({
    QueueUrl:Config.sqsQueueUrl,
    MaxNumberOfMessages:1
  });

  //Until a message a received 
  while(true){

    
    const {Messages} = await SQSclient.send(command);
    

    if(!Messages){
     continue;
    }

    //For each message in queue
    for(const message of Messages){
 
      const{MessageId,Body} = message;

      console.log(`Message Received`,{MessageId,Body});

      if(!Body) continue;

      //Parse this message 
      const JSON_Body = JSON.parse(Body) as BodyType;
      //? Could be in ENUM
      if(JSON_Body.type === 'video-topic'){
          //Use the S3 command to download the video 
          const s3Client = new S3Client({
            credentials:{
              accessKeyId:Config.awsAccessKeyId,
              secretAccessKey:Config.awsSecretAccessKey
            }
          }); 
          const command = new GetObjectCommand({
            Bucket:Config.inputBucket,
            Key:JSON_Body.value
        });

        const resFile = await s3Client.send(command);
        console.log(resFile.$metadata);
        
      
      }

    }
  }
}


// Use recursive setTimeout instead of setInterval for more control
init();
//Download the video
  // Transcode the video 
//? Can use a notification service to send the notification for upload status
// ** Delete the files and folder ** //