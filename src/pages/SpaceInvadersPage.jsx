
import React, { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { PlaySquare } from 'lucide-react';

const GAME_SESSION_ID = 'local-spaceinvaders-session';

const SpaceInvadersPage = () => {
  const { privacySetting, updatePrivacy } = useGamePrivacy(GAME_SESSION_ID);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const rightPanel = (
    <div className="space-y-4 h-full flex flex-col">
      <div className="bg-card border border-border rounded-xl p-3 flex items-center justify-between shadow-sm">
        <PrivacyIndicator privacyLevel={privacySetting} />
        <Button variant="ghost" size="sm" onClick={() => setShowPrivacyModal(true)} className="h-7 px-2 text-xs">Change</Button>
      </div>
      <div className="p-4 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded-xl text-center">
        <p className="text-sm text-[#00ff00] font-bold uppercase tracking-wider drop-shadow-sm">Score</p>
        <p className="text-4xl font-black text-[#00ff00] mt-2 drop-shadow-md">{score}</p>
      </div>
      <div className="flex-1">
        <MoveTracker moves={moveHistory} title="Combat Log" />
      </div>
      <div className="pt-4 border-t border-border shrink-0 text-center">
        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-3 tracking-wider">Share & Follow</p>
        <SocialMediaLinks layout="horizontal" size="sm" className="justify-center" />
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Space Invaders - NICD</title></Helmet>
      <FullScreenGameLayout title={<BrandedGameHeader gameTitle="NICD Space Invaders" />} mode="Arcade" onExit={() => window.location.reload()} rightPanelContent={rightPanel}>
        <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.15)] border-2 border-slate-800 bg-[#000000]">
          <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 z-10">
            {gameOver ? (
              <BrandedGameOverScreen gameType="Space Invaders" score={score} onReplay={() => {setScore(0); setMoveHistory([]); setGameOver(false); setIsPlaying(true);}} />
            ) : isPlaying ? (
              <div className="text-center p-8 bg-black/90 backdrop-blur rounded-3xl border border-[#00ff00]/50 shadow-[0_0_20px_rgba(0,255,0,0.2)]">
                <div className="w-16 h-8 bg-[#00ff00] mx-auto mb-6 rounded-sm shadow-[0_0_15px_#00ff00] clip-path-ship"></div>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => {setScore(s=>s+50); setMoveHistory(p=>[...p,{notation:`Alien Destroyed (+50)`}]);}} size="lg" className="bg-transparent hover:bg-[#ffffff]/20 text-[#ffffff] font-bold text-lg px-8 py-6 rounded-xl border-2 border-[#ffffff] shadow-[0_0_10px_rgba(255,255,255,0.5)]">Shoot Alien</Button>
                  <Button onClick={() => setGameOver(true)} variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl border-[#ff0000] text-[#ff0000] hover:bg-[#ff0000]/20 font-bold">Ship Destroyed</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsPlaying(true)} size="lg" className="bg-[#00ff00] text-black hover:bg-[#00cc00] font-black text-xl px-10 py-8 rounded-2xl shadow-[0_0_30px_rgba(0,255,0,0.5)]">
                <PlaySquare className="w-8 h-8 mr-3" /> Insert Coin
              </Button>
            )}
          </div>
        </div>
      </FullScreenGameLayout>
      <PrivacySettingsModal open={showPrivacyModal} onOpenChange={setShowPrivacyModal} privacyLevel={privacySetting} onPrivacyChange={updatePrivacy} />
    </>
  );
};

export default SpaceInvadersPage;
