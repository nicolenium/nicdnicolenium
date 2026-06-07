
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import FullScreenGameLayout from '@/components/FullScreenGameLayout.jsx';
import BrandedGameHeader from '@/components/BrandedGameHeader.jsx';
import BrandedGameOverScreen from '@/components/BrandedGameOverScreen.jsx';
import MoveTracker from '@/components/MoveTracker.jsx';
import PrivacyIndicator from '@/components/PrivacyIndicator.jsx';
import PrivacySettingsModal from '@/components/PrivacySettingsModal.jsx';
import { useGamePrivacy } from '@/hooks/useGamePrivacy.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import pb from '@/lib/pocketbaseClient';

const GAME_SESSION_ID = 'local-wordgames-session';

const WordGamesPage = () => {
  const { privacySetting, updatePrivacy } = useGamePrivacy(GAME_SESSION_ID);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [score, setScore] = useState(0);
  const [moveHistory, setMoveHistory] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [submittedWords, setSubmittedWords] = useState(new Set());
  const [gameStarted, setGameStarted] = useState(false);

  const saveSessionToDB = useCallback(async (finalScore) => {
    try {
      if (pb.authStore.isValid && pb.authStore.model?.collectionName === 'users') {
        await pb.collection('game_sessions').create({
          gameType: 'word_games',
          userId: pb.authStore.model.id,
          score: finalScore,
          gameStatus: 'completed',
          moveHistory: moveHistory
        }, { $autoCancel: false });
      }
    } catch (err) {
      console.error("Failed saving session:", err);
    }
  }, [moveHistory]);

  useEffect(() => {
    if (gameStarted && !gameOver && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      saveSessionToDB(score);
    }
  }, [gameStarted, timeLeft, gameOver, score, saveSessionToDB]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!gameStarted) setGameStarted(true);
    
    const word = inputVal.trim().toLowerCase();
    if (!word || word.length < 3) return;
    
    if (submittedWords.has(word)) {
      setInputVal('');
      return;
    }

    const points = word.length * 10;
    setScore(s => s + points);
    setSubmittedWords(prev => new Set(prev).add(word));
    setMoveHistory(prev => [...prev, { notation: `${word.toUpperCase()} (+${points})` }]);
    setInputVal('');
  };

  const rightPanel = (
    <div className="space-y-4 h-full flex flex-col">
      <div className="bg-card border border-border rounded-xl p-3 flex items-center justify-between shadow-sm">
        <PrivacyIndicator privacyLevel={privacySetting} />
        <Button variant="ghost" size="sm" onClick={() => setShowPrivacyModal(true)} className="h-7 px-2 text-xs">Change</Button>
      </div>
      <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl text-center">
        <p className="text-sm text-primary font-bold uppercase tracking-wider">Score</p>
        <p className="text-4xl font-black text-primary mt-2">{score}</p>
      </div>
      <div className="p-4 bg-card border border-border rounded-xl text-center">
        <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Time Left</p>
        <p className={`text-3xl font-black mt-2 ${timeLeft <= 10 ? 'text-destructive animate-pulse' : 'text-foreground'}`}>{timeLeft}s</p>
      </div>
      <div className="flex-1">
        <MoveTracker moves={moveHistory} title="Words Found" />
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Word Weaver - NICD</title></Helmet>
      <FullScreenGameLayout title={<BrandedGameHeader gameTitle="NICD Word Weaver" />} mode="Blitz" onExit={() => window.location.reload()} rightPanelContent={rightPanel}>
        <div className="w-full max-w-2xl mx-auto flex flex-col justify-center items-center h-full space-y-8 relative z-10 px-4">
          {gameOver ? (
            <BrandedGameOverScreen gameType="Word Weaver" score={score} onReplay={() => {setScore(0); setMoveHistory([]); setSubmittedWords(new Set()); setTimeLeft(60); setGameOver(false); setGameStarted(false);}} />
          ) : (
            <div className="w-full bg-card p-8 rounded-3xl border border-border shadow-xl text-center">
              <h2 className="text-2xl font-bold mb-6 text-foreground">{gameStarted ? 'Keep going!' : 'Type a word to start!'}</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input 
                  value={inputVal} 
                  onChange={e=>setInputVal(e.target.value)} 
                  className="text-center text-3xl font-bold h-20 rounded-2xl border-primary/50 focus-visible:ring-primary uppercase bg-background text-foreground" 
                  placeholder="TYPE WORD..." 
                  autoFocus
                />
                <Button type="submit" size="lg" className="w-full text-xl h-16 rounded-2xl font-bold">Submit Word</Button>
              </form>
            </div>
          )}
        </div>
      </FullScreenGameLayout>
      <PrivacySettingsModal open={showPrivacyModal} onOpenChange={setShowPrivacyModal} privacyLevel={privacySetting} onPrivacyChange={updatePrivacy} />
    </>
  );
};

export default WordGamesPage;
