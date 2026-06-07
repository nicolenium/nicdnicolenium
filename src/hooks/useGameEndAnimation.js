
import { useState, useEffect } from 'react';

export function useGameEndAnimation(gameStatus) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeAnimation, setActiveAnimation] = useState(null);

  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      setActiveAnimation(gameStatus);
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setActiveAnimation(null);
      }, 4000);
      
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      setActiveAnimation(null);
    }
  }, [gameStatus]);

  return { isAnimating, activeAnimation };
}
