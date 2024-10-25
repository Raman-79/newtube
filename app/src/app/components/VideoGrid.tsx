import VideoCard from './VideoCard'; // Assuming this component is already defined
import { Video } from '../types'; // Assuming the Video type is defined in this path

interface VideoGridProps {
  videos: Video[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
  return (
    <div>
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">No videos available</p>
        </div>
      )}
    </div>
  );
}
