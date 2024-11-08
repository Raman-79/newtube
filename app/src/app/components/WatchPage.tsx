'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, ThumbsUp, Share2 } from 'lucide-react';
import { Video } from '../types';

interface WatchPageProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Comment {
  id: number;
  userId: string;
  content: string;
  likes: number;
  createdAt: Date;
}

export default function WatchPage({ video, isOpen, onClose }: WatchPageProps) {
  const [comments] = useState<Comment[]>([
    { 
      id: 1, 
      userId: "user1", 
      content: "Great video!", 
      likes: 123,
      createdAt: new Date()
    },
    // Add more sample comments as needed
  ]);

  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh]">
        <div className="flex flex-col h-full">
          {/* Video Player */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {video.videoFile ? (
              <video
                src={video.videoFile}
                controls
                className="w-full h-full"
                autoPlay
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                Video not available
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="mt-4">
            <h2 className="text-xl font-bold">{video.title}</h2>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>{video.userId[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-medium">User {video.userId}</span>
                  <p className="text-sm text-gray-500">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5" />
                  <span>Like</span>
                </button>
                <button className="flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
            <p className="mt-4 text-gray-700">{video.description}</p>
          </div>

          {/* Comments Section */}
          <ScrollArea className="flex-grow mt-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Comments
              </h3>
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-gray-50">
                  <Avatar>
                    <AvatarFallback>{comment.userId[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">User {comment.userId}</p>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1">{comment.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <button className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {comment.likes}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
