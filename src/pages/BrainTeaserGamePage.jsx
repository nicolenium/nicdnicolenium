
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedGameLayout } from '@/components/UnifiedGameLayout.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { useGameSession } from '@/hooks/useGameSession.js';
import CombinedGameSetupModal from '@/components/CombinedGameSetupModal.jsx';
import { useGameConfig } from '@/contexts/GameConfigContext.jsx';
import { toast } from 'sonner';
import { Lightbulb, Trophy, RotateCcw, BrainCircuit } from 'lucide-react';
import { AIResponseManager } from '@/utils/AIResponseManager.js';

const BRAIN_TEASERS = [
  { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", options: ["An echo", "A ghost", "A cloud", "A shadow"], answer: "An echo" },
  { q: "The more of this there is, the less you see. What is it?", options: ["Darkness", "Fog", "Light", "Smoke"], answer: "Darkness" },
  { q: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", options: ["A map", "A globe", "A painting", "A dream"], answer: "A map" },
  { q: "What has keys but can't open locks?", options: ["A piano", "A map", "A computer", "A chest"], answer: "A piano" },
  { q: "I am taken from a mine, and shut up in a wooden case, from which I am never released, and yet I am used by almost everybody. What am I?", options: ["Pencil lead", "Gold", "Diamond", "Coal"], answer: "Pencil lead" },
  { q: "What comes once in a minute, twice in a moment, but never in a thousand years?", options: ["The letter M", "The letter E", "The sun", "A thought"], answer: "The letter M" },
  { q: "What goes through cities and fields, but never moves?", options: ["A road", "A river", "A train", "The wind"], answer: "A road" },
  { q: "I have branches, but no fruit, trunk or leaves. What am I?", options: ["A bank", "A river", "A family", "A tree"], answer: "A bank" }
];

export default function BrainTeaserGamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { gameConfig: contextConfig, setGameConfig } = useGameConfig();

  const routerConfig = location.state?.gameConfig;
  const [gameSetupData, setGameSetupData] = useState(() => routerConfig || contextConfig || null);
  const [showSetupModal, setShowSetupModal] = useState(!gameSetupData);

  const { initializeSession, recordMove, handleGameOver, moveHistory } = useGameSession('brain-teaser', gameSetupData);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const isProcessingRef = useRef(false);

  const questions = useMemo(() => [...BRAIN_TEASERS].sort(() => Math.random() - 0.5), []);

  useEffect(() => {
    let isMounted = true;
    if (isPlaying && gameSetupData?.mode === 'human_vs_computer' && !isGameOver && !isProcessingRef.current) {
      isProcessingRef.current = true;
      
      AIResponseManager.simulateQuizAnswer(gameSetupData?.difficulty || 'medium').then(isCorrect => {
        if (!isMounted) return;
        if (isCorrect) {
          toast.info("AI PRO solved it first!");
          setAiScore(s => s + 10);
          recordMove(`AI PRO answered correctly`, 10, { player: 'AI PRO', forceSync: true });
          nextQuestion();
        } else {
          toast.info("AI PRO answered incorrectly.");
          recordMove(`AI PRO missed`, 0, { player: 'AI PRO', forceSync: true });
        }
      }).finally(() => {
        if (isMounted) isProcessingRef.current = false;
      });
    }
    return () => { isMounted = false; };
  }, [currentIdx, isPlaying, gameSetupData, isGameOver]);

  const handleGameStart = (config) => {
    setGameConfig(config);
    setGameSetupData(config);
    setShowSetupModal(false);
    initializeSession(config);
    setScore(0);
    setAiScore(0);
    setCurrentIdx(0);
    setIsPlaying(true);
    setIsGameOver(false);
    isProcessingRef.current = false;
  };

  const handleCloseModal = () => navigate('/games');

  const handleAnswer = (option) => {
    if (isProcessingRef.current) return;
    const correct = option === questions[currentIdx].answer;
    if (correct) {
      setScore(s => s + 10);
      toast.success("Correct!");
      recordMove(`Player answered correctly`, 10, { forceSync: true });
    } else {
      toast.error("Incorrect!");
      recordMove(`Player missed`, 0, { forceSync: true });
    }
    nextQuestion();
  };

  const nextQuestion = () => {
    isProcessingRef.current = false;
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(i => i + 1);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    isProcessingRef.current = false;
    const winStatus = gameSetupData?.mode === 'human_vs_computer' 
      ? (score > aiScore ? 'win' : score < aiScore ? 'loss' : 'draw') 
      : 'win';
    handleGameOver(winStatus, score);
  };

  const currentQ = questions[currentIdx];

  return (
    <>
      <Helmet><title>Brain Teaser | NICOLENIUM</title></Helmet>
      
      <CombinedGameSetupModal 
        isOpen={showSetupModal} 
        gameType="brain-teaser"
        game={{ name: "Brain Teaser", id: "brain-teaser" }}
        onGameStart={handleGameStart} 
        onClose={handleCloseModal} 
      />

      {!showSetupModal && gameSetupData && (
        <UnifiedGameLayout 
          title="Brain Teaser" 
          turnText={`Puzzle ${currentIdx + 1}/${questions.length}`} 
          onReset={() => handleGameStart(gameSetupData)} 
          history={moveHistory} 
          gameType="brain-teaser"
          onResign={endGame}
          canUndo={false}
        >
          <div className="w-full flex flex-col items-center justify-start max-w-4xl mx-auto py-4 md:py-8 px-4">
            
            {/* Score Header */}
            <div className="w-full flex justify-between items-center mb-6 bg-card border-2 border-border p-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-bold">
                  {gameSetupData.playerName?.charAt(0) || 'P'}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase text-muted-foreground">{gameSetupData.playerName}</span>
                  <span className="text-xl font-black">{score} pts</span>
                </div>
              </div>

              {gameSetupData.mode === 'human_vs_computer' && (
                <div className="flex items-center gap-3 text-right">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase text-muted-foreground">AI PRO</span>
                    <span className="text-xl font-black">{aiScore} pts</span>
                  </div>
                  <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                </div>
              )}
            </div>

            <Card className="w-full border-2 border-border shadow-xl rounded-3xl bg-card overflow-hidden">
              <CardContent className="p-0">
                {isGameOver ? (
                  <div className="p-10 text-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary mb-6">
                      <Trophy className="w-12 h-12" />
                    </div>
                    <h3 className="text-4xl font-black tracking-tight mb-2">Challenge Complete</h3>
                    <p className="text-2xl font-medium text-muted-foreground mb-8">
                      Final Score: <strong className="text-primary text-3xl ml-2">{score}</strong>
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button onClick={() => handleGameStart(gameSetupData)} size="lg" className="font-bold px-10 h-14 text-lg rounded-full shadow-glow-primary">
                        <RotateCcw className="w-5 h-5 mr-2" /> Play Again
                      </Button>
                      <Button onClick={handleCloseModal} variant="outline" size="lg" className="font-bold px-10 h-14 text-lg rounded-full border-2">
                        Exit to Hub
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 md:p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
                      <Lightbulb className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-foreground mb-8 leading-snug">
                      "{currentQ.q}"
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                      <AnimatePresence>
                        {currentQ.options.map((opt, i) => (
                          <motion.div
                            key={opt}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Button 
                              onClick={() => handleAnswer(opt)} 
                              variant="outline" 
                              disabled={isProcessingRef.current}
                              className="w-full h-16 text-lg font-bold border-2 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-wrap h-auto py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {opt}
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </UnifiedGameLayout>
      )}
    </>
  );
}
