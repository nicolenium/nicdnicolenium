
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import FullScreenGameLayout from '@/components/FullScreenGameLayout.jsx';
import BrandedGameHeader from '@/components/BrandedGameHeader.jsx';
import BrandedGameOverScreen from '@/components/BrandedGameOverScreen.jsx';
import MoveTracker from '@/components/MoveTracker.jsx';
import PrivacyIndicator from '@/components/PrivacyIndicator.jsx';
import PrivacySettingsModal from '@/components/PrivacySettingsModal.jsx';
import SocialMediaLinks from '@/components/SocialMediaLinks.jsx';
import { useGamePrivacy } from '@/hooks/useGamePrivacy.js';
import { Button } from '@/components/ui/button.jsx';
import { PlaySquare } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';

const GAME_SESSION_ID = 'local-flappy-session';

const FlappyBirdPage = () => {
  const { privacySetting, updatePrivacy } = useGamePrivacy(GAME_SESSION_ID);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const saveScoreToDB = useCallback(async (finalScore) => {
    try {
      if (pb.authStore.isValid && pb.authStore.model?.collectionName === 'users') {
        await pb.collection('game_sessions').create({
          gameType: 'flappy_bird',
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

  const handleAction = () => {
    setScore(s => s + 10);
    setMoveHistory(prev => [...prev, { notation: `Flapped (Score: ${score + 10})`, timeSpent: 0 }]);
  };

  const handleGameOver = () => {
    setGameOver(true);
    saveScoreToDB(score);
  };

  const rightPanel = (
    <div className="space-y-4 h-full flex flex-col">
      <div className="bg-card border border-border rounded-xl p-3 flex items-center justify-between shadow-sm">
        <PrivacyIndicator privacyLevel={privacySetting} />
        <Button variant="ghost" size="sm" onClick={() => setShowPrivacyModal(true)} className="h-7 px-2 text-xs">Change</Button>
      </div>
      <div className="p-4 bg-sky-100 border border-sky-300 rounded-xl text-center">
        <p className="text-sm text-sky-800 font-bold uppercase tracking-wider">Score</p>
        <p className="text-4xl font-black text-sky-600 mt-2">{score}</p>
      </div>
      <div className="flex-1">
        <MoveTracker moves={moveHistory} title="Flight Log" />
      </div>
      <div className="pt-4 border-t border-border shrink-0 text-center">
        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-3 tracking-wider">Share & Follow</p>
        <SocialMediaLinks layout="horizontal" size="sm" className="justify-center" />
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Flappy Challenge - NICD</title></Helmet>
      <FullScreenGameLayout title={<BrandedGameHeader gameTitle="NICD Flappy Challenge" />} mode="Arcade" onExit={() => window.location.reload()} rightPanelContent={rightPanel}>
        <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-xl border-4 border-slate-700 bg-[#87ceeb] min-h-[60vh]">
          <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 z-10 p-4">
            {gameOver ? (
              <BrandedGameOverScreen gameType="Flappy Challenge" score={score} onReplay={() => {setScore(0); setMoveHistory([]); setGameOver(false); setIsPlaying(true);}} />
            ) : isPlaying ? (
              <div className="text-center p-6 md:p-8 bg-white/90 backdrop-blur rounded-3xl border-4 border-[#00cc00] shadow-lg max-w-sm w-full">
                <div className="w-12 h-12 bg-[#ffff00] rounded-full mx-auto mb-6 border-4 border-orange-500 shadow-md"></div>
                <p className="text-slate-800 text-lg font-bold mb-6 tracking-wide uppercase">Tap / Click to Fly</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleAction} size="lg" className="bg-[#00cc00] text-white hover:bg-green-600 font-black text-lg px-8 py-6 rounded-xl border-2 border-white/50 shadow-md w-full sm:w-auto">Fly Up</Button>
                  <Button onClick={handleGameOver} variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl border-slate-300 text-slate-600 font-bold hover:bg-slate-100 w-full sm:w-auto">Crash</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsPlaying(true)} size="lg" className="bg-[#ffff00] text-orange-600 hover:bg-yellow-400 font-black text-xl md:text-2xl px-8 md:px-12 py-8 rounded-2xl shadow-lg border-4 border-orange-500 hover:scale-105 transition-transform">
                <PlaySquare className="w-8 h-8 mr-3" /> Start Challenge
              </Button>
            )}
          </div>
        </div>
      </FullScreenGameLayout>
      <PrivacySettingsModal open={showPrivacyModal} onOpenChange={setShowPrivacyModal} privacyLevel={privacySetting} onPrivacyChange={updatePrivacy} />
    </>
  );
};

export default FlappyBirdPage;
