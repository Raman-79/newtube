import { Video } from '../types';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-gray-800 text-white">
      <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
      
      {/* Image styling */}
      <div className="w-full h-48 mb-4">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="w-full h-full object-cover rounded-md" 
        />
      </div>

      <p className="text-gray-400 mb-4">{video.description}</p>
      
      <div className="mt-4 text-sm text-gray-500">
        {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}
