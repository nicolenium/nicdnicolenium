
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { UnifiedGameLayout } from '@/components/UnifiedGameLayout.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import GameAnimationOverlay from '@/components/GameAnimationOverlay.jsx';
import { toast } from 'sonner';
import { useSoundEffects } from '@/utils/soundManager.js';
import { GameClockDisplay } from '@/components/GameClockDisplay.jsx';
import { useGameSession } from '@/hooks/useGameSession.js';
import CombinedGameSetupModal from '@/components/CombinedGameSetupModal.jsx';
import { getQuestionPool } from '@/utils/questionDatabase.js';
import { getAIResponse } from '@/utils/aiResponseVariety.js';
import AudioPlayerFixed from '@/components/AudioPlayerFixed.jsx';
import { QuizAIEngine } from '@/utils/QuizAIEngine.js';

export default function MathGamesGamePage() {
  const navigate = useNavigate();
  const { playWin, playLose } = useSoundEffects();
  const soundPlayedRef = useRef(false);

  const [showSetupModal, setShowSetupModal] = useState(true);
  const [gameSetupData, setGameSetupData] = useState(null);

  const { initializeSession, recordMove, moveHistory, handleGameOver } = useGameSession('math_challenge', gameSetupData);

  const [currentQ, setCurrentQ] = useState(null);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  
  const initialSeconds = useMemo(() => gameSetupData?.timeLimit || 60, [gameSetupData]);
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [gameState, setGameState] = useState('playing');

  const handleGameStart = (config) => {
    setGameSetupData(config);
    setShowSetupModal(false);
    initializeSession(config);
    generateProblem(config);
  };

  const handleCloseModal = () => navigate('/games');

  const generateProblem = (config = gameSetupData) => {
    const pool = getQuestionPool('math_puzzle', 1, config?.difficulty || 'medium');
    setCurrentQ(pool[0]);
    setAnswer('');
  };

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => t - 1);
        if (gameSetupData?.mode === 'human_vs_computer') {
          const sim = QuizAIEngine.simulateAIOpponent(gameSetupData.difficulty, initialSeconds - timeLeft + 1, initialSeconds, 5);
          setAiScore(sim.score);
        }
      }, 1000);
    } else if (timeLeft <= 0 && gameState === 'playing') {
      handleTimeExpired();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, gameSetupData]);

  useEffect(() => {
    if (gameState !== 'playing' && !soundPlayedRef.current) {
      soundPlayedRef.current = true;
      if (gameState === 'won') playWin();
      else playLose();
    }
  }, [gameState, playWin, playLose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gameState !== 'playing' || !currentQ) return;

    const isCorrect = answer === currentQ.answer;
    const feedback = getAIResponse('quiz_feedback', isCorrect ? 'correct' : 'incorrect', 'medium');
    
    recordMove(isCorrect ? 'Correct Answer' : 'Incorrect Answer', isCorrect ? 10 : 0, {
      questionText: currentQ.question, playerAnswer: answer, correctAnswer: currentQ.answer, isCorrect, forceSync: true
    });

    if (isCorrect) {
      const newScore = score + 10;
      setScore(newScore);
      if (newScore >= 50) {
        setGameState('won');
        handleGameOver('win', newScore);
        toast.success(`Challenge Completed! ${feedback}`);
      } else {
        toast.success(`Correct! ${feedback}`);
        generateProblem();
      }
    } else {
      toast.error(`Incorrect! ${feedback}`);
      setAnswer('');
    }
  };

  const handleTimeExpired = () => {
    setGameState(score >= aiScore ? 'won' : 'lost');
    handleGameOver(score >= aiScore ? 'win' : 'loss', score);
  };

  const resetGame = () => {
    setScore(0); setAiScore(0); setTimeLeft(initialSeconds); setGameState('playing');
    soundPlayedRef.current = false; generateProblem();
  };

  return (
    <>
      <Helmet><title>Math Challenge | NICOLENIUM</title></Helmet>
      <CombinedGameSetupModal isOpen={showSetupModal} gameType="math_challenge" onGameStart={handleGameStart} onClose={handleCloseModal} />

      {!showSetupModal && (
        <UnifiedGameLayout title="Math Challenge" turnText={`Score: ${score}/50`} history={moveHistory} onReset={resetGame} onResign={() => {setGameState('lost'); handleGameOver('resign', score);}} gameType="math_challenge">
          <div className="w-full flex flex-col items-center justify-center max-w-2xl mx-auto py-8 relative">
            <GameAnimationOverlay gameStatus={gameState === 'won' ? 'won' : gameState === 'lost' ? 'lost' : 'in-progress'}>
              
              <div className="flex justify-between w-full mb-8 gap-4">
                <GameClockDisplay playerName={gameSetupData?.playerName || "You"} totalTimeSeconds={initialSeconds} timeRemainingSeconds={timeLeft} isActive={gameState === 'playing'} />
                {gameSetupData?.mode === 'human_vs_computer' && (
                  <GameClockDisplay playerName="AI Opponent Score" totalTimeSeconds={50} timeRemainingSeconds={aiScore} isActive={false} />
                )}
              </div>
              
              <Card className="w-full p-6 bg-card shadow-xl rounded-3xl border-2 relative z-10">
                <CardContent className="flex flex-col items-center p-6">
                  {gameState === 'playing' ? (
                    <>
                      <div className="text-4xl font-black mb-8 text-foreground text-center">{currentQ?.question}</div>
                      <div className="w-full mb-8"><AudioPlayerFixed title="Question Audio" transcript={currentQ?.question} audioUrl="https://actions.google.com/sounds/v1/speech/spanish_greeting.ogg" /></div>
                      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 max-w-md mx-auto">
                        <Input type="number" value={answer} onChange={(e) => setAnswer(e.target.value)} className="text-center text-3xl h-16 font-bold border-2" placeholder="Your answer" autoFocus />
                        <Button type="submit" size="lg" className="w-full text-lg h-14 font-bold">Submit Answer</Button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center space-y-6 w-full">
                      <h2 className="text-3xl font-black">{gameState === 'won' ? 'Victory!' : 'Time is Up!'}</h2>
                      <p className="text-xl font-bold text-muted-foreground">Final Score: {score}</p>
                      {gameSetupData?.mode === 'human_vs_computer' && <p className="text-xl font-bold text-destructive">AI Score: {aiScore}</p>}
                      <Button size="lg" onClick={resetGame} className="w-full h-14 text-lg font-bold">Play Again</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </GameAnimationOverlay>
          </div>
        </UnifiedGameLayout>
      )}
    </>
  );
}
