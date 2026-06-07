
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { cn } from '@/lib/utils.js';

export default function AudioPlayerFixed({ audioUrl, title, transcript, className }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const audioRef = useRef(null);

  // Fallback to a reliable audio file if the provided one fails or is missing
  const activeUrl = audioUrl || 'https://actions.google.com/sounds/v1/speech/spanish_greeting.ogg';

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, [activeUrl]);

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || !isFinite(timeInSeconds)) return '0:00';
    const m = Math.floor(timeInSeconds / 60);
    const s = Math.floor(timeInSeconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setHasError(false);
            })
            .catch(err => {
              console.error("Audio playback failed:", err);
              setHasError(true);
              setIsPlaying(false);
            });
        }
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
      setHasError(false);
    }
  };

  const handleError = () => {
    console.error(`Audio failed to load: ${activeUrl}`);
    setHasError(true);
    setIsLoading(false);
    setIsPlaying(false);
  };

  const handleProgressChange = (value) => {
    const newTime = (value[0] / 100) * duration;
    if (audioRef.current && isFinite(newTime)) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(value[0]);
    }
  };

  const handleVolumeChange = (value) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      if (!newMutedState && volume === 0) {
        setVolume(1);
        audioRef.current.volume = 1;
      }
    }
  };

  const retryLoading = () => {
    setHasError(false);
    setIsLoading(true);
    if (audioRef.current) {
      audioRef.current.load();
    }
  };

  return (
    <div className={cn("w-full flex flex-col gap-4", className)}>
      <div className="bg-card border-2 border-border rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col gap-4">
        {hasError ? (
          <div className="bg-destructive/10 rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center text-center gap-3 border border-destructive/20">
            <AlertCircle className="w-10 h-10 text-destructive" />
            <div className="space-y-1">
              <p className="font-bold text-foreground">Audio temporarily unavailable</p>
              <p className="text-sm text-muted-foreground">Please check your connection or use the text guide below.</p>
            </div>
            <Button onClick={retryLoading} variant="outline" size="sm" className="mt-2 font-bold border-2">
              <RefreshCw className="w-4 h-4 mr-2" /> Retry Connection
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Button 
              onClick={togglePlay} 
              disabled={isLoading}
              className={cn(
                "w-14 h-14 rounded-full shrink-0 flex items-center justify-center shadow-md transition-all duration-300",
                isPlaying ? "bg-primary text-primary-foreground scale-95" : "bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105"
              )}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </Button>

            <div className="flex-1 w-full flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm font-bold text-foreground">
                <span className="truncate pr-4">{title || "Audio Guide"}</span>
                <span className="text-muted-foreground tabular-nums text-xs">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <Slider 
                value={[progress || 0]} 
                max={100} 
                step={0.1}
                onValueChange={handleProgressChange}
                disabled={isLoading}
                className="cursor-pointer py-2"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
              <Button variant="ghost" size="icon" onClick={toggleMute} className="text-muted-foreground hover:text-foreground">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <Slider 
                value={[isMuted ? 0 : volume]} 
                max={1} 
                step={0.05}
                onValueChange={handleVolumeChange}
                className="w-20 hidden sm:flex"
              />
            </div>
          </div>
        )}

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={activeUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          onError={handleError}
          preload="metadata"
        />
      </div>

      {transcript && (
        <div className="bg-muted/30 rounded-2xl p-5 border border-border/50">
          <h4 className="text-sm font-bold flex items-center gap-2 mb-3 text-foreground">
            <FileText className="w-4 h-4 text-primary" /> Transcript & Text Guide
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {transcript}
          </p>
        </div>
      )}
    </div>
  );
}
