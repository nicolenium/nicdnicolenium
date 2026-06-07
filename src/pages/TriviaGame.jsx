import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PrivacySelector from '@/components/PrivacySelector.jsx';
import FullScreenGameLayout from '@/components/FullScreenGameLayout.jsx';
import BrandedGameHeader from '@/components/BrandedGameHeader.jsx';
import BrandedGameOverScreen from '@/components/BrandedGameOverScreen.jsx';
import MoveTracker from '@/components/MoveTracker.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import pb from '@/lib/pocketbaseClient';

const TriviaGame = () => {
  const [privacy, setPrivacy] = useState(null);
  const [score, setScore] = useState(0);
  const [moveHistory, setMoveHistory] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const questions = [
    { q: 'What is the capital of France?', opts: ['London', 'Berlin', 'Paris', 'Madrid'], correct: 'Paris' },
    { q: 'Which planet is known as the Red Planet?', opts: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correct: 'Mars' },
    { q: 'What is the largest ocean on Earth?', opts: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correct: 'Pacific' }
  ];

  const saveScoreToDB = useCallback(async (finalScore) => {
    try {
      if (pb.authStore.isValid && pb.authStore.model?.collectionName === 'users') {
        await pb.collection('game_sessions').create({
          gameType: 'trivia',
          userId: pb.authStore.model.id,
          score: finalScore,
          gameStatus: 'completed',
          moveHistory: moveHistory
        }, { $autoCancel: false });
      }
    } catch (err) {
      console.error("Failed saving score:", err);
    }
  }, [moveHistory]);

  const handleAnswer = (opt) => {
    try {
      const isCorrect = opt === questions[questionIndex].correct;
      const pointsEarned = isCorrect ? 10 : 0;
      
      const newScore = score + pointsEarned;
      setScore(newScore);
      
      setMoveHistory(prev => [...prev, { 
        notation: `Q${questionIndex+1}: ${opt}`, 
        quality: isCorrect ? 'good' : 'bad' 
      }]);
      
      if (questionIndex + 1 < questions.length) {
        setQuestionIndex(i => i + 1);
      } else {
        setGameOver(true);
        saveScoreToDB(newScore);
      }
    } catch (error) {
      console.error("Error processing answer:", error);
    }
  };

  if (!privacy) return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 flex justify-center items-center"><PrivacySelector onSelect={setPrivacy} /></main><Footer /></div>;

  const rightPanel = (
    <div className="space-y-4 h-full flex flex-col">
      <div className="p-4 bg-brand-primary/10 border border-brand-primary/30 rounded-xl text-center">
        <p className="text-sm text-brand-primary font-bold uppercase tracking-wider">Your Score</p>
        <p className="text-4xl font-black text-brand-primary mt-2">{score}</p>
      </div>
      <div className="flex-1">
        <MoveTracker moves={moveHistory} title="Answers Log" />
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Trivia Master - NICD NICOLENIUM</title></Helmet>
      <FullScreenGameLayout title={<BrandedGameHeader gameTitle="NICD Trivia Master" />} mode="Solo" onExit={() => window.location.reload()} rightPanelContent={rightPanel}>
        <div className="w-full max-w-4xl mx-auto flex flex-col justify-center h-full relative z-10 px-2 sm:px-4">
          {gameOver ? (
            <BrandedGameOverScreen gameType="Trivia Master" score={score} onReplay={() => {setScore(0); setQuestionIndex(0); setMoveHistory([]); setGameOver(false);}} />
          ) : (
            <Card className="shadow-2xl border-2 border-brand-primary/30 bg-card backdrop-blur-xl rounded-3xl overflow-hidden w-full">
              <CardHeader className="pb-6 sm:pb-8 pt-8 sm:pt-10 text-center border-b border-border/50 bg-muted/20">
                <span className="text-brand-primary font-bold tracking-widest uppercase text-xs sm:text-sm mb-2 sm:mb-3 block">Question {questionIndex + 1} of {questions.length}</span>
                <CardTitle className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-balance leading-tight text-foreground px-2">
                  {questions[questionIndex].q}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 md:p-10">
                {questions[questionIndex].opts.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(opt)} className="w-full p-4 sm:p-6 rounded-2xl border-2 border-border hover:border-brand-primary bg-background hover:bg-brand-primary/10 text-left font-bold text-lg sm:text-xl md:text-2xl transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-brand-primary/50 text-foreground flex items-center group">
                    <span className="shrink-0 inline-block w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary text-center leading-8 mr-3 sm:mr-4 text-xs sm:text-sm align-middle group-hover:bg-brand-primary group-hover:text-primary-foreground transition-colors">{String.fromCharCode(65+i)}</span>
                    <span className="flex-1">{opt}</span>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </FullScreenGameLayout>
    </>
  );
};
export default TriviaGame;