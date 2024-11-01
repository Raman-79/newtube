export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoFile: string | null;
  userId: string;
  createdAt: Date;
}
