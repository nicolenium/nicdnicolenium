
import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameSetupLayout from '@/components/GameSetupLayout.jsx';

export default function Checkers10x10SetupPage() {
  const navigate = useNavigate();

  const handleStart = (settings) => {
    navigate('/checkers-10x10', { state: { settings } });
  };

  const specificRules = [
    { id: 'forcedCaptures', label: 'Mandatory Captures (FMJD)', description: 'Must take the path of most captures.', default: true },
    { id: 'flyingKings', label: 'Flying Kings (FMJD)', description: 'Standard international king movement.', default: true },
    { id: 'backwardCapture', label: 'Men Capture Backwards (FMJD)', description: 'Standard international capture rules.', default: true }
  ];

  return (
    <GameSetupLayout 
      gameName="Checkers 10x10 (International)" 
      gameType="checkers_10x10" 
      specificRules={specificRules}
      onStart={handleStart} 
    />
  );
}
