
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';

export default function QuizComponent({ quiz, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Mock questions if none provided
  const questions = quiz?.questions || [
    { question: 'What is the main objective of the game?', options: ['Win', 'Lose', 'Draw', 'None'], answer: 0 }
  ];

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      if (onComplete) onComplete(score + (selectedIndex === questions[currentQuestion].answer ? 1 : 0));
    }
  };

  if (showResults) {
    return (
      <Card className="w-full max-w-md mx-auto border-2 border-primary shadow-glow-primary">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-black">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-4xl font-black text-primary">{score} / {questions.length}</p>
          <p className="text-muted-foreground font-medium">Great job completing the {quiz?.title || 'Quiz'}!</p>
          <Button onClick={() => { setCurrentQuestion(0); setScore(0); setShowResults(false); }} className="w-full font-bold">Retake Quiz</Button>
        </CardContent>
      </Card>
    );
  }

  const q = questions[currentQuestion];

  return (
    <Card className="w-full max-w-2xl mx-auto border-2 border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex justify-between">
          <span>{quiz?.title || 'Knowledge Check'}</span>
          <span className="text-muted-foreground text-sm">Q {currentQuestion + 1} of {questions.length}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <h3 className="text-2xl font-black leading-tight">{q.question}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {q.options.map((opt, idx) => (
            <Button key={idx} variant="outline" className="h-auto py-4 px-6 text-left justify-start font-medium text-base border-2 hover:border-primary hover:bg-primary/5" onClick={() => handleAnswer(idx)}>
              {opt}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
