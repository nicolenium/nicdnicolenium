
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Loader2, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { Slider } from '@/components/ui/slider.jsx';
import { Button } from '@/components/ui/button.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.jsx';
import { cn } from '@/lib/utils.js';

export default function VideoPlayer({ video, className }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isBuffering, setIsBuffering] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Robust YouTube URL parser
  const youtubeMatch = useMemo(() => {
    if (!video?.url) return null;
    const match = video.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    return match ? match[1] : null;
  }, [video?.url]);

  // Robust fallback sequence for raw HTML5 videos
  const [urlIndex, setUrlIndex] = useState(0);
  const videoUrls = useMemo(() => [
    video?.url && !youtubeMatch ? video.url : null,
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  ].filter(Boolean), [video, youtubeMatch]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || !isFinite(timeInSeconds)) return '0:00';
    const m = Math.floor(timeInSeconds / 60);
    const s = Math.floor(timeInSeconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    if (youtubeMatch) return; // YouTube iframe handles its own clicks unless overlaid
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        setIsBuffering(true); // Will clear when onPlaying fires
        videoRef.current.play().catch(err => {
          console.error("Playback failed", err);
          handleError();
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setHasError(false);
      setIsBuffering(false);
    }
  };

  const handleError = () => {
    console.warn(`Video failed to load: ${videoUrls[urlIndex]}`);
    if (urlIndex < videoUrls.length - 1) {
      setUrlIndex(prev => prev + 1);
      setIsBuffering(true);
      setHasError(false);
      if (isPlaying && videoRef.current) {
        setTimeout(() => videoRef.current?.play().catch(e => console.warn(e)), 500);
      }
    } else {
      setHasError(true);
      setIsBuffering(false);
      setIsPlaying(false);
    }
  };

  const handleProgressChange = (value) => {
    const newTime = (value[0] / 100) * duration;
    if (videoRef.current && isFinite(newTime)) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(value[0]);
    }
  };

  const handleVolumeChange = (value) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      if (!newMutedState && volume === 0) {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2500);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) setShowControls(false);
  };

  if (!video) return null;

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <div 
        ref={containerRef}
        className="relative group bg-black rounded-2xl overflow-hidden shadow-xl border-2 border-border flex flex-col aspect-video w-full"
        onMouseMove={youtubeMatch ? undefined : handleMouseMove}
        onMouseLeave={youtubeMatch ? undefined : handleMouseLeave}
        onClick={youtubeMatch ? undefined : togglePlay}
      >
        {youtubeMatch ? (
          <>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeMatch}?autoplay=0&rel=0&modestbranding=1`}
              title={video?.title || "YouTube video player"}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setIsBuffering(false)}
              onError={() => setHasError(true)}
            ></iframe>
            {isBuffering && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 pointer-events-none">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
            )}
          </>
        ) : (
          <>
            {hasError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/10 text-muted-foreground z-10 p-4 text-center">
                <AlertCircle className="w-12 h-12 mb-4 text-destructive" />
                <p className="font-bold text-lg">Failed to load video</p>
                <p className="text-sm mb-4">The media source is currently unavailable.</p>
                <Button variant="outline" onClick={() => { setUrlIndex(0); setHasError(false); setIsBuffering(true); }} className="font-bold border-2">
                  <RefreshCw className="w-4 h-4 mr-2" /> Retry Loading
                </Button>
              </div>
            ) : isBuffering ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 pointer-events-none">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
            ) : null}

            {!hasError && (
              <video
                ref={videoRef}
                src={videoUrls[urlIndex]}
                poster={video.thumbnail || 'https://images.unsplash.com/photo-1614315584058-3bfa462c8c65?auto=format&fit=crop&q=80&w=800'}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onWaiting={() => setIsBuffering(true)}
                onPlaying={() => setIsBuffering(false)}
                onEnded={() => setIsPlaying(false)}
                onError={handleError}
                crossOrigin="anonymous"
                playsInline
                preload="metadata"
              />
            )}

            {!isPlaying && !hasError && !isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300">
                <div className="w-20 h-20 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-glow-primary backdrop-blur-sm transform transition-transform hover:scale-110">
                  <Play className="w-10 h-10 ml-2" />
                </div>
              </div>
            )}

            <div 
              className={cn(
                "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pt-12 pb-4 transition-opacity duration-300",
                showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-medium text-white/90 tabular-nums w-10 text-right">{formatTime(currentTime)}</span>
                <Slider 
                  value={[progress]} 
                  max={100} 
                  step={0.1}
                  onValueChange={handleProgressChange}
                  className="cursor-pointer"
                />
                <span className="text-xs font-medium text-white/90 tabular-nums w-10">{formatTime(duration)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20 hover:text-white">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  
                  <div className="flex items-center gap-2 group/volume">
                    <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20 hover:text-white">
                      {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                    <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300 ease-in-out">
                      <Slider 
                        value={[isMuted ? 0 : volume]} 
                        max={1} 
                        step={0.05}
                        onValueChange={handleVolumeChange}
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
                        <Settings className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-black/90 text-white border-white/20 backdrop-blur-md">
                      <DropdownMenuItem className="focus:bg-white/20 focus:text-white cursor-pointer font-bold" onClick={() => changePlaybackRate(0.5)}>
                        0.5x {playbackRate === 0.5 && '✓'}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-white/20 focus:text-white cursor-pointer font-bold" onClick={() => changePlaybackRate(1)}>
                        1x (Normal) {playbackRate === 1 && '✓'}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-white/20 focus:text-white cursor-pointer font-bold" onClick={() => changePlaybackRate(1.5)}>
                        1.5x {playbackRate === 1.5 && '✓'}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-white/20 focus:text-white cursor-pointer font-bold" onClick={() => changePlaybackRate(2)}>
                        2x {playbackRate === 2 && '✓'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/20 hover:text-white">
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Video Attribution Display */}
      {video.attribution && (
        <div className="w-full flex items-center justify-between text-xs font-medium text-muted-foreground px-3 py-2 bg-muted/30 rounded-lg border border-border/50 mt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Info className="w-4 h-4 text-primary shrink-0" />
            <span>Video by <strong className="text-foreground">{video.attribution.creator}</strong></span>
            <span className="hidden sm:inline opacity-50">|</span>
            <span>License: <strong className="text-foreground">{video.attribution.license}</strong></span>
            <span className="hidden sm:inline opacity-50">|</span>
            <span className="truncate max-w-[200px] sm:max-w-none">Source: {video.attribution.source}</span>
          </div>
        </div>
      )}
    </div>
  );
}
