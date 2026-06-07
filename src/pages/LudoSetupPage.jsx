import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameSetupLayout from '@/components/GameSetupLayout.jsx';

export default function LudoSetupPage() {
  const navigate = useNavigate();

  const handleStart = (settings) => {
    navigate('/ludo', { state: { settings } });
  };

  const specificRules = [
    { id: 'requireSixToStart', label: 'Require 6 to start', description: 'A 6 is required to move a token out of the base.', default: true },
    { id: 'safeStars', label: 'Safe Star Squares', description: 'Tokens cannot be captured on star squares.', default: true },
    { id: 'blockades', label: 'Allow Blockades', description: 'Two tokens of same color form an impassable blockade.', default: true },
    { id: 'bonusRollCapture', label: 'Bonus roll on capture', description: 'Get another roll after capturing opponent.', default: true }
  ];

  return (
    <GameSetupLayout 
      gameName="Ludo" 
      gameType="ludo" 
      specificRules={specificRules}
      onStart={handleStart} 
    />
  );
}