
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedGameLayout } from '@/components/UnifiedGameLayout.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { useGameSession } from '@/hooks/useGameSession.js';
import CombinedGameSetupModal from '@/components/CombinedGameSetupModal.jsx';
import GameAnimationOverlay from '@/components/GameAnimationOverlay.jsx';
import AudioPlayerFixed from '@/components/AudioPlayerFixed.jsx';
import { useGameConfig } from '@/contexts/GameConfigContext.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';
import { Zap, Trophy, RotateCcw, Timer } from 'lucide-react';
import { useSoundEffects } from '@/utils/soundManager.js';
import { QuizAIEngine } from '@/utils/QuizAIEngine.js';

const generateSpeedQuestionBank = () => {
  const bank = [];
  bank.push(
    { id: 'sq1', text: 'What is 15 x 4?', options: ['60', '45', '50', '75'], answer: '60', audioUrl: 'https://actions.google.com/sounds/v1/speech/spanish_greeting.ogg' },
    { id: 'sq2', text: 'Which planet is closest to the Sun?', options: ['Mercury', 'Venus', 'Earth', 'Mars'], answer: 'Mercury', audioUrl: 'https://actions.google.com/sounds/v1/speech/spanish_greeting.ogg' }
  );
  for (let i = 3; i <= 500; i++) {
    bank.push({
      id: `sq${i}`, text: `Rapid Fire Question #${i}: Identify the correct answer quickly.`, options: ['Correct', 'Wrong 1', 'Wrong 2', 'Wrong 3'].sort(() => Math.random() - 0.5), answer: 'Correct', audioUrl: 'https://actions.google.com/sounds/v1/speech/spanish_greeting.ogg'
    });
  }
  return bank;
};

const SPEED_QUESTION_BANK = generateSpeedQuestionBank();

export default function SpeedQuizGamePage() {
  const { currentUser } = useAuth();
  const { gameConfig: contextConfig, setGameConfig } = useGameConfig();
  const { playWin, playLose } = useSoundEffects();

  const [gameSetupData, setGameSetupData] = useState(() => contextConfig || null);
  const [showSetupModal, setShowSetupModal] = useState(!gameSetupData);

  const { initializeSession, recordMove, handleGameOver, moveHistory } = useGameSession('speed_quiz', gameSetupData);

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const TOTAL_TIME = 60; 
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  useEffect(() => {
    if (gameSetupData && !isPlaying && !isGameOver && !showSetupModal) {
      handleGameStart(gameSetupData);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isPlaying && !isGameOver && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => t - 1);
        if (gameSetupData?.mode === 'human_vs_computer') {
          const sim = QuizAIEngine.simulateAIOpponent(gameSetupData.difficulty, TOTAL_TIME - timeLeft + 1, TOTAL_TIME, 20);
          setAiScore(sim.score);
        }
      }, 1000);
    } else if (timeLeft <= 0 && isPlaying) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [isPlaying, isGameOver, timeLeft, gameSetupData]);

  const handleGameStart = (config) => {
    setGameConfig(config); setGameSetupData(config); setShowSetupModal(false); initializeSession(config);
    const shuffled = [...SPEED_QUESTION_BANK].sort(() => Math.random() - 0.5);
    setQuestions(shuffled); setScore(0); setAiScore(0); setCurrentIdx(0); setIsPlaying(true); setIsGameOver(false);
    setSelectedOption(null); setIsAnswered(false); setTimeLeft(TOTAL_TIME);
  };

  const currentQuestion = questions[currentIdx];

  const handleAnswer = (option) => {
    if (isAnswered || isGameOver) return;
    setSelectedOption(option); setIsAnswered(true);
    const isCorrect = option === currentQuestion.answer;
    
    if (isCorrect) {
      setScore(s => s + 10); playWin(); recordMove(`Answered correctly`, 10, { forceSync: true });
    } else {
      playLose(); setTimeLeft(t => Math.max(0, t - 3)); toast.error("-3s Penalty!"); recordMove(`Answered incorrectly`, 0, { forceSync: true });
    }

    setTimeout(() => {
      if (timeLeft > 0) { setCurrentIdx(i => i + 1); setSelectedOption(null); setIsAnswered(false); }
    }, 600);
  };

  const endGame = () => {
    setIsPlaying(false); setIsGameOver(true);
    const isWin = score >= aiScore;
    handleGameOver(isWin ? 'win' : 'loss', score);
  };

  return (
    <>
      <Helmet><title>Speed Quiz | NICD</title></Helmet>
      <CombinedGameSetupModal isOpen={showSetupModal} gameType="speed_quiz" onGameStart={handleGameStart} onClose={() => window.history.back()} />

      {!showSetupModal && gameSetupData && (
        <UnifiedGameLayout title="Speed Quiz" turnText={`Score: ${score}`} onReset={() => handleGameStart(gameSetupData)} history={moveHistory} gameType="speed_quiz" onResign={endGame} canUndo={false}>
          <div className="w-full flex flex-col items-center justify-start max-w-4xl mx-auto py-4 md:py-8 px-4">
            
            <div className="w-full flex justify-between items-center mb-8 bg-card border-2 border-border p-4 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-bold text-xl"><Zap className="w-6 h-6" /></div>
                <div className="flex flex-col"><span className="text-xs font-bold uppercase text-muted-foreground">Score</span><span className="text-2xl font-black text-primary">{score}</span></div>
              </div>
              
              {gameSetupData.mode === 'human_vs_computer' && (
                <div className="flex items-center gap-3 relative z-10 hidden sm:flex">
                  <div className="flex flex-col text-right"><span className="text-xs font-bold uppercase text-muted-foreground">AI Score</span><span className="text-2xl font-black text-destructive">{aiScore}</span></div>
                </div>
              )}

              <div className="flex items-center gap-3 text-right relative z-10">
                <div className="flex flex-col"><span className="text-xs font-bold uppercase text-muted-foreground">Timer</span><span className={`text-3xl font-black tabular-nums ${timeLeft <= 10 ? 'text-destructive animate-pulse' : 'text-foreground'}`}>{timeLeft}</span></div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${timeLeft <= 10 ? 'bg-destructive/20 text-destructive' : 'bg-muted text-muted-foreground'}`}><Timer className="w-6 h-6" /></div>
              </div>
            </div>

            <GameAnimationOverlay gameStatus={isGameOver ? 'won' : 'in-progress'}>
              {isGameOver ? (
                <Card className="w-full border-2 border-border shadow-xl rounded-3xl bg-card overflow-hidden">
                  <CardContent className="p-12 text-center">
                    <Trophy className="w-12 h-12 mx-auto text-primary mb-6" />
                    <h3 className="text-4xl font-black mb-2">Time's Up!</h3>
                    <p className="text-2xl font-medium text-muted-foreground mb-2">Final Score: <strong className="text-primary ml-2">{score}</strong></p>
                    {gameSetupData.mode === 'human_vs_computer' && <p className="text-xl font-bold text-destructive mb-8">AI Score: {aiScore}</p>}
                    <Button onClick={() => handleGameStart(gameSetupData)} size="lg" className="font-bold px-10 h-14 text-lg rounded-full shadow-glow-primary"><RotateCcw className="w-5 h-5 mr-2" /> Play Again</Button>
                  </CardContent>
                </Card>
              ) : currentQuestion ? (
                <div className="w-full">
                  <Card className="w-full border-2 border-border shadow-md rounded-3xl bg-card overflow-hidden">
                    <CardContent className="p-8 md:p-12">
                      <h2 className="text-3xl md:text-4xl font-black text-center mb-8">{currentQuestion.text}</h2>
                      <div className="mb-8 max-w-md mx-auto"><AudioPlayerFixed audioUrl={currentQuestion.audioUrl} title="Listen" className="bg-muted/30 border-border/50 py-2" /></div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentQuestion.options.map((opt, i) => {
                          let btnClass = "h-auto py-8 text-xl font-bold border-2 rounded-2xl transition-all";
                          if (isAnswered) btnClass += opt === currentQuestion.answer ? " bg-emerald-500 border-emerald-500 text-white" : " opacity-30";
                          return <Button key={i} variant="outline" className={btnClass} onClick={() => handleAnswer(opt)} disabled={isAnswered}>{opt}</Button>;
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : null}
            </GameAnimationOverlay>
          </div>
        </UnifiedGameLayout>
      )}
    </>
  );
}
