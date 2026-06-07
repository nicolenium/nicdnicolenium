
import React, { useMemo } from 'react';
import GenericQuizTemplate from '@/components/GenericQuizTemplate.jsx';
import { getQuestionPool } from '@/utils/questionDatabase.js';

export default function LogicPuzzleGamePage() {
  const questions = useMemo(() => getQuestionPool('logic', 10), []);
  return <GenericQuizTemplate title="Logic Puzzle" gameType="puzzles" gameId="logic-puzzle" questions={questions} />;
}
