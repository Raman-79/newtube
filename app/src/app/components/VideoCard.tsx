import { Video } from '../types';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h3 className="text-xl font-semibold">{video.title}</h3>
      <p className="text-gray-600 mt-2">{video.description}</p>
      <div className="mt-4 text-sm text-gray-500">
        {new Date(video.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}