
import React, { useMemo } from 'react';
import GenericQuizTemplate from '@/components/GenericQuizTemplate.jsx';
import { getQuestionPool } from '@/utils/questionDatabase.js';

export default function ScienceChallengeGamePage() {
  const questions = useMemo(() => getQuestionPool('science', 10), []);
  return <GenericQuizTemplate title="Science Challenge" gameType="quiz_games" gameId="science-challenge" questions={questions} />;
}
