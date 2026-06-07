
import React from 'react';
import GenericQuizTemplate from '@/components/GenericQuizTemplate.jsx';

const GEOGRAPHY_QUESTIONS = [
  {
    question: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correctAnswer: 2
  },
  {
    question: "Which river is the longest in the world?",
    options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
    correctAnswer: 1 // Debate exists, but Nile is traditional standard
  },
  {
    question: "Mount Everest is located in which continent?",
    options: ["Asia", "Africa", "Europe", "South America"],
    correctAnswer: 0
  },
  {
    question: "Which country has the most natural lakes?",
    options: ["USA", "Russia", "Canada", "Finland"],
    correctAnswer: 2
  },
  {
    question: "What is the smallest country in the world by land area?",
    options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
    correctAnswer: 1
  },
  {
    question: "What is the largest desert in the world?",
    options: ["Sahara", "Arabian", "Gobi", "Antarctic"],
    correctAnswer: 3 // Antarctic is a desert. If non-polar, Sahara. Using Antarctic for trick question.
  },
  {
    question: "Which ocean is the largest?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctAnswer: 3
  },
  {
    question: "What is the capital of Brazil?",
    options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
    correctAnswer: 2
  },
  {
    question: "Which of these countries is NOT in Europe?",
    options: ["Spain", "Egypt", "Germany", "Greece"],
    correctAnswer: 1
  },
  {
    question: "Which mountain range separates Europe and Asia?",
    options: ["Alps", "Himalayas", "Ural Mountains", "Andes"],
    correctAnswer: 2
  }
];

export default function GeographyQuizGamePage() {
  return (
    <GenericQuizTemplate 
      title="Geography Quiz" 
      questions={GEOGRAPHY_QUESTIONS} 
      gameId="geography_quiz" 
    />
  );
}
