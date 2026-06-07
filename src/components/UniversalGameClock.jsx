
import React, { useState, useEffect } from 'react';
import { Pause, Play, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UniversalGameClock({ 
  isActive, 
  onTimeout, 
  initialSeconds = 60, 
  resetTrigger, 
  onPauseChange, 
  className 
}) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setTimeLeft(initialSeconds);
    setIsPaused(false);
    if (onPauseChange) onPauseChange(false);
  }, [initialSeconds, resetTrigger]);

  useEffect(() => {
    if (!isActive || isPaused || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive, isPaused, timeLeft, onTimeout]);

  const togglePause = () => {
    const newPause = !isPaused;
    setIsPaused(newPause);
    if (onPauseChange) onPauseChange(newPause);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isLow = timeLeft > 0 && timeLeft <= 15;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${isLow ? 'bg-destructive/10 border-destructive text-destructive animate-pulse shadow-[0_0_15px_rgba(255,0,0,0.3)]' : 'bg-card border-border'} ${className}`}>
      <Clock className={`w-5 h-5 ${isLow ? 'text-destructive' : 'text-primary'}`} />
      <span className="text-xl font-bold font-mono tabular-nums tracking-wider">
        {mins}:{secs.toString().padStart(2, '0')}
      </span>
      {isLow && <AlertTriangle className="w-5 h-5 text-destructive animate-bounce" />}
      <Button variant="ghost" size="icon" className="h-8 w-8 ml-2 hover:bg-muted" onClick={togglePause} title={isPaused ? "Resume Timer" : "Pause Timer"}>
        {isPaused ? <Play className="w-4 h-4 text-green-500" /> : <Pause className="w-4 h-4" />}
      </Button>
    </div>
  );
}
