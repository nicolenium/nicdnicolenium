
import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameSetupLayout from '@/components/GameSetupLayout.jsx';

export default function QuizGamesSetupPage() {
  const navigate = useNavigate();

  const handleStart = (settings) => {
    navigate('/quiz-games', { state: { gameConfig: settings } });
  };

  const specificRules = [
    { id: 'strictTimer', label: 'Strict Timer', description: 'Zero points if time expires.', default: true },
    { id: 'showExplanations', label: 'Show Explanations', description: 'Show detailed answers after each question.', default: true },
    { id: 'punishWrong', label: 'Penalty for Wrong Answers', description: 'Deduct points for incorrect guesses.', default: false }
  ];

  return (
    <GameSetupLayout 
      gameName="Knowledge Quizzes" 
      gameType="knowledge_quizzes" 
      specificRules={specificRules}
      onStart={handleStart} 
    />
  );
}
