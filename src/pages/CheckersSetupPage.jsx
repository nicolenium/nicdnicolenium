import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameSetupLayout from '@/components/GameSetupLayout.jsx';

export default function CheckersSetupPage() {
  const navigate = useNavigate();

  const handleStart = (settings) => {
    navigate('/checkers-8x8', { state: { settings } });
  };

  const specificRules = [
    { id: 'forcedCaptures', label: 'Mandatory Captures', description: 'Players must capture if able.', default: true },
    { id: 'flyingKings', label: 'Flying Kings', description: 'Kings can move across multiple empty squares.', default: false },
    { id: 'backwardCapture', label: 'Men Capture Backwards', description: 'Regular pieces can capture in reverse.', default: false }
  ];

  return (
    <GameSetupLayout 
      gameName="Checkers 8x8" 
      gameType="checkers_8x8" 
      specificRules={specificRules}
      onStart={handleStart} 
    />
  );
}