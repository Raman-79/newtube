'use client';

import { useSession } from 'next-auth/react';
import VideoCard from './components/VideoCard';
import { Video } from './types';

// Mock data - replace with actual data fetching
//@ts-ignore
const mockVideos:any = [];

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to Video Platform</h1>
      
      {!session ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">
            Please sign in to view and upload videos
          </p>
        </div>
      ) : mockVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  
          {mockVideos.map((video:Video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">No videos to show</p>
        </div>
      )}
    </div>
  );
}
