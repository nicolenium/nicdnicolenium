import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameSetupLayout from '@/components/GameSetupLayout.jsx';

export default function MathGamesSetupPage() {
  const navigate = useNavigate();

  const handleStart = (settings) => {
    navigate('/math-games-game', { state: { settings } });
  };

  return (
    <GameSetupLayout 
      gameName="Math Challenge" 
      gameType="math_challenge" 
      onStart={handleStart} 
    />
  );
}