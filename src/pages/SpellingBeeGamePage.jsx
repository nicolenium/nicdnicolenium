
import React, { useMemo } from 'react';
import GenericQuizTemplate from '@/components/GenericQuizTemplate.jsx';
import { getQuestionPool } from '@/utils/questionDatabase.js';

export default function SpellingBeeGamePage() {
  const questions = useMemo(() => getQuestionPool('spelling', 10), []);
  return <GenericQuizTemplate title="Spelling Bee" gameType="word_games" gameId="spelling-bee" questions={questions} />;
}
