
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { UnifiedGameLayout } from '@/components/UnifiedGameLayout.jsx';
import CombinedGameSetupModal from '@/components/CombinedGameSetupModal.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { useGameSession } from '@/hooks/useGameSession.js';
import { useSoundEffects } from '@/utils/soundManager.js';
import { toast } from 'sonner';
import { cn } from '@/lib/utils.js';

export default function GenericQuizTemplate({ title, questions, gameId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { playMove, playWin, playLose } = useSoundEffects();
  
  const [gameSetupData, setGameSetupData] = useState(() => location.state?.gameConfig || null);
  const [showSetupModal, setShowSetupModal] = useState(!gameSetupData);

  const { initializeSession, recordMove, handleGameOver, moveHistory } = useGameSession(gameId, gameSetupData);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Shuffle questions and limit to 10 for a standard session
  const activeQuestions = useMemo(() => {
    if (!questions || questions.length === 0) return [];
    return [...questions].sort(() => 0.5 - Math.random()).slice(0, 10);
  }, [questions, gameSetupData]);

  const handleGameStart = (config) => {
    setGameSetupData(config);
    setShowSetupModal(false);
    initializeSession(config);
    resetGame();
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    setIsGameOver(false);
  };

  const handleAnswerClick = (optionIndex) => {
    if (isAnswerRevealed || isGameOver) return;
    
    setSelectedAnswer(optionIndex);
    setIsAnswerRevealed(true);
    
    const currentQ = activeQuestions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQ.correctAnswer;
    
    if (isCorrect) {
      playWin();
      setScore(s => s + 10);
      recordMove(`Correct: ${currentQ.question}`, 10);
    } else {
      playLose();
      recordMove(`Incorrect: ${currentQ.question}`, 0);
    }

    setTimeout(() => {
      if (currentQuestionIndex < activeQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswerRevealed(false);
      } else {
        setIsGameOver(true);
        handleGameOver('completed', score + (isCorrect ? 10 : 0));
        toast.success(`Quiz Completed! Score: ${score + (isCorrect ? 10 : 0)}`);
      }
    }, 2000);
  };

  if (!questions || questions.length === 0) {
    return <div className="p-8 text-center">Loading Questions...</div>;
  }

  const currentQ = activeQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / activeQuestions.length) * 100;

  return (
    <>
      <Helmet><title>{title} | NICOLENIUM</title></Helmet>
      
      <CombinedGameSetupModal 
        isOpen={showSetupModal} 
        gameType={gameId}
        game={{ name: title, id: gameId }}
        onGameStart={handleGameStart} 
        onClose={() => navigate('/games')} 
      />

      {!showSetupModal && gameSetupData && (
        <UnifiedGameLayout title={title} turnText={isGameOver ? 'QUIZ COMPLETED' : `QUESTION ${currentQuestionIndex + 1}/${activeQuestions.length}`} history={moveHistory} onReset={resetGame} gameType={gameId}>
          
          <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 py-8 px-4">
            
            <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border">
              <span className="font-bold text-muted-foreground">Score: <span className="text-primary text-xl">{score}</span></span>
              <span className="font-bold text-muted-foreground">Question {currentQuestionIndex + 1} of {activeQuestions.length}</span>
            </div>
            
            <Progress value={progress} className="h-3 rounded-full" />

            {!isGameOver ? (
              <div className="bg-card border-2 border-border shadow-xl rounded-3xl p-8 flex flex-col gap-8">
                <h2 className="text-2xl sm:text-3xl font-bold leading-snug">{currentQ.question}</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentQ.options.map((option, idx) => {
                    let btnClass = "border-2 justify-start h-auto min-h-[4rem] p-4 text-left whitespace-normal font-medium text-lg";
                    if (isAnswerRevealed) {
                      if (idx === currentQ.correctAnswer) btnClass += " bg-success text-success-foreground border-success ring-4 ring-success/30";
                      else if (idx === selectedAnswer) btnClass += " bg-destructive text-destructive-foreground border-destructive";
                      else btnClass += " opacity-50";
                    }

                    return (
                      <Button
                        key={idx}
                        variant="outline"
                        className={cn(btnClass)}
                        onClick={() => handleAnswerClick(idx)}
                        disabled={isAnswerRevealed}
                      >
                        {option}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-card border-2 border-border shadow-xl rounded-3xl p-12 text-center flex flex-col items-center gap-6">
                <h2 className="text-4xl font-black text-primary">Quiz Complete!</h2>
                <div className="text-6xl font-black my-4">{score} <span className="text-2xl text-muted-foreground">/ {activeQuestions.length * 10}</span></div>
                <Button size="lg" onClick={resetGame} className="font-bold text-lg px-12 h-14 rounded-xl shadow-glow-primary mt-4">
                  Play Again
                </Button>
              </div>
            )}

          </div>
        </UnifiedGameLayout>
      )}
    </>
  );
}
