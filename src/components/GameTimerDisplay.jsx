
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils.js';

const formatTime = (ms) => {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const TimerBox = ({ timeMs, playerName, isActive, isBottom, increment }) => {
  const isWarning = timeMs <= 10000 && timeMs > 3000;
  const isCritical = timeMs <= 3000;

  return (
    <div className={cn(
      "flex flex-col w-full max-w-[200px]",
      isBottom ? "items-end" : "items-start"
    )}>
      <div className="flex items-center gap-2 mb-1 px-1">
        <span className={cn(
          "text-sm font-bold truncate max-w-[120px]",
          isActive ? "text-primary" : "text-muted-foreground"
        )}>
          {playerName}
        </span>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-2 h-2 rounded-full bg-primary"
          />
        )}
      </div>
      
      <div className={cn(
        "game-clock w-full justify-between",
        isActive ? "border-primary/50 shadow-glow-primary" : "opacity-80",
        isWarning && "clock-warning",
        isCritical && "clock-critical"
      )}>
        <Clock className={cn(
          "w-5 h-5",
          isCritical ? "text-destructive animate-bounce" : "text-muted-foreground"
        )} />
        <div className="flex items-baseline gap-1">
          <span className="clock-display">
            {formatTime(timeMs)}
          </span>
          {increment > 0 && (
            <span className="text-xs font-bold text-muted-foreground flex items-center">
              +{increment} <Zap className="w-3 h-3 ml-0.5" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const GameTimerDisplay = ({ 
  player1Time = 300000, 
  player2Time = 300000, 
  player1Name = "Player 1", 
  player2Name = "Player 2", 
  activePlayer = 1,
  increment = 0,
  isRunning = false
}) => {
  const [p1Time, setP1Time] = useState(player1Time);
  const [p2Time, setP2Time] = useState(player2Time);

  useEffect(() => {
    setP1Time(player1Time);
    setP2Time(player2Time);
  }, [player1Time, player2Time]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (activePlayer === 1) {
        setP1Time(prev => Math.max(0, prev - 100));
      } else {
        setP2Time(prev => Math.max(0, prev - 100));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [activePlayer, isRunning]);

  return (
    <div className="flex flex-row md:flex-col justify-between items-center md:items-end h-full w-full gap-4 p-4 bg-card border border-border rounded-2xl shadow-sm">
      <TimerBox 
        timeMs={p2Time} 
        playerName={player2Name} 
        isActive={activePlayer === 2} 
        increment={increment}
      />
      
      <div className="hidden md:flex flex-1 w-full items-center justify-center">
        <div className="w-px h-full bg-border/50" />
      </div>

      <TimerBox 
        timeMs={p1Time} 
        playerName={player1Name} 
        isActive={activePlayer === 1} 
        isBottom={true}
        increment={increment}
      />
    </div>
  );
};

export default GameTimerDisplay;
