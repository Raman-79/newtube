'use client';

import { useState, useRef, useEffect } from 'react';
import PlaybackControls from './PlaybackControls';
import { VideoPlayerProps } from './types';

export function VideoPlayer({ videoFile, title, onError }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handleEnded = () => setPlaying(false);
    const handleCanPlay = () => setLoading(false);
    const handleError = (e: ErrorEvent) => {
      setLoading(false);
      onError?.(new Error('Video playback error'));
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError as EventListener);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError as EventListener);
    };
  }, [onError]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleSeek = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVolume: number) => {
    if (!videoRef.current) return;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const handleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const handleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  if (!videoFile) {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <span className="text-white">No video available</span>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative aspect-video bg-black rounded-lg overflow-hidden"
    >
      <video
        ref={videoRef}
        src={videoFile}
        className="w-full h-full"
        playsInline
        onClick={handlePlayPause}
        onContextMenu={(e) => e.preventDefault()}
      />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <PlaybackControls
        playing={playing}
        muted={muted}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isFullscreen={isFullscreen}
        onPlayPause={handlePlayPause}
        onMute={handleMute}
        onVolumeChange={handleVolumeChange}
        onSeek={handleSeek}
        onFullscreen={handleFullscreen}
      />
    </div>
  );
}