
import React, { useMemo } from 'react';
import GenericQuizTemplate from '@/components/GenericQuizTemplate.jsx';
import { getQuestionPool } from '@/utils/questionDatabase.js';

export default function VocabularyBuilderGamePage() {
  const questions = useMemo(() => getQuestionPool('vocabulary', 10), []);
  return <GenericQuizTemplate title="Vocabulary Builder" gameType="word_games" gameId="vocabulary-builder" questions={questions} />;
}
