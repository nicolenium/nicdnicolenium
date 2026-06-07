
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

const GAME_SESSION_ID = 'local-2048-session';

const Game2048Page = () => {
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
      <div className="p-4 bg-orange-100 border border-orange-300 rounded-xl text-center">
        <p className="text-sm text-orange-800 font-bold uppercase tracking-wider">Score</p>
        <p className="text-4xl font-black text-orange-600 mt-2">{score}</p>
      </div>
      <div className="flex-1">
        <MoveTracker moves={moveHistory} title="Merge Log" />
      </div>
      <div className="pt-4 border-t border-border shrink-0 text-center">
        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-3 tracking-wider">Share & Follow</p>
        <SocialMediaLinks layout="horizontal" size="sm" className="justify-center" />
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>2048 - NICD</title></Helmet>
      <FullScreenGameLayout title={<BrandedGameHeader gameTitle="NICD 2048" />} mode="Puzzle" onExit={() => window.location.reload()} rightPanelContent={rightPanel}>
        <div className="w-full max-w-[70vh] aspect-square mx-auto relative rounded-3xl overflow-hidden shadow-2xl border-8 border-[#bbada0] bg-[#f0f0f0]">
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-4 p-4 bg-[#bbada0]">
             {Array.from({length: 16}).map((_, i) => <div key={i} className="bg-[#cdc1b4] rounded-lg relative"><span className="absolute top-1 left-1 text-[8px] font-normal text-black/30">{i+1}</span></div>)}
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 z-10">
            {gameOver ? (
              <BrandedGameOverScreen gameType="2048 Puzzle" score={score} onReplay={() => {setScore(0); setMoveHistory([]); setGameOver(false); setIsPlaying(true);}} />
            ) : isPlaying ? (
              <div className="text-center p-8 bg-[#faf8ef]/90 backdrop-blur rounded-3xl border border-[#cdc1b4] shadow-xl">
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button onClick={() => {setScore(s=>s+32); setMoveHistory(p=>[...p,{notation:`Merged Tiles (+32)`}]);}} size="lg" className="bg-[#f67c5f] hover:bg-[#f65e3b] text-white font-black text-lg px-8 py-6 rounded-xl shadow-md border-2 border-white/50">Merge Tiles (+32)</Button>
                  <Button onClick={() => setGameOver(true)} variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl border-[#776e65] text-[#776e65] font-bold">No Moves Left</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsPlaying(true)} size="lg" className="bg-[#edc22e] hover:bg-[#edb02e] text-white font-black text-xl px-10 py-8 rounded-2xl shadow-lg border-2 border-white/50">
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

export default Game2048Page;
