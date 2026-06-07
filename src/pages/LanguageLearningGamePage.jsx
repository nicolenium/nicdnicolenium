
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UnifiedGameLayout } from '@/components/UnifiedGameLayout.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { useGameSession } from '@/hooks/useGameSession.js';
import CombinedGameSetupModal from '@/components/CombinedGameSetupModal.jsx';
import GameAnimationOverlay from '@/components/GameAnimationOverlay.jsx';
import { useGameConfig } from '@/contexts/GameConfigContext.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import apiServerClient from '@/lib/apiServerClient.js';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';
import { 
  BookOpen, Volume2, Edit3, RotateCcw, ArrowRight, 
  BrainCircuit, Trophy, SkipForward, Lightbulb
} from 'lucide-react';
import { AIResponseManager } from '@/utils/AIResponseManager.js';
import { useSoundEffects } from '@/utils/soundManager.js';
import AudioPlayerFixed from '@/components/AudioPlayerFixed.jsx';

const LESSON_DATA = [
  { id: 1, type: 'vocab', word: 'El Mundo', translation: 'The World', hint: 'Planet Earth', fallbackAudio: 'https://actions.google.com/sounds/v1/speech/spanish_greeting.ogg' },
  { id: 2, type: 'grammar', question: 'Translate: "I am learning"', options: ['Yo soy aprendiendo', 'Yo estoy aprendiendo', 'Yo aprendo', 'Me aprendo'], answer: 'Yo estoy aprendiendo' },
  { id: 3, type: 'listening', text: 'Buenos días', translation: 'Good morning', fallbackAudio: 'https://actions.google.com/sounds/v1/speech/spanish_greeting.ogg' },
  { id: 4, type: 'vocab', word: 'La Biblioteca', translation: 'The Library', hint: 'Place with books', fallbackAudio: 'https://actions.google.com/sounds/v1/speech/spanish_greeting.ogg' },
  { id: 5, type: 'grammar', question: 'Select the correct article: ___ agua', options: ['El', 'La', 'Los', 'Las'], answer: 'El' },
  { id: 6, type: 'vocab', word: 'El Gato', translation: 'The Cat', hint: 'Feline animal', fallbackAudio: 'https://actions.google.com/sounds/v1/speech/spanish_greeting.ogg' },
  { id: 7, type: 'grammar', question: 'Translate: "She is reading"', options: ['Ella es leyendo', 'Ella está leyendo', 'Ella lee', 'Le lee'], answer: 'Ella está leyendo' },
  { id: 8, type: 'listening', text: 'Buenas noches', translation: 'Good night', fallbackAudio: 'https://actions.google.com/sounds/v1/speech/spanish_greeting.ogg' },
  { id: 9, type: 'vocab', word: 'El Perro', translation: 'The Dog', hint: 'Canine animal', fallbackAudio: 'https://actions.google.com/sounds/v1/speech/spanish_greeting.ogg' },
  { id: 10, type: 'grammar', question: 'Select the correct article: ___ casa', options: ['El', 'La', 'Los', 'Las'], answer: 'La' },
];

const LANGUAGE_CODES = {
  'spanish': 'es', 'french': 'fr', 'german': 'de', 'italian': 'it',
  'portuguese': 'pt', 'japanese': 'ja', 'chinese': 'zh', 'mandarin': 'zh',
  'korean': 'ko', 'english': 'en'
};

export default function LanguageLearningGamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { gameConfig: contextConfig, setGameConfig } = useGameConfig();
  const { playWin, playLose } = useSoundEffects();

  const routerConfig = location.state?.gameConfig;
  const [gameSetupData, setGameSetupData] = useState(() => routerConfig || contextConfig || null);
  const [showSetupModal, setShowSetupModal] = useState(!gameSetupData);

  const { initializeSession, recordMove, handleGameOver, moveHistory } = useGameSession('language_learning', gameSetupData);

  const [activeTab, setActiveTab] = useState('vocab');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [textInput, setTextInput] = useState('');

  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const isProcessingRef = useRef(false);

  const currentLesson = useMemo(() => {
    const filtered = LESSON_DATA.filter(l => l.type === activeTab);
    return filtered[currentIdx % filtered.length] || LESSON_DATA[0];
  }, [activeTab, currentIdx]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchAudio = async () => {
      const textToSpeak = currentLesson.word || currentLesson.text;
      
      if (!textToSpeak || activeTab === 'grammar') {
        if (isMounted) {
          setCurrentAudioUrl(null);
          setIsAudioLoading(false);
        }
        return;
      }
      
      if (isMounted) {
        setIsAudioLoading(true);
        setCurrentAudioUrl(null);
      }
      
      try {
        const langName = (gameSetupData?.language || 'Spanish').toLowerCase();
        const langCode = LANGUAGE_CODES[langName] || 'es';
        const difficulty = gameSetupData?.difficulty || 'beginner';
        
        const response = await apiServerClient.fetch(
          `/audio/generate/${langCode}/${encodeURIComponent(textToSpeak)}?difficulty=${difficulty}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to generate audio from backend');
        }
        
        const data = await response.json();
        
        if (isMounted && data.audio?.normal?.publicUrl) {
          setCurrentAudioUrl(data.audio.normal.publicUrl);
        } else if (isMounted) {
          setCurrentAudioUrl(currentLesson.fallbackAudio);
        }
      } catch (err) {
        console.warn("Audio generation error (using fallback):", err.message);
        if (isMounted) {
          setCurrentAudioUrl(currentLesson.fallbackAudio);
        }
      } finally {
        if (isMounted) {
          setIsAudioLoading(false);
        }
      }
    };

    if (isPlaying && !isGameOver) {
      fetchAudio();
    }

    return () => { isMounted = false; };
  }, [currentLesson, activeTab, gameSetupData, isPlaying, isGameOver]);

  useEffect(() => {
    if (gameSetupData && !isPlaying && !isGameOver && !showSetupModal) {
      handleGameStart(gameSetupData);
    }
  }, []);

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

  const simulateAIOpponent = () => {
    if (gameSetupData?.mode === 'human_vs_computer' && !isGameOver) {
      isProcessingRef.current = true;
      try {
        if (AIResponseManager && AIResponseManager.simulateQuizAnswer) {
          AIResponseManager.simulateQuizAnswer(gameSetupData?.difficulty || 'medium').then(isCorrect => {
            if (isCorrect) {
              setAiScore(s => s + 10);
              recordMove(`AI PRO answered correctly`, 10, { player: 'AI PRO', forceSync: true });
            } else {
              recordMove(`AI PRO missed`, 0, { player: 'AI PRO', forceSync: true });
            }
          }).finally(() => {
            isProcessingRef.current = false;
          });
        } else {
          setTimeout(() => {
            const isCorrect = Math.random() > 0.5;
            if (isCorrect) {
              setAiScore(s => s + 10);
              recordMove(`AI PRO answered correctly`, 10, { player: 'AI PRO', forceSync: true });
            } else {
              recordMove(`AI PRO missed`, 0, { player: 'AI PRO', forceSync: true });
            }
            isProcessingRef.current = false;
          }, 1000);
        }
      } catch (e) {
        console.error("AI Simulation error:", e);
        isProcessingRef.current = false;
      }
    }
  };

  const handleAnswer = (isCorrect, answerText) => {
    if (isProcessingRef.current) return;
    
    if (isCorrect) {
      setScore(s => s + 10);
      playWin();
      toast.success("Correct! +10 XP");
      recordMove(`Correct: ${answerText}`, 10, { forceSync: true });
    } else {
      playLose();
      toast.error("Incorrect. Keep practicing!");
      recordMove(`Incorrect: ${answerText}`, 0, { forceSync: true });
    }

    simulateAIOpponent();

    setTimeout(() => {
      nextLesson();
    }, 1500);
  };

  const nextLesson = () => {
    setIsFlipped(false);
    setSelectedOption(null);
    setTextInput('');
    
    if (currentIdx >= 9) { 
      endGame();
    } else {
      setCurrentIdx(i => i + 1);
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
      <Helmet><title>Language Learning | NICOLENIUM</title></Helmet>
      
      <CombinedGameSetupModal 
        isOpen={showSetupModal} 
        gameType="language_learning"
        game={{ name: "Language Learning", id: "language-learning" }}
        onGameStart={handleGameStart} 
        onClose={handleCloseModal} 
      />

      {!showSetupModal && gameSetupData && (
        <UnifiedGameLayout 
          title="Language Learning" 
          turnText={`Exercise ${currentIdx + 1}/10`} 
          onReset={() => handleGameStart(gameSetupData)} 
          history={moveHistory} 
          gameType="language_learning"
          onResign={endGame}
          canUndo={false}
        >
          <div className="w-full flex flex-col items-center justify-start max-w-5xl mx-auto py-4 md:py-8 px-4">
            
            <div className="w-full flex justify-between items-center mb-6 bg-card border-2 border-border p-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-bold text-xl">
                  {gameSetupData.playerName?.charAt(0) || currentUser?.username?.charAt(0) || 'P'}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{gameSetupData.playerName || currentUser?.username || 'Player'}</span>
                  <span className="text-2xl font-black text-primary">{score} XP</span>
                </div>
              </div>

              <div className="flex-1 px-8 hidden md:block">
                <Progress value={(currentIdx / 10) * 100} className="h-3 rounded-full" />
              </div>

              {gameSetupData.mode === 'human_vs_computer' && (
                <div className="flex items-center gap-3 text-right">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">AI PRO</span>
                    <span className="text-2xl font-black text-accent">{aiScore} XP</span>
                  </div>
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                </div>
              )}
            </div>

            <GameAnimationOverlay gameStatus={isGameOver ? 'won' : 'in-progress'}>
              {isGameOver ? (
                <Card className="w-full border-2 border-border shadow-xl rounded-3xl bg-card overflow-hidden">
                  <CardContent className="p-12 text-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary mb-6">
                      <Trophy className="w-12 h-12" />
                    </div>
                    <h3 className="text-4xl font-black tracking-tight mb-2">Lesson Complete!</h3>
                    <p className="text-2xl font-medium text-muted-foreground mb-8">
                      Total Experience: <strong className="text-primary text-3xl ml-2">{score} XP</strong>
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button onClick={() => handleGameStart(gameSetupData)} size="lg" className="font-bold px-10 h-14 text-lg rounded-full shadow-glow-primary">
                        <RotateCcw className="w-5 h-5 mr-2" /> Next Lesson
                      </Button>
                      <Button onClick={handleCloseModal} variant="outline" size="lg" className="font-bold px-10 h-14 text-lg rounded-full border-2">
                        Exit to Hub
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="w-full border-2 border-border shadow-xl rounded-3xl bg-card overflow-hidden flex flex-col min-h-[500px]">
                  <div className="bg-muted/30 border-b border-border p-2">
                    <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setCurrentIdx(0); }} className="w-full">
                      <TabsList className="w-full h-14 bg-transparent justify-start gap-2 overflow-x-auto">
                        <TabsTrigger value="vocab" className="h-10 px-6 rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow-primary transition-all">
                          <BookOpen className="w-4 h-4 mr-2" /> Vocabulary
                        </TabsTrigger>
                        <TabsTrigger value="grammar" className="h-10 px-6 rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow-primary transition-all">
                          <Edit3 className="w-4 h-4 mr-2" /> Grammar
                        </TabsTrigger>
                        <TabsTrigger value="listening" className="h-10 px-6 rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow-primary transition-all">
                          <Volume2 className="w-4 h-4 mr-2" /> Listening
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <CardContent className="p-8 md:p-12 flex-1 flex flex-col items-center justify-center relative">
                    
                    <div className="absolute top-6 right-6 flex gap-2 z-20">
                      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-2 bg-background" onClick={() => toast.info(`Hint: ${currentLesson.hint || 'No hint available'}`)}>
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-2 bg-background" onClick={nextLesson}>
                        <SkipForward className="w-4 h-4" />
                      </Button>
                    </div>

                    {activeTab === 'vocab' && (
                      <div className="w-full max-w-md perspective-1000" style={{ transformStyle: 'preserve-3d' }}>
                        <motion.div 
                          className="w-full aspect-[4/3] relative cursor-pointer"
                          animate={{ rotateY: isFlipped ? 180 : 0 }}
                          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                          onClick={() => setIsFlipped(!isFlipped)}
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          <div 
                            className="absolute inset-0 bg-gradient-to-br from-card to-muted border-2 border-border rounded-3xl shadow-lg flex flex-col items-center justify-center p-8 z-10"
                            style={{ backfaceVisibility: 'hidden' }}
                          >
                            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Translate</span>
                            <h3 className="text-4xl md:text-5xl font-black text-foreground text-center mb-6">{currentLesson.word}</h3>
                            
                            <div className="w-full mt-4" onClick={e => e.stopPropagation()}>
                              <AudioPlayerFixed 
                                audioUrl={currentAudioUrl} 
                                isLoading={isAudioLoading}
                                title="Pronunciation" 
                                transcript={currentLesson.word}
                                translation={currentLesson.translation}
                              />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mt-8 flex items-center gap-2"><RotateCcw className="w-4 h-4"/> Click to flip</p>
                          </div>
                          
                          <div 
                            className="absolute inset-0 bg-primary border-2 border-primary rounded-3xl shadow-glow-primary flex flex-col items-center justify-center p-8"
                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                          >
                            <span className="text-sm font-bold uppercase tracking-widest text-primary-foreground/80 mb-4">Meaning</span>
                            <h3 className="text-4xl md:text-5xl font-black text-primary-foreground text-center">{currentLesson.translation}</h3>
                            <div className="mt-8 flex gap-4">
                              <Button variant="secondary" className="rounded-full font-bold shadow-md" onClick={(e) => { e.stopPropagation(); handleAnswer(false, currentLesson.word); }}>Still Learning</Button>
                              <Button className="bg-emerald-500 text-white hover:bg-emerald-600 rounded-full font-bold shadow-md" onClick={(e) => { e.stopPropagation(); handleAnswer(true, currentLesson.word); }}>I Know This</Button>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {activeTab === 'grammar' && (
                      <div className="w-full max-w-2xl text-center">
                        <h3 className="text-2xl md:text-3xl font-black mb-8 leading-snug">{currentLesson.question}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {currentLesson.options?.map((opt, i) => (
                            <Button 
                              key={i}
                              variant={selectedOption === opt ? (opt === currentLesson.answer ? 'default' : 'destructive') : 'outline'}
                              className={`h-auto py-6 text-lg font-bold border-2 rounded-2xl transition-all ${selectedOption === opt && opt === currentLesson.answer ? 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600' : ''}`}
                              onClick={() => {
                                setSelectedOption(opt);
                                handleAnswer(opt === currentLesson.answer, opt);
                              }}
                              disabled={selectedOption !== null}
                            >
                              {opt}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'listening' && (
                      <div className="w-full max-w-xl text-center space-y-8">
                        <div className="w-full max-w-md mx-auto">
                          <AudioPlayerFixed 
                            audioUrl={currentAudioUrl} 
                            isLoading={isAudioLoading}
                            title="Listen carefully" 
                            transcript={currentLesson.text}
                            translation={currentLesson.translation}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <p className="text-lg font-bold text-muted-foreground">Type what you hear in English:</p>
                          <Input 
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Type translation here..."
                            className="h-16 text-xl text-center font-bold border-2 rounded-2xl bg-muted/30"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && textInput) {
                                handleAnswer(textInput.toLowerCase().trim() === currentLesson.translation.toLowerCase(), textInput);
                              }
                            }}
                          />
                          <Button 
                            className="w-full h-14 text-lg font-bold rounded-xl shadow-glow-primary"
                            disabled={!textInput}
                            onClick={() => handleAnswer(textInput.toLowerCase().trim() === currentLesson.translation.toLowerCase(), textInput)}
                          >
                            Check Answer
                          </Button>
                        </div>
                      </div>
                    )}

                  </CardContent>
                </Card>
              )}
            </GameAnimationOverlay>
          </div>
        </UnifiedGameLayout>
      )}
    </>
  );
}
