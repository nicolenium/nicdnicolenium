import React from 'react';
import { Clock, Cpu, User, Pause, Play, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { cn } from '@/lib/utils.js';

const formatTime = (ms) => {
  if (ms === Infinity) return '∞';
  if (isNaN(ms) || ms <= 0) return '00:00';
  
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
  const s = (totalSec % 60).toString().padStart(2, '0');
  
  // Show tenths of a second if under 10 seconds
  if (ms < 10000 && ms > 0) {
    const tenths = Math.floor((ms % 1000) / 100);
    return `00:0${s}.${tenths}`;
  }
  
  return `${m}:${s}`;
};

const TimerDisplay = ({ timeMs, isActive, label, isAI, isExpired, isPaused }) => {
  let colorClass = 'text-[hsl(var(--timer-normal,220_10%_90%))] dark:text-gray-200';
  let containerClass = 'border-border bg-muted/30';
  let pulseClass = '';

  if (isActive && !isPaused && timeMs !== Infinity) {
    containerClass = 'border-primary bg-card shadow-lg scale-[1.02] ring-2 ring-primary/20';
  }

  if (isExpired && timeMs !== Infinity) {
    colorClass = 'text-destructive';
    containerClass = 'border-destructive bg-destructive/10';
    pulseClass = 'animate-pulse';
  } else if (timeMs <= 10000 && timeMs !== Infinity) {
    // Critical (< 10s)
    colorClass = 'text-destructive';
    if (isActive && !isPaused) pulseClass = 'animate-pulse';
  } else if (timeMs <= 60000 && timeMs !== Infinity) {
    // Warning (< 60s)
    colorClass = 'text-amber-500';
  }

  return (
    <div className={cn("flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 w-full", containerClass)}>
      <div className="flex items-center gap-2 mb-1 opacity-70">
        {isAI ? <Cpu className="w-4 h-4" /> : <User className="w-4 h-4" />}
        <span className="text-xs font-bold uppercase tracking-widest truncate max-w-[120px]">{label}</span>
      </div>
      
      <div className={cn("flex items-center gap-2 font-mono text-3xl sm:text-4xl font-black tabular-nums tracking-tight", colorClass, pulseClass)}>
        <Clock className="w-5 h-5 sm:w-6 sm:h-6 opacity-80" />
        {formatTime(timeMs)}
      </div>
      
      {isExpired && timeMs !== Infinity && (
        <div className="mt-2 text-[10px] font-bold text-destructive uppercase tracking-widest flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> Time Out
        </div>
      )}
    </div>
  );
};

const GameTimer = ({ 
  timeP1, 
  timeP2, 
  activePlayer, 
  gameStatus,
  p1Name = "Player 1",
  p2Name = "Player 2",
  p1IsAI = false,
  p2IsAI = false,
  isPaused = false,
  onTogglePause
}) => {
  const isPlaying = gameStatus === 'active' || gameStatus === 'in_progress';

  return (
    <div className="flex flex-col gap-3 w-full relative">
      <TimerDisplay 
        timeMs={timeP2} 
        isActive={isPlaying && activePlayer === 2} 
        label={p2Name}
        isAI={p2IsAI}
        isExpired={timeP2 <= 0}
        isPaused={isPaused}
      />
      
      <div className="flex items-center justify-center relative my-1">
        <div className="h-[2px] flex-1 bg-border rounded-full"></div>
        {onTogglePause && (
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute z-10 w-8 h-8 rounded-full border-2 bg-background shadow-sm hover:scale-110 transition-transform"
            onClick={onTogglePause}
            disabled={gameStatus === 'completed'}
          >
            {isPaused ? <Play className="w-3 h-3 ml-0.5" /> : <Pause className="w-3 h-3" />}
          </Button>
        )}
        {!onTogglePause && <span className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-background">VS</span>}
        <div className="h-[2px] flex-1 bg-border rounded-full"></div>
      </div>

      <TimerDisplay 
        timeMs={timeP1} 
        isActive={isPlaying && activePlayer === 1} 
        label={p1Name}
        isAI={p1IsAI}
        isExpired={timeP1 <= 0}
        isPaused={isPaused}
      />
    </div>
  );
};

export default GameTimer;