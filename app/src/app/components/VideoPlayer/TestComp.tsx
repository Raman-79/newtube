import React, { useState, useCallback, useEffect } from 'react';
import { VideoPlayer } from './index';

export default function TestComp() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Clean up object URL when component unmounts or when new file is selected
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clean up previous object URL if it exists
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }

    // Create a blob URL for the video file
    const newVideoUrl = URL.createObjectURL(file);
    setVideoUrl(newVideoUrl);
  }, [videoUrl]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <input
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="mb-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      
      {videoUrl && (
        <VideoPlayer
          videoFile={videoUrl}
          title=""
          onError={(error) => console.error('Video playback error:', error)}
        />
      )}
    </div>
  );
}