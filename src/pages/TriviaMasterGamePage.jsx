
import React, { useMemo } from 'react';
import GenericQuizTemplate from '@/components/GenericQuizTemplate.jsx';
import { getQuestionPool } from '@/utils/questionDatabase.js';

export default function TriviaMasterGamePage() {
  const questions = useMemo(() => getQuestionPool('trivia', 10), []);
  return <GenericQuizTemplate title="Trivia Master" gameType="trivia" gameId="trivia-master" questions={questions} />;
}
