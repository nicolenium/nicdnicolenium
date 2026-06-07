import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameSetupLayout from '@/components/GameSetupLayout.jsx';

export default function LanguageLearningSetupPage() {
  const navigate = useNavigate();

  const handleStart = (settings) => {
    navigate('/language-learning', { state: { settings } });
  };

  return (
    <GameSetupLayout 
      gameName="Languages Learning" 
      gameType="languages_learning" 
      onStart={handleStart} 
    />
  );
}