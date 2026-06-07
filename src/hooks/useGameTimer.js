
import { useState, useEffect, useRef, useCallback } from 'react';

export const useGameTimer = (initialSeconds, activePlayer, isGameOver) => {
  const initialMs = initialSeconds === Infinity ? Infinity : initialSeconds * 1000;
  
  const [timeP1, setTimeP1] = useState(initialMs);
  const [timeP2, setTimeP2] = useState(initialMs);
  const [isPaused, setIsPaused] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [loser, setLoser] = useState(null);
  
  const lastTick = useRef(Date.now());

  useEffect(() => {
    if (isGameOver || initialMs === Infinity || isPaused || isTimeUp) return;
    
    lastTick.current = Date.now();
    
    const interval = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTick.current;
      lastTick.current = now;
      
      if (activePlayer === 1) {
        setTimeP1(prev => {
          const next = Math.max(0, prev - delta);
          if (next === 0 && !isTimeUp) {
            setIsTimeUp(true);
            setLoser(1);
          }
          return next;
        });
      } else if (activePlayer === 2) {
        setTimeP2(prev => {
          const next = Math.max(0, prev - delta);
          if (next === 0 && !isTimeUp) {
            setIsTimeUp(true);
            setLoser(2);
          }
          return next;
        });
      }
    }, 100); // 100ms interval for efficiency
    
    return () => clearInterval(interval);
  }, [activePlayer, isGameOver, isPaused, initialMs, isTimeUp]);

  const resetTimer = useCallback((newInitialSeconds = initialSeconds) => {
    const newInitialMs = newInitialSeconds === Infinity ? Infinity : newInitialSeconds * 1000;
    setTimeP1(newInitialMs);
    setTimeP2(newInitialMs);
    setIsPaused(false);
    setIsTimeUp(false);
    setLoser(null);
    lastTick.current = Date.now();
  }, [initialSeconds]);

  const togglePause = useCallback(() => {
    if (!isPaused) {
      setIsPaused(true);
    } else {
      lastTick.current = Date.now();
      setIsPaused(false);
    }
  }, [isPaused]);

  return { 
    timeP1, 
    timeP2, 
    isTimeUp, 
    loser, 
    resetTimer, 
    isPaused, 
    togglePause 
  };
};
