import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameSetupLayout from '@/components/GameSetupLayout.jsx';

export default function PronunciationSetupPage() {
  const navigate = useNavigate();

  const handleStart = (settings) => {
    navigate('/pronunciation', { state: { settings } });
  };

  return (
    <GameSetupLayout 
      gameName="Pronunciation Master" 
      gameType="pronunciation_master" 
      onStart={handleStart} 
    />
  );
}