export interface SQSMessage {
    Body: string;
    ReceiptHandle: string;
}

export interface BodyType{
    type:string,
    value:string,
    key:string
}

/*
Message Received {
  MessageId: '82ede167-2527-4c09-802d-b99c62361fba',
  Body: '{"type":"video-topic","value":"https://raman-vts-project.s3.eu-north-1.amazonaws.com/videos%2Fuser-id%2F1729100533825-SampleVideo_1280x720_10mb.mp4"}'
}
*/ 