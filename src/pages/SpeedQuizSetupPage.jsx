import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameSetupLayout from '@/components/GameSetupLayout.jsx';

export default function SpeedQuizSetupPage() {
  const navigate = useNavigate();

  const handleStart = (settings) => {
    navigate('/speed-quiz', { state: { settings } });
  };

  return (
    <GameSetupLayout 
      gameName="Speed Quiz" 
      gameType="speed_quiz" 
      onStart={handleStart} 
    />
  );
}