import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameSetupLayout from '@/components/GameSetupLayout.jsx';

export default function DominoSetupPage() {
  const navigate = useNavigate();

  const handleStart = (settings) => {
    navigate('/dominoes', { state: { settings } });
  };

  const specificRules = [
    { id: 'drawMode', label: 'Draw Game', description: 'Players draw from boneyard if blocked.', default: true },
    { id: 'blockMode', label: 'Block Game', description: 'Pass turn if blocked (no drawing).', default: false },
    { id: 'scoreMuggins', label: 'Score Muggins (Multiples of 5)', description: 'Score points during play for ends summing to 5.', default: false }
  ];

  return (
    <GameSetupLayout 
      gameName="Dominoes" 
      gameType="dominoes" 
      specificRules={specificRules}
      onStart={handleStart} 
    />
  );
}