
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { UnifiedGameLayout } from '@/components/UnifiedGameLayout.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Mic, CheckCircle2, Volume2, Square, Trophy, Loader2, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils.js';
import { toast } from 'sonner';
import { useSoundEffects } from '@/utils/soundManager.js';
import { GameClockDisplay } from '@/components/GameClockDisplay.jsx';
import GameAnimationOverlay from '@/components/GameAnimationOverlay.jsx';
import { useTimeControl } from '@/contexts/TimeControlContext.jsx';
import { useGameSession } from '@/hooks/useGameSession.js';
import { useGameStartFlow } from '@/hooks/useGameStartFlow.js';
import { useGameInitialization } from '@/hooks/useGameInitialization.js';
import TermsAndConditionsModal from '@/components/TermsAndConditionsModal.jsx';
import GameSetupModal from '@/components/GameSetupModal.jsx';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const LANGUAGES = ['English', 'Spanish', 'French', 'German'];

const WORDS = {
  English: [
    { word: "Rhythm", phonetic: "/ˈrɪð.əm/", guide: "Mouth relaxed, short 'ih' sound" },
    { word: "Pronunciation", phonetic: "/prəˌnʌn.siˈeɪ.ʃən/", guide: "Five syllables, stress on 'A'" }
  ],
  Spanish: [
    { word: "Ferrocarril", phonetic: "/fe.ro.kaˈril/", guide: "Roll the double 'rr' strongly" },
    { word: "Desarrollo", phonetic: "/de.saˈro.ʝo/", guide: "Roll 'rr' and soft 'll' sound" }
  ]
};

export default function PronunciationGamePage() {
  const { playWin, playLose } = useSoundEffects();
  const { getInitialSeconds } = useTimeControl();
  const { flowState, gameSetupData, initiateFlow, handleTermsAccept, handleTermsDecline, handleSetupComplete, handleSetupCancel } = useGameStartFlow('pronunciation_master');
  const { initializeSession, recordMove, moveHistory, handleGameOver } = useGameSession('pronunciation_master', gameSetupData || { mode: 'solo' });
  const { gameData, loading, retry } = useGameInitialization('pronunciation_master', gameSetupData, flowState === 'playing');
  
  const [language, setLanguage] = useState('English');
  const [level, setLevel] = useState('Beginner');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [score, setScore] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);
  
  const initialSeconds = useMemo(() => {
    if (!gameSetupData) return 180;
    const secs = getInitialSeconds(gameSetupData);
    return (secs === Infinity || secs === 0) ? 180 : secs; 
  }, [getInitialSeconds, gameSetupData]);
  
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    initiateFlow();
  }, [initiateFlow]);

  useEffect(() => {
    if (flowState === 'playing' && gameData) {
      initializeSession(gameSetupData || { mode: 'solo', timeLimit: initialSeconds });
    }
  }, [language, level, flowState, gameData?.gameId]);

  const wordList = WORDS[language] || WORDS['English'];
  const currentWord = wordList[currentIndex];

  const playNativeAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      const voiceMap = { 'Spanish': 'es-ES', 'French': 'fr-FR', 'German': 'de-DE', 'English': 'en-US' };
      utterance.lang = voiceMap[language] || 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      toast.info("Native audio playback not supported.");
    }
  };

  const handleRecord = async () => {
    if (isRecording || isFinished) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        const mockScore = Math.floor(Math.random() * 25) + 75;
        setScore(mockScore);
        
        recordMove(`Pronounced: ${currentWord.word}`, mockScore, {
          player: gameSetupData?.playerName || 'Student',
          accuracy: mockScore
        });

        if (mockScore >= 85) {
          playWin();
          setTotalScore(s => s + 10);
        } else {
          playLose();
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setScore(null);
      
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 3000);

    } catch (err) {
      toast.error('Microphone access denied. Please allow mic permissions.');
    }
  };

  const nextWord = () => {
    setScore(null);
    if (currentIndex + 1 < wordList.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishGame();
    }
  };

  const finishGame = (isTimeout = false) => {
    setIsFinished(true);
    const passed = totalScore >= (wordList.length * 10 * 0.5);
    setGameStatus(passed ? 'won' : 'lost');
    handleGameOver(isTimeout ? 'timeout' : (passed ? 'win' : 'loss'), totalScore);
  };

  const handleTimeExpired = () => {
    if (!isFinished) finishGame(true);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(null);
    setTotalScore(0);
    setIsFinished(false);
    setGameStatus(null);
    setTimeLeft(initialSeconds);
    initializeSession(gameSetupData || { mode: 'solo', timeLimit: initialSeconds });
  };

  const handleResign = () => {
    setGameStatus('lost');
    finishGame();
  };

  if (flowState === 'idle') return null;

  if (flowState === 'playing' && loading) {
    return (
      <UnifiedGameLayout title="Pronunciation Master" gameType="pronunciation">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-xl font-bold">Initializing game...</p>
        </div>
      </UnifiedGameLayout>
    );
  }

  return (
    <>
      <Helmet><title>Pronunciation Master | NICOLENIUM</title></Helmet>
      
      <TermsAndConditionsModal 
        isOpen={flowState === 'terms'} 
        onAccept={handleTermsAccept} 
        onDecline={handleTermsDecline} 
      />
      
      <GameSetupModal 
        isOpen={flowState === 'setup'} 
        onStart={handleSetupComplete} 
        onCancel={handleSetupCancel} 
        gameType="pronunciation_master" 
      />

      {flowState === 'playing' && gameData && (
        <UnifiedGameLayout 
          title="Pronunciation Master" 
          turnText={`Word ${currentIndex + 1} of ${wordList.length}`} 
          history={moveHistory}
          onReset={() => { retry(); resetGame(); }} 
          onResign={handleResign} 
          gameType="pronunciation"
        >
          <div className="w-full flex flex-col items-center justify-center max-w-3xl mx-auto py-8 relative">
            <GameAnimationOverlay gameStatus={gameStatus || 'in-progress'}>
              <Card className="w-full mb-8 bg-card border-2 relative z-10">
                 <CardHeader className="py-4 border-b flex flex-row items-center justify-between gap-4 space-y-0">
                   <CardTitle className="text-lg flex items-center gap-2"><PlayCircle className="w-5 h-5 text-primary"/> Setup</CardTitle>
                   <div className="flex gap-4">
                      <Select value={language} onValueChange={(v) => {setLanguage(v); resetGame();}} disabled={!isFinished && currentIndex > 0}>
                        <SelectTrigger className="w-[120px] font-bold"><SelectValue /></SelectTrigger>
                        <SelectContent>{LANGUAGES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                      </Select>
                      <Select value={level} onValueChange={setLevel} disabled={!isFinished && currentIndex > 0}>
                        <SelectTrigger className="w-[120px] font-bold"><SelectValue /></SelectTrigger>
                        <SelectContent>{LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                      </Select>
                   </div>
                 </CardHeader>
              </Card>

              <div className="flex justify-between w-full mb-8 items-center bg-card p-4 rounded-2xl border shadow-sm relative z-10">
                <GameClockDisplay playerName="Practice Timer" totalTimeSeconds={initialSeconds} timeRemainingSeconds={timeLeft} isActive={!isFinished} onTimeExpired={handleTimeExpired} />
                <div className="text-right">
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider block">Score</span>
                  <span className="text-3xl font-black text-primary">{totalScore}</span>
                </div>
              </div>

              <Card className="w-full shadow-2xl border-2 text-center bg-card rounded-3xl overflow-hidden relative z-10">
                {isRecording && <div className="absolute inset-0 border-4 border-destructive rounded-3xl animate-pulse pointer-events-none" />}
                
                <CardContent className="p-8 sm:p-14 flex flex-col items-center z-10 relative">
                  {isFinished ? (
                    <div className="text-center space-y-6 w-full">
                      <Trophy className="w-20 h-20 text-primary mx-auto mb-6 drop-shadow-md" />
                      <h2 className="text-4xl font-black text-foreground">{gameStatus === 'won' ? 'Session Passed!' : 'Session Complete'}</h2>
                      <p className="text-2xl text-muted-foreground font-medium mb-8">You scored <strong className="text-foreground">{totalScore}</strong> points.</p>
                      <Button onClick={() => { retry(); resetGame(); }} size="lg" className="h-16 px-10 text-xl font-bold rounded-full w-full max-w-md bg-primary text-primary-foreground shadow-glow-primary">Practice Again</Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-5xl sm:text-7xl font-black mb-6 tracking-tight text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{currentWord.word}</h2>
                      <p className="text-3xl text-foreground font-mono font-bold mb-6 bg-muted px-8 py-3 rounded-2xl border border-border/50 shadow-sm">{currentWord.phonetic}</p>
                      
                      <div className="bg-muted/50 p-6 rounded-2xl mb-12 w-full max-w-md border">
                        <p className="text-sm font-bold uppercase text-muted-foreground mb-2">Mouth Position Guide</p>
                        <p className="text-lg text-foreground font-medium">{currentWord.guide}</p>
                      </div>
                      
                      <div className="flex gap-8 mb-12">
                        <Button variant="outline" size="icon" className="w-20 h-20 rounded-full border-2 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all shadow-sm" onClick={playNativeAudio}>
                          <Volume2 className="w-10 h-10 fill-current" />
                        </Button>
                        <div className="relative">
                          {isRecording && <span className="absolute -inset-4 rounded-full bg-destructive/20 animate-ping" />}
                          <Button 
                            size="icon" 
                            className={cn("w-20 h-20 rounded-full transition-all duration-300 shadow-xl relative z-10", isRecording ? 'bg-destructive hover:bg-destructive shadow-destructive/40 scale-110' : 'bg-primary text-primary-foreground hover:bg-primary/90')}
                            onClick={handleRecord}
                          >
                            {isRecording ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-10 h-10" />}
                          </Button>
                        </div>
                      </div>

                      {score !== null && (
                        <div className="flex flex-col items-center animate-in zoom-in duration-300 w-full max-w-sm mt-4">
                          <div className={cn("flex items-center justify-center w-full py-4 rounded-2xl gap-3 text-2xl font-black mb-8 border-2 shadow-sm", score >= 85 ? "bg-green-500/10 text-green-600 border-green-500/30" : "bg-amber-500/10 text-amber-600 border-amber-500/30")}>
                            <CheckCircle2 className="w-8 h-8" /> Accuracy: {score}%
                          </div>
                          <Button onClick={nextWord} className="w-full h-16 text-xl font-black bg-foreground text-background hover:bg-foreground/90 transition-all rounded-full shadow-md active:scale-95">
                            {currentIndex + 1 < wordList.length ? 'Next Word' : 'Finish Lesson'}
                          </Button>
                        </div>
                      )}
                      
                      {isRecording && (
                        <div className="flex items-center gap-3 text-destructive font-bold animate-pulse mt-4 bg-destructive/10 px-6 py-3 rounded-full border border-destructive/20">
                          <Loader2 className="w-5 h-5 animate-spin" /> Recording in progress... Speak now!
                        </div>
                      )}
                    </>
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
