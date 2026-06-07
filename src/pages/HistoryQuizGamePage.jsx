
import React, { useMemo } from 'react';
import GenericQuizTemplate from '@/components/GenericQuizTemplate.jsx';
import { getQuestionPool } from '@/utils/questionDatabase.js';

export default function HistoryQuizGamePage() {
  const questions = useMemo(() => getQuestionPool('history', 10), []);
  return <GenericQuizTemplate title="History Quiz" gameType="quiz_games" gameId="history-quiz" questions={questions} />;
}
