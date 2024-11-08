export interface VideoPlayerProps {
  videoFile: string | null;
  title: string;
  onError?: (error: Error) => void;
}
