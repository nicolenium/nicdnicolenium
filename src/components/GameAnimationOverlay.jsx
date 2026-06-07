
import React from 'react';
import { useGameEndAnimation } from '@/hooks/useGameEndAnimation.js';
import FireAnimation from './FireAnimation.jsx';
import RainAnimation from './RainAnimation.jsx';
import { AnimatePresence } from 'framer-motion';

export default function GameAnimationOverlay({ gameStatus, children }) {
  const { isAnimating, activeAnimation } = useGameEndAnimation(gameStatus);

  return (
    <div className="relative w-full h-full rounded-inherit">
      {children}
      <AnimatePresence>
        {isAnimating && activeAnimation === 'won' && <FireAnimation key="fire" />}
        {isAnimating && activeAnimation === 'lost' && <RainAnimation key="rain" />}
      </AnimatePresence>
    </div>
  );
}
