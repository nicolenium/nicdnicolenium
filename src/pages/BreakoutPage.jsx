
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
import { Button } from '@/components/ui/button.jsx';
import { PlaySquare } from 'lucide-react';

const GAME_SESSION_ID = 'local-breakout-session';

const BreakoutPage = () => {
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
      <div className="p-4 bg-[#00ffff]/10 border border-[#00ffff]/30 rounded-xl text-center">
        <p className="text-sm text-[#00ffff] font-bold uppercase tracking-wider drop-shadow-sm">Score</p>
        <p className="text-4xl font-black text-[#00ffff] mt-2 drop-shadow-md">{score}</p>
      </div>
      <div className="flex-1">
        <MoveTracker moves={moveHistory} title="Action Log" />
      </div>
      <div className="pt-4 border-t border-border shrink-0 text-center">
        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-3 tracking-wider">Share & Follow</p>
        <SocialMediaLinks layout="horizontal" size="sm" className="justify-center" />
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Breakout - NICD</title></Helmet>
      <FullScreenGameLayout title={<BrandedGameHeader gameTitle="NICD Breakout" />} mode="Arcade" onExit={() => window.location.reload()} rightPanelContent={rightPanel}>
        <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,255,255,0.2)] border-2 border-[#00ffff]/30 bg-[#1a1a1a]">
          <div className="absolute top-0 left-0 right-0 h-1/3 grid grid-cols-10 grid-rows-5 gap-1 p-4 opacity-50 pointer-events-none">
             {Array.from({length: 50}).map((_, i) => <div key={i} className={`rounded-sm relative ${i<10?'bg-red-500':i<20?'bg-orange-500':i<30?'bg-yellow-500':i<40?'bg-green-500':'bg-cyan-500'}`}><span className="absolute top-0.5 left-1 text-[6px] font-normal text-black/50">{i+1}</span></div>)}
          </div>

          <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 z-10">
            {gameOver ? (
              <BrandedGameOverScreen gameType="Breakout" score={score} onReplay={() => {setScore(0); setMoveHistory([]); setGameOver(false); setIsPlaying(true);}} />
            ) : isPlaying ? (
              <div className="text-center p-8 bg-black/80 backdrop-blur rounded-3xl border border-[#00ffff]/50 shadow-[0_0_20px_rgba(0,255,255,0.15)]">
                <div className="w-24 h-4 bg-[#00ffff] mx-auto mb-6 rounded-full shadow-[0_0_15px_#00ffff]"></div>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => {setScore(s=>s+20); setMoveHistory(p=>[...p,{notation:`Broke Brick (+20)`}]);}} size="lg" className="bg-[#00ffff] text-black hover:bg-[#00cccc] font-bold text-lg px-8 py-6 rounded-xl border border-white/50 shadow-[0_0_10px_rgba(0,255,255,0.5)]">Break Brick</Button>
                  <Button onClick={() => setGameOver(true)} variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl border-border text-white hover:bg-white/10 font-bold">Ball Dropped</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsPlaying(true)} size="lg" className="bg-[#00ffff] text-black hover:bg-[#00cccc] font-black text-xl px-10 py-8 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.5)]">
                <PlaySquare className="w-8 h-8 mr-3" /> Start Game
              </Button>
            )}
          </div>
        </div>
      </FullScreenGameLayout>
      <PrivacySettingsModal open={showPrivacyModal} onOpenChange={setShowPrivacyModal} privacyLevel={privacySetting} onPrivacyChange={updatePrivacy} />
    </>
  );
};

export default BreakoutPage;
