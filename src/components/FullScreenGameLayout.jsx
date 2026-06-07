
import React, { useState, useEffect, useCallback } from 'react';
import { Maximize, Minimize, X, Menu, Undo, Pause, Flag, HeartHandshake as Handshake, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import BrandingWatermark from '@/components/BrandingWatermark.jsx';
import VideoRecordingButton from '@/components/VideoRecordingButton.jsx';
import LocationDisplay from '@/components/LocationDisplay.jsx';

const FullScreenGameLayout = ({ 
  title, 
  mode, 
  difficulty, 
  timeControl, 
  onExit, 
  rightPanelContent, 
  bottomBarContent, 
  children 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false); // Default hidden on mobile
  const [isLoading, setIsLoading] = useState(true);

  // Auto-open panel on wider screens
  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth >= 1024) {
        setIsRightPanelOpen(true);
      } else {
        setIsRightPanelOpen(false);
      }
    };
    
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const toggleFullscreen = useCallback(() => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          toast.error(`Fullscreen error: ${err.message}`);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    } catch (error) {
      console.error("Fullscreen toggle failed:", error);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      try {
        switch(e.key.toLowerCase()) {
          case 'f': toggleFullscreen(); break;
          case 'escape': if (isFullscreen) toggleFullscreen(); break;
          case 'l': setIsRightPanelOpen(prev => !prev); break;
          default: break;
        }
      } catch (err) {
        console.error("Keydown handler error:", err);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    const timer = setTimeout(() => setIsLoading(false), 800);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isFullscreen, toggleFullscreen]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center">
        <div className="relative flex flex-col items-center">
          <img src="/nicd-logo.svg" alt="NICD Logo" className="h-20 mb-8 animate-pulse" />
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground font-medium tracking-widest uppercase text-sm">Loading Game Environment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-layout-wrapper flex flex-col h-[calc(100vh-4rem)] relative overflow-hidden">
      <BrandingWatermark position="bottom-right" />
      
      {/* TOP BAR */}
      <div className="game-top-bar relative z-30 bg-background/95 backdrop-blur border-b border-border p-3 md:p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
          <div className="font-bold text-base md:text-lg truncate">{title}</div>
          <div className="hidden lg:flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest ml-4 shrink-0">
            {mode && <span className="bg-primary/10 border border-primary/30 px-2 py-1 rounded-full">{mode.replace(/_/g, ' ')}</span>}
            {difficulty && <span className="bg-primary/10 border border-primary/30 px-2 py-1 rounded-full">{difficulty}</span>}
            {timeControl && <span className="bg-primary/10 border border-primary/30 px-2 py-1 rounded-full">{timeControl}</span>}
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-3 shrink-0">
          <div className="hidden sm:block"><LocationDisplay /></div>
          <div className="hidden sm:block"><VideoRecordingButton /></div>
          
          <div className="h-6 w-px bg-border/50 mx-1 hidden md:block"></div>

          <Button variant="ghost" size="icon" onClick={toggleFullscreen} title="Toggle Fullscreen (F)" className="h-8 w-8 md:h-10 md:w-10">
            {isFullscreen ? <Minimize className="w-4 h-4 md:w-5 md:h-5 text-primary" /> : <Maximize className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsRightPanelOpen(!isRightPanelOpen)} title="Toggle Panel (L)" className="lg:hidden h-8 w-8 md:h-10 md:w-10">
            <Menu className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          </Button>
          <Button variant="destructive" size="sm" onClick={onExit} className="ml-1 md:ml-2 font-bold uppercase tracking-wider h-8 md:h-10 text-xs md:text-sm">
            <X className="w-4 h-4 md:mr-1" /> <span className="hidden sm:inline">Exit</span>
          </Button>
        </div>
      </div>

      {/* MAIN GAME AREA */}
      <div className="game-main-area flex-1 flex overflow-hidden relative w-full">
        <div className="game-board-container flex-1 flex items-center justify-center p-2 sm:p-4 overflow-auto relative z-10 w-full">
          {children}
        </div>

        {/* OVERLAY FOR MOBILE */}
        {isRightPanelOpen && (
          <div 
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsRightPanelOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* RIGHT PANEL */}
        <div className={`
          game-right-panel bg-card border-l border-border transition-transform duration-300 z-50
          fixed inset-y-0 right-0 pt-16 md:pt-20 lg:pt-0 lg:static lg:block
          w-72 md:w-80 shrink-0
          ${!isRightPanelOpen ? 'translate-x-full lg:translate-x-0 lg:hidden' : 'translate-x-0'}
        `}>
          <div className="h-full overflow-y-auto p-4 space-y-6">
            {rightPanelContent}
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="game-bottom-bar relative z-30 bg-background/95 backdrop-blur border-t border-border p-2 md:p-3 shrink-0">
        <div className="flex-1 flex items-center gap-2 justify-center sm:justify-start overflow-x-auto pb-1 sm:pb-0">
          {bottomBarContent || (
            <>
              <Button variant="outline" size="sm" title="Undo (U)" className="border-border hover:border-primary shrink-0"><Undo className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Undo</span></Button>
              <Button variant="outline" size="sm" title="Pause (P)" className="border-border hover:border-primary shrink-0"><Pause className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Pause</span></Button>
              <Button variant="outline" size="sm" title="Resign (R)" className="border-border hover:border-primary shrink-0"><Flag className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Resign</span></Button>
              <Button variant="outline" size="sm" title="Offer Draw (D)" className="border-border hover:border-primary shrink-0"><Handshake className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Draw</span></Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullScreenGameLayout;
