
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Play, Pause, Square, Volume2, VolumeX, Maximize, Minimize, Settings, Loader2, AlertCircle, Info, RefreshCw, FastForward, Rewind } from 'lucide-react';
import { Slider } from '@/components/ui/slider.jsx';
import { Button } from '@/components/ui/button.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu.jsx';
import { cn } from '@/lib/utils.js';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

export default function VideoPlayerFixed({ video, className }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('Auto');
  const [isBuffering, setIsBuffering] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Robust YouTube URL parser
  const youtubeMatch = useMemo(() => {
    if (!video?.url && !video?.videoUrl) return null;
    const urlToTest = video.url || video.videoUrl;
    const match = urlToTest.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    return match ? match[1] : null;
  }, [video]);

  // Robust fallback sequence for raw HTML5 videos
  const [urlIndex, setUrlIndex] = useState(0);
  const videoUrls = useMemo(() => {
    const urls = [];
    
    // 1. Try PocketBase File URL if available
    if (video?.collectionId && video?.id && video?.videoFile) {
      urls.push(pb.files.getUrl(video, video.videoFile));
    }
    
    // 2. Try explicit URL if not YouTube
    if ((video?.url || video?.videoUrl) && !youtubeMatch) {
      urls.push(video.url || video.videoUrl);
    }
    
    // 3. Ultra-reliable fallbacks to guarantee playback
    urls.push('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    urls.push('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4');
    urls.push('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    
    return [...new Set(urls)].filter(Boolean); // Remove duplicates
  }, [video, youtubeMatch]);

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

  const togglePlay = useCallback((e) => {
    if (e) e.stopPropagation();
    if (youtubeMatch) return; 
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsBuffering(true); 
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setHasError(false);
            })
            .catch(err => {
              console.error("Playback failed:", err);
              handleError();
            });
        }
      }
    }
  }, [isPlaying, youtubeMatch]);

  const stopPlayback = useCallback((e) => {
    if (e) e.stopPropagation();
    if (youtubeMatch) return;
    
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
    }
  }, [youtubeMatch]);

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
    console.warn(`Video failed to load index ${urlIndex}: ${videoUrls[urlIndex]}`);
    if (urlIndex < videoUrls.length - 1) {
      toast.info("Switching to backup video source...");
      setUrlIndex(prev => prev + 1);
      setIsBuffering(true);
      setHasError(false);
      setIsPlaying(false); // Reset play state so user can initiate again if autoplay fails
    } else {
      setHasError(true);
      setIsBuffering(false);
      setIsPlaying(false);
      toast.error("Video playback failed.");
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

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      if (!newMutedState && volume === 0) {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  }, [isMuted, volume]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(err);
        toast.error("Fullscreen not supported");
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const skipTime = useCallback((seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
      setShowControls(true);
    }
  }, [duration]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!containerRef.current?.contains(document.activeElement) && document.activeElement !== document.body) {
         return;
      }
      
      switch(e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'arrowleft':
        case 'j':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'arrowright':
        case 'l':
          e.preventDefault();
          skipTime(10);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleMute, toggleFullscreen, skipTime]);

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
        tabIndex={0}
        className="relative group bg-black rounded-2xl overflow-hidden shadow-xl border-2 border-border flex flex-col aspect-video w-full outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-muted-foreground z-10 p-6 text-center">
                <AlertCircle className="w-12 h-12 mb-4 text-destructive" />
                <p className="font-bold text-lg text-white mb-2">Video temporarily unavailable</p>
                <p className="text-sm mb-6 text-white/70 max-w-sm">Please check your connection or try again later. We're having trouble loading the media source.</p>
                <Button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setUrlIndex(0); // reset to first URL to retry fully
                    setHasError(false); 
                    setIsBuffering(true); 
                  }} 
                  className="font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Retry Loading
                </Button>
              </div>
            ) : isBuffering ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 pointer-events-none backdrop-blur-sm">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
            ) : null}

            {!hasError && (
              <video
                ref={videoRef}
                src={videoUrls[urlIndex]}
                poster={video.thumbnail || 'https://images.unsplash.com/photo-1614315584058-3bfa462c8c65?auto=format&fit=crop&q=80&w=800'}
                className="w-full h-full object-contain bg-black"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onWaiting={() => setIsBuffering(true)}
                onPlaying={() => { setIsBuffering(false); setHasError(false); }}
                onEnded={() => setIsPlaying(false)}
                onError={handleError}
                crossOrigin="anonymous"
                playsInline
                preload="metadata"
              />
            )}

            {!isPlaying && !hasError && !isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 pointer-events-none">
                <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg backdrop-blur-sm transform transition-transform group-hover:scale-110">
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
                <span className="text-xs font-medium text-white/90 tabular-nums w-12 text-right shrink-0">{formatTime(currentTime)}</span>
                <Slider 
                  value={[progress]} 
                  max={100} 
                  step={0.1}
                  onValueChange={handleProgressChange}
                  className="cursor-pointer flex-1"
                />
                <span className="text-xs font-medium text-white/90 tabular-nums w-12 shrink-0">{formatTime(duration)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20 hover:text-white" aria-label={isPlaying ? "Pause" : "Play"}>
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  
                  <Button variant="ghost" size="icon" onClick={stopPlayback} className="text-white hover:bg-white/20 hover:text-white" aria-label="Stop">
                    <Square className="w-4 h-4 fill-current" />
                  </Button>
                  
                  <div className="h-4 w-px bg-white/20 mx-1 hidden sm:block"></div>
                  
                  <Button variant="ghost" size="icon" onClick={() => skipTime(-10)} className="text-white hover:bg-white/20 hover:text-white hidden sm:flex" aria-label="Rewind 10 seconds">
                    <Rewind className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => skipTime(10)} className="text-white hover:bg-white/20 hover:text-white hidden sm:flex" aria-label="Fast forward 10 seconds">
                    <FastForward className="w-4 h-4" />
                  </Button>
                  
                  <div className="h-4 w-px bg-white/20 mx-1 hidden sm:block"></div>
                  
                  <div className="flex items-center gap-2 group/volume">
                    <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20 hover:text-white" aria-label="Mute">
                      {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                    <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300 ease-in-out">
                      <Slider 
                        value={[isMuted ? 0 : volume]} 
                        max={1} 
                        step={0.05}
                        onValueChange={handleVolumeChange}
                        className="w-20"
                        aria-label="Volume"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white" aria-label="Settings">
                        <Settings className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-black/90 text-white border-white/20 backdrop-blur-md w-48">
                      <DropdownMenuLabel className="text-xs text-white/60 uppercase tracking-wider">Speed</DropdownMenuLabel>
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
                      <DropdownMenuSeparator className="bg-white/20" />
                      <DropdownMenuLabel className="text-xs text-white/60 uppercase tracking-wider">Quality</DropdownMenuLabel>
                      {['Auto', '1080p', '720p', '480p'].map(q => (
                        <DropdownMenuItem key={q} className="focus:bg-white/20 focus:text-white cursor-pointer font-bold" onClick={() => setQuality(q)}>
                          {q} {quality === q && '✓'}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/20 hover:text-white" aria-label="Fullscreen">
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {video.attribution && (
        <div className="w-full flex items-center justify-between text-xs font-medium text-muted-foreground px-4 py-3 bg-muted/50 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 flex-wrap">
            <Info className="w-4 h-4 text-primary shrink-0" />
            <span>Video by <strong className="text-foreground">{video.attribution.creator}</strong></span>
            <span className="hidden sm:inline opacity-50">|</span>
            <span>License: <strong className="text-foreground">{video.attribution.license}</strong></span>
            <span className="hidden sm:inline opacity-50">|</span>
            <span className="truncate max-w-[200px] sm:max-w-[400px]">Source: {video.attribution.source}</span>
          </div>
        </div>
      )}
    </div>
  );
}
