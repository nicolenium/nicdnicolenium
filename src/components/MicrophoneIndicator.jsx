
import React, { useEffect } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMicrophone } from '@/contexts/MicrophoneContext.jsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const MicrophoneIndicator = () => {
  const { stream, isMuted, volumeLevel, toggleMicrophoneMute, permissionStatus } = useMicrophone();

  // Draw audio bars
  const renderBars = () => {
    const bars = 5;
    const activeBars = Math.ceil((volumeLevel / 100) * bars);
    return Array.from({ length: bars }).map((_, i) => (
      <div 
        key={i} 
        className={`audio-bar ${i < activeBars && !isMuted ? 'opacity-100 bg-[hsl(var(--microphone-active))]' : 'opacity-20 bg-muted-foreground'}`}
        style={{ height: `${Math.max(4, (i + 1) * 3)}px` }}
      />
    ));
  };

  if (permissionStatus === 'denied') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="text-[hsl(var(--microphone-error))] hover:bg-destructive/10">
              <AlertCircle className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Microphone Access Denied</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (!stream) return null;

  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-card rounded-full border border-border/50">
      <Button 
        variant="ghost" 
        size="icon" 
        className={`h-8 w-8 rounded-full ${isMuted ? 'text-[hsl(var(--microphone-error))] bg-[hsl(var(--microphone-error))]/10' : 'text-[hsl(var(--microphone-active))] hover:bg-[hsl(var(--microphone-active))]/10'}`}
        onClick={toggleMicrophoneMute}
        aria-label={isMuted ? "Unmute Microphone" : "Mute Microphone"}
      >
        {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </Button>
      
      <div className="flex items-end gap-[2px] h-4 pr-2">
        {renderBars()}
      </div>
    </div>
  );
};

export default MicrophoneIndicator;
