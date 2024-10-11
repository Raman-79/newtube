import AWS, { AWSError } from 'aws-sdk';


const sqs = new AWS.SQS({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});



const params: AWS.SQS.ReceiveMessageRequest = {
  QueueUrl: process.env.QUEUE_URL!,
  MaxNumberOfMessages: 10,        // Receive up to 10 messages
  WaitTimeSeconds: 20,            // Long polling (20 seconds)
  VisibilityTimeout: 60,          // The message will be invisible for 30 seconds after receiving
};
async function getMessage(): Promise<void> {
   sqs.receiveMessage(params)
   .promise()
   .then((data:AWS.SQS.ReceiveMessageResult)=>{
    if(data.Messages && data.Messages.length > 0){
      console.log("Messages received:", data.Messages);

      // Process each message
      data.Messages.forEach((message: AWS.SQS.Message) => {
        if (message.Body && message.ReceiptHandle) {
          console.log(`Processing message: ${message.Body}`);
            
          // Call function to delete the message
          deleteMessage(message.ReceiptHandle);
        }
      });
    }
  })
  .catch((err:AWSError)=>{
    console.error("Error receiving message", err.message);
  });
}

async function deleteMessage (recieptHandler : string):Promise<void> {
  const deleteParams: AWS.SQS.DeleteMessageRequest = {
    QueueUrl: process.env.QUEUE_URL!,
    ReceiptHandle: recieptHandler,
  };
  sqs.deleteMessage(deleteParams).promise()
  .then((res)=>{
    console.log("Message deleted succesfully",res);
  })
  .catch((err:AWSError)=>{
    console.log("Error ",err);
  });
}

setInterval(getMessage, 5000);