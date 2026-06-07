
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UnifiedGameLayout } from '@/components/UnifiedGameLayout.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { useGameSession } from '@/hooks/useGameSession.js';
import CombinedGameSetupModal from '@/components/CombinedGameSetupModal.jsx';
import { useGameConfig } from '@/contexts/GameConfigContext.jsx';
import { toast } from 'sonner';
import { 
  Mic, Volume2, Play, Square, RotateCcw, Trophy, BrainCircuit, Activity, CheckCircle2, XCircle, AlertTriangle, Sparkles, ArrowRight
} from 'lucide-react';
import { AIResponseManager } from '@/utils/AIResponseManager.js';
import { useSoundEffects } from '@/utils/soundManager.js';

const PHRASES = [
  { text: "Bonjour tout le monde", lang: "French", difficulty: "easy" },
  { text: "Guten Morgen", lang: "German", difficulty: "easy" },
  { text: "¿Dónde está la biblioteca?", lang: "Spanish", difficulty: "medium" },
  { text: "Arrivederci Roma", lang: "Italian", difficulty: "medium" },
  { text: "Omae wa mou shindeiru", lang: "Japanese", difficulty: "hard" }
];

export default function PronunciationMasterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { gameConfig: contextConfig, setGameConfig } = useGameConfig();
  const { playWin, playLose } = useSoundEffects();

  const routerConfig = location.state?.gameConfig;
  const [gameSetupData, setGameSetupData] = useState(() => routerConfig || contextConfig || null);
  const [showSetupModal, setShowSetupModal] = useState(!gameSetupData);

  const { initializeSession, recordMove, handleGameOver, moveHistory } = useGameSession('pronunciation_master', gameSetupData);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingNative, setIsPlayingNative] = useState(false);
  const [lastAccuracy, setLastAccuracy] = useState(null);
  const [aiAccuracy, setAiAccuracy] = useState(null);

  const isProcessingRef = useRef(false);

  const currentPhrase = PHRASES[currentIdx % PHRASES.length];

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
    setLastAccuracy(null);
    setAiAccuracy(null);
    isProcessingRef.current = false;
  };

  const handleCloseModal = () => navigate('/games');

  const playNativeAudio = () => {
    setIsPlayingNative(true);
    setTimeout(() => setIsPlayingNative(false), 2000);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      processRecording();
    } else {
      setIsRecording(true);
      setLastAccuracy(null);
      setAiAccuracy(null);
    }
  };

  const processRecording = () => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    // Simulate processing delay
    setTimeout(() => {
      // Generate random accuracy between 60 and 100
      const accuracy = Math.floor(Math.random() * 41) + 60;
      setLastAccuracy(accuracy);
      
      const pointsEarned = Math.floor(accuracy / 10);
      setScore(s => s + pointsEarned);
      
      if (accuracy >= 80) {
        playWin();
        toast.success(`Great pronunciation! ${accuracy}% accuracy.`);
      } else {
        playLose();
        toast.info(`Keep practicing. ${accuracy}% accuracy.`);
      }

      recordMove(`Pronounced: ${currentPhrase.text}`, pointsEarned, { accuracy, forceSync: true });

      // Simulate AI Opponent
      if (gameSetupData?.mode === 'human_vs_computer') {
        const aiAcc = Math.floor(Math.random() * 21) + 80; // AI gets 80-100
        setAiAccuracy(aiAcc);
        const aiPoints = Math.floor(aiAcc / 10);
        setAiScore(s => s + aiPoints);
        recordMove(`AI PRO pronounced`, aiPoints, { player: 'AI PRO', accuracy: aiAcc, forceSync: true });
      }

      isProcessingRef.current = false;
    }, 1500);
  };

  const nextPhrase = () => {
    setLastAccuracy(null);
    setAiAccuracy(null);
    setCurrentIdx(i => i + 1);
    if (currentIdx >= 4) {
      endGame();
    }
  };

  const endGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    const winStatus = gameSetupData?.mode === 'human_vs_computer' 
      ? (score > aiScore ? 'win' : score < aiScore ? 'loss' : 'draw') 
      : 'win';
    handleGameOver(winStatus, score);
  };

  return (
    <>
      <Helmet><title>Pronunciation Master | NICOLENIUM</title></Helmet>
      
      <CombinedGameSetupModal 
        isOpen={showSetupModal} 
        gameType="pronunciation_master"
        game={{ name: "Pronunciation Master", id: "pronunciation-master" }}
        onGameStart={handleGameStart} 
        onClose={handleCloseModal} 
      />

      {!showSetupModal && gameSetupData && (
        <UnifiedGameLayout 
          title="Pronunciation Master" 
          turnText={`Phrase ${currentIdx + 1}/5`} 
          onReset={() => handleGameStart(gameSetupData)} 
          history={moveHistory} 
          gameType="pronunciation_master"
          onResign={endGame}
          canUndo={false}
        >
          <div className="w-full flex flex-col items-center justify-start max-w-5xl mx-auto py-4 md:py-8 px-4">
            
            {/* Score Header */}
            <div className="w-full flex justify-between items-center mb-6 bg-card border-2 border-border p-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-bold text-xl">
                  {gameSetupData.playerName?.charAt(0) || 'P'}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{gameSetupData.playerName || 'Player'}</span>
                  <span className="text-2xl font-black text-primary">{score} pts</span>
                </div>
              </div>

              {gameSetupData.mode === 'human_vs_computer' && (
                <div className="flex items-center gap-3 text-right">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">AI PRO</span>
                    <span className="text-2xl font-black text-accent">{aiScore} pts</span>
                  </div>
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                </div>
              )}
            </div>

            {isGameOver ? (
              <Card className="w-full border-2 border-border shadow-xl rounded-3xl bg-card overflow-hidden">
                <CardContent className="p-12 text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary mb-6">
                    <Trophy className="w-12 h-12" />
                  </div>
                  <h3 className="text-4xl font-black tracking-tight mb-2">Session Complete!</h3>
                  <p className="text-2xl font-medium text-muted-foreground mb-8">
                    Final Score: <strong className="text-primary text-3xl ml-2">{score}</strong>
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={() => handleGameStart(gameSetupData)} size="lg" className="font-bold px-10 h-14 text-lg rounded-full shadow-glow-primary">
                      <RotateCcw className="w-5 h-5 mr-2" /> Practice Again
                    </Button>
                    <Button onClick={handleCloseModal} variant="outline" size="lg" className="font-bold px-10 h-14 text-lg rounded-full border-2">
                      Exit to Hub
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Play Area */}
                <Card className="lg:col-span-2 border-2 border-border shadow-lg rounded-3xl bg-card overflow-hidden flex flex-col min-h-[500px]">
                  <div className="bg-muted/30 p-4 border-b border-border flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Mic className="w-5 h-5 text-primary" />
                      <span className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Voice Analysis Engine</span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest bg-background border px-3 py-1 rounded-full">
                      {currentPhrase.lang}
                    </span>
                  </div>
                  
                  <CardContent className="p-8 md:p-12 flex-1 flex flex-col items-center justify-center text-center relative">
                    
                    <h2 className="text-4xl md:text-5xl font-serif font-black mb-12 leading-tight">
                      "{currentPhrase.text}"
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className={`h-20 px-8 rounded-2xl border-2 text-lg font-bold transition-all ${isPlayingNative ? 'border-primary text-primary bg-primary/5' : ''}`}
                        onClick={playNativeAudio}
                      >
                        {isPlayingNative ? <Volume2 className="w-6 h-6 mr-3 animate-pulse" /> : <Play className="w-6 h-6 mr-3" />}
                        Native Audio
                      </Button>

                      <Button 
                        size="lg" 
                        className={`h-20 px-8 rounded-2xl text-lg font-bold transition-all shadow-glow-primary ${isRecording ? 'bg-destructive hover:bg-destructive/90 shadow-[0_0_30px_rgba(255,0,0,0.5)]' : ''}`}
                        onClick={toggleRecording}
                        disabled={isProcessingRef.current}
                      >
                        {isRecording ? (
                          <><Square className="w-6 h-6 mr-3 fill-current" /> Stop Recording</>
                        ) : (
                          <><Mic className="w-6 h-6 mr-3" /> Record Voice</>
                        )}
                      </Button>
                    </div>

                    {/* Waveform visualization mock */}
                    <div className="w-full max-w-md h-16 flex items-center justify-center gap-1 mb-8">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <motion.div 
                          key={i}
                          className={`w-2 rounded-full ${isRecording ? 'bg-destructive' : isPlayingNative ? 'bg-primary' : 'bg-muted'}`}
                          animate={{ 
                            height: isRecording || isPlayingNative ? Math.random() * 40 + 10 : 8 
                          }}
                          transition={{ 
                            repeat: isRecording || isPlayingNative ? Infinity : 0, 
                            duration: 0.2, 
                            repeatType: "reverse" 
                          }}
                        />
                      ))}
                    </div>

                    {lastAccuracy !== null && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                        <Button onClick={nextPhrase} className="w-full h-14 text-lg font-bold rounded-xl shadow-glow-primary">
                          Next Phrase <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </motion.div>
                    )}

                  </CardContent>
                </Card>

                {/* Sidebar Info */}
                <div className="space-y-6">
                  <Card className="border-2 border-border shadow-sm rounded-3xl bg-card">
                    <CardContent className="p-6">
                      <h3 className="font-black text-lg mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-primary"/> Your Accuracy</h3>
                      {lastAccuracy !== null ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-end">
                            <span className="text-4xl font-black text-primary">{lastAccuracy}%</span>
                            <span className="text-sm font-bold text-emerald-500 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1"/> Good</span>
                          </div>
                          <Progress value={lastAccuracy} className="h-3 rounded-full" />
                        </div>
                      ) : (
                        <div className="py-8 text-center text-muted-foreground font-medium border-2 border-dashed rounded-xl">
                          Record audio to see analysis
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {gameSetupData.mode === 'human_vs_computer' && (
                    <Card className="border-2 border-border shadow-sm rounded-3xl bg-card">
                      <CardContent className="p-6">
                        <h3 className="font-black text-lg mb-4 flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-accent"/> AI PRO Accuracy</h3>
                        {aiAccuracy !== null ? (
                          <div className="space-y-4">
                            <div className="flex justify-between items-end">
                              <span className="text-4xl font-black text-accent">{aiAccuracy}%</span>
                            </div>
                            <Progress value={aiAccuracy} className="h-3 rounded-full bg-muted [&>div]:bg-accent" />
                          </div>
                        ) : (
                          <div className="py-8 text-center text-muted-foreground font-medium border-2 border-dashed rounded-xl">
                            Waiting for turn...
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>

              </div>
            )}

          </div>
        </UnifiedGameLayout>
      )}
    </>
  );
}
