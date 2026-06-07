
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Timer, AlertCircle } from 'lucide-react';

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const GameClock = ({ 
  activePlayer, 
  timeControl = 'rapid', 
  initialTime = 600, // 10 minutes default
  increment = 0, 
  onTimeExpired 
}) => {
  const [timeP1, setTimeP1] = useState(initialTime);
  const [timeP2, setTimeP2] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [lastMoveTime, setLastMoveTime] = useState(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    if (activePlayer && isRunning) {
      timerRef.current = setInterval(() => {
        if (activePlayer === 1) {
          setTimeP1(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              onTimeExpired(1);
              return 0;
            }
            return prev - 1;
          });
        } else {
          setTimeP2(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              onTimeExpired(2);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [activePlayer, isRunning, onTimeExpired]);

  // Handle increment on player switch
  const prevPlayerRef = useRef(activePlayer);
  useEffect(() => {
    if (prevPlayerRef.current !== activePlayer && isRunning) {
      if (prevPlayerRef.current === 1) setTimeP1(t => t + increment);
      if (prevPlayerRef.current === 2) setTimeP2(t => t + increment);
      setLastMoveTime(Date.now());
    }
    prevPlayerRef.current = activePlayer;
  }, [activePlayer, increment, isRunning]);

  // Start clock on first move
  useEffect(() => {
    if (activePlayer && !isRunning) {
      setIsRunning(true);
    }
  }, [activePlayer, isRunning]);

  const p1Critical = timeP1 < 60;
  const p2Critical = timeP2 < 60;

  return (
    <Card className="bg-card border-border shadow-sm overflow-hidden mb-6">
      <CardContent className="p-0">
        <div className="flex divide-x divide-border">
          {/* Player 1 Clock */}
          <div className={`flex-1 p-4 flex flex-col items-center justify-center transition-colors duration-300 ${activePlayer === 1 ? 'bg-primary/5' : ''} ${p1Critical && activePlayer === 1 ? 'animate-pulse bg-destructive/10' : ''}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">White (P1)</span>
            <div className={`text-3xl font-black tabular-nums tracking-tight flex items-center gap-2 ${p1Critical ? 'text-destructive' : 'text-foreground'}`}>
              {p1Critical && <AlertCircle className="w-5 h-5" />}
              {formatTime(timeP1)}
            </div>
          </div>
          
          {/* Central Info */}
          <div className="w-16 bg-muted/30 flex flex-col items-center justify-center text-muted-foreground p-2">
            <Timer className="w-4 h-4 mb-1 opacity-50" />
            <span className="text-[10px] font-bold uppercase">{timeControl}</span>
            {increment > 0 && <span className="text-[10px] font-bold">+{increment}s</span>}
          </div>

          {/* Player 2 Clock */}
          <div className={`flex-1 p-4 flex flex-col items-center justify-center transition-colors duration-300 ${activePlayer === 2 ? 'bg-primary/5' : ''} ${p2Critical && activePlayer === 2 ? 'animate-pulse bg-destructive/10' : ''}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Black (P2)</span>
            <div className={`text-3xl font-black tabular-nums tracking-tight flex items-center gap-2 ${p2Critical ? 'text-destructive' : 'text-foreground'}`}>
              {p2Critical && <AlertCircle className="w-5 h-5" />}
              {formatTime(timeP2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameClock;
