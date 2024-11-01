'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <Card 
      className="cursor-pointer transition-transform hover:scale-105" 
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-100">
          {video.videoFile ? (
            <video
              src={video.videoFile}
              className="object-cover w-full h-full"
              preload="metadata"
            />
          ) : (
            // Placeholder for videos without videoFile
            <div className="w-full h-full flex items-center justify-center">
              {/* <span className="text-gray-400">Video Preview</span> */}
              <img className='rounded-lg' alt="thumbnail" src={video.thumbnailUrl} />
            </div>
          )}
        </div>
        <div className="mt-3">
          <h3 className="font-semibold line-clamp-2">{video.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(video.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {video.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}