
import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils.js';

const GameTimerPanel = ({ currentPlayer, player1Name, player2Name, p1InitialTime = 0, p2InitialTime = 0, onTimeout }) => {
  const [time1, setTime1] = useState(p1InitialTime);
  const [time2, setTime2] = useState(p2InitialTime);

  useEffect(() => {
    // If time is 0, it means No Limit
    if (currentPlayer === 1 && p1InitialTime === 0) return;
    if (currentPlayer === 2 && p2InitialTime === 0) return;

    const timer = setInterval(() => {
      if (currentPlayer === 1) {
        setTime1(t => {
          if (t <= 1) {
            clearInterval(timer);
            onTimeout(1);
            return 0;
          }
          return t - 1;
        });
      } else {
        setTime2(t => {
          if (t <= 1) {
            clearInterval(timer);
            onTimeout(2);
            return 0;
          }
          return t - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPlayer, onTimeout, p1InitialTime, p2InitialTime]);

  const formatTime = (seconds) => {
    if (seconds === 0) return "∞";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isLowTime = (time, initial) => initial > 0 && time > 0 && time <= 60;

  return (
    <div className="flex justify-between items-center bg-card border border-border rounded-2xl p-4 shadow-sm w-full">
      <div className={cn(
        "flex flex-col items-center px-6 py-3 rounded-xl transition-all w-1/3",
        currentPlayer === 1 ? "bg-primary/10 ring-2 ring-primary scale-105" : "opacity-60",
        isLowTime(time1, p1InitialTime) && "bg-destructive/10 ring-destructive text-destructive animate-pulse"
      )}>
        <span className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80 truncate w-full text-center">{player1Name}</span>
        <div className="flex items-center gap-2 text-3xl font-bold tabular-nums">
          {isLowTime(time1, p1InitialTime) ? <AlertTriangle className="w-5 h-5" /> : <Clock className="w-5 h-5 opacity-50" />}
          {formatTime(p1InitialTime === 0 ? 0 : time1)}
        </div>
      </div>

      <div className="text-muted-foreground font-black text-sm uppercase tracking-widest px-4">VS</div>

      <div className={cn(
        "flex flex-col items-center px-6 py-3 rounded-xl transition-all w-1/3",
        currentPlayer === 2 ? "bg-primary/10 ring-2 ring-primary scale-105" : "opacity-60",
        isLowTime(time2, p2InitialTime) && "bg-destructive/10 ring-destructive text-destructive animate-pulse"
      )}>
        <span className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80 truncate w-full text-center">{player2Name}</span>
        <div className="flex items-center gap-2 text-3xl font-bold tabular-nums">
          {isLowTime(time2, p2InitialTime) ? <AlertTriangle className="w-5 h-5" /> : <Clock className="w-5 h-5 opacity-50" />}
          {formatTime(p2InitialTime === 0 ? 0 : time2)}
        </div>
      </div>
    </div>
  );
};

export default GameTimerPanel;
