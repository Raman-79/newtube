import { VideoProcessingService } from './transcode';
 
async function main() {
  try {
    const videoProcessor = new VideoProcessingService();
    await videoProcessor.start();
  } catch (error) {
    console.error('Fatal error in video processing service:', error);
    process.exit(1);
  }
}

main();