
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card.jsx';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils.js';

export function GameClockDisplay({ playerName, totalTimeSeconds, timeRemainingSeconds, isActive, onTimeExpired }) {
  const [timeLeft, setTimeLeft] = useState(timeRemainingSeconds);

  useEffect(() => {
    setTimeLeft(timeRemainingSeconds);
  }, [timeRemainingSeconds]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0 || totalTimeSeconds === Infinity || totalTimeSeconds === 0 || totalTimeSeconds === 'unlimited') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeExpired) onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, totalTimeSeconds, onTimeExpired]);

  const formatTime = (seconds) => {
    if (totalTimeSeconds === Infinity || totalTimeSeconds === 0 || totalTimeSeconds === 'unlimited') return '∞';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    // Format strictly as HH:MM:SS
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft > 0 && timeLeft <= 30 && totalTimeSeconds !== Infinity && totalTimeSeconds !== 0 && totalTimeSeconds !== 'unlimited';

  return (
    <Card className={cn(
      "flex flex-col items-center justify-center p-4 min-w-[120px] border-2 transition-all duration-300",
      isActive ? "border-primary shadow-glow-primary scale-105 bg-card" : "border-border bg-muted/50 opacity-80",
      isLowTime && isActive ? "border-destructive shadow-glow-destructive animate-pulse" : ""
    )}>
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 truncate w-full text-center">
        {playerName}
      </span>
      <div className={cn(
        "text-3xl font-black tabular-nums flex items-center gap-2",
        isLowTime && isActive ? "text-destructive" : "text-foreground"
      )}>
        <Clock className={cn("w-5 h-5", isActive ? "animate-spin-slow" : "")} />
        {formatTime(timeLeft)}
      </div>
    </Card>
  );
}
