import { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { Slider } from "@/components/ui/slider";

interface PlaybackControlsProps {
  playing: boolean;
  muted: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isFullscreen: boolean;
  onPlayPause: () => void;
  onMute: () => void;
  onVolumeChange: (value: number) => void;
  onSeek: (value: number) => void;
  onFullscreen: () => void;
}

export default function PlaybackControls({
  playing,
  muted,
  currentTime,
  duration,
  volume,
  isFullscreen,
  onPlayPause,
  onMute,
  onVolumeChange,
  onSeek,
  onFullscreen,
}: PlaybackControlsProps) {
  const [showControls, setShowControls] = useState(true);
  const [seeking, setSeeking] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (playing && !seeking) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [playing, seeking]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${
        showControls || !playing ? 'opacity-100' : 'opacity-0'
      }`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* Progress bar */}
      <div className="mb-4">
        <Slider
          value={[currentTime]}
          max={duration}
          step={1}
          onValueChange={(value) => onSeek(value[0])}
          onMouseDown={() => setSeeking(true)}
          onMouseUp={() => setSeeking(false)}
          className="h-1"
        />
        <div className="flex justify-between text-xs text-white mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onPlayPause}
            className="text-white hover:text-white/80 transition"
          >
            {playing ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={() => onSeek(Math.max(0, currentTime - 10))}
            className="text-white hover:text-white/80 transition"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={() => onSeek(Math.min(duration, currentTime + 10))}
            className="text-white hover:text-white/80 transition"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onMute}
              className="text-white hover:text-white/80 transition"
            >
              {muted || volume === 0 ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </button>
            <Slider
              value={[muted ? 0 : volume * 100]}
              max={100}
              step={1}
              onValueChange={(value) => onVolumeChange(value[0] / 100)}
              className="w-24 h-1"
            />
          </div>
        </div>

        <button
          onClick={onFullscreen}
          className="text-white hover:text-white/80 transition"
        >
          {isFullscreen ? (
            <Minimize className="w-6 h-6" />
          ) : (
            <Maximize className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}