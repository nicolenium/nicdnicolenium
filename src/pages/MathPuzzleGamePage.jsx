
import React, { useMemo } from 'react';
import GenericQuizTemplate from '@/components/GenericQuizTemplate.jsx';
import { getQuestionPool } from '@/utils/questionDatabase.js';

export default function MathPuzzleGamePage() {
  const questions = useMemo(() => getQuestionPool('math_puzzle', 10), []);
  return <GenericQuizTemplate title="Math Puzzle" gameType="math_games" gameId="math-puzzle" questions={questions} />;
}
