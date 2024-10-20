
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Video = {
  id: string;
  title: string;
  thumbnailUrl: string;
  user: {
    name: string;
  };
};

export default function VideoGrid() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/videos');
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      const data = await response.json();
      setVideos(data.videos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div 
              key={index} 
              className="bg-gray-200 rounded-lg animate-pulse"
            >
              <div className="aspect-video bg-gray-300 rounded-t-lg" />
              <div className="p-3">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-300 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
          {error}
          <button 
            onClick={fetchVideos}
            className="ml-4 text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <Link 
            key={video.id} 
            href={`/videos/${video.id}`}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-video">
              <Image
                src={video.thumbnailUrl || '/api/placeholder/400/225'}
                alt={video.title}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
            
            <div className="p-3">
              <h3 className="font-medium text-gray-800 truncate">
                {video.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {video.user.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}