
import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameSetupLayout from '@/components/GameSetupLayout.jsx';

export default function TikTokSetupPage() {
  const navigate = useNavigate();

  const handleStart = (settings) => {
    navigate('/tiktaktok', { state: { settings } });
  };

  const specificRules = [
    { id: 'boardSize3x3', label: '3x3 Board', description: 'Standard Tic-Tac-Toe.', default: true },
    { id: 'boardSize5x5', label: '5x5 Board (Connect 4/5)', description: 'Expanded grid.', default: false },
    { id: 'allowOverwrites', label: 'Allow Overwrites (Gomoku style rules)', description: 'Specific tile types can overwrite others.', default: false }
  ];

  return (
    <GameSetupLayout 
      gameName="TikTakTok" 
      gameType="tictactoe" 
      specificRules={specificRules}
      onStart={handleStart} 
    />
  );
}
