
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import FullScreenGameLayout from '@/components/FullScreenGameLayout.jsx';
import BrandedGameHeader from '@/components/BrandedGameHeader.jsx';
import GameModeSelector from '@/components/GameModeSelector.jsx';
import SocialMediaLinks from '@/components/SocialMediaLinks.jsx';
import InviteButton from '@/components/InviteButton.jsx';
import RequestButton from '@/components/RequestButton.jsx';
import BrandingWatermark from '@/components/BrandingWatermark.jsx';

const DominoesPage = () => {
  const [gameMode, setGameMode] = useState(null);
  const [difficulty, setDifficulty] = useState(null);

  useEffect(() => {
    const inviteId = localStorage.getItem('nicd_dominoes_invite_match');
    if (inviteId) {
      setGameMode('human_vs_human');
      localStorage.removeItem('nicd_dominoes_invite_match');
    }
  }, []);

  const rightPanel = (
    <div className="space-y-4 h-full flex flex-col">
      <div className="p-6 bg-card border border-white/5 rounded-xl text-center shadow-lg">
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.2em]">Status</p>
        <p className="text-2xl font-black mt-2 text-primary">Coming Soon</p>
      </div>
      <div className="flex-1"></div>
      <div className="pt-4 border-t border-white/5 shrink-0 text-center">
        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-3 tracking-widest">Share & Follow</p>
        <SocialMediaLinks layout="horizontal" size="sm" className="justify-center" />
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>NICD Dominoes | Nicolenium Premium</title></Helmet>
      <FullScreenGameLayout title={<BrandedGameHeader gameTitle="NICD Premium Dominoes" />} mode="Classic" onExit={() => setGameMode(null)} rightPanelContent={rightPanel}>
        <div className="w-full h-full flex flex-col items-center justify-center p-4 relative">
          <BrandingWatermark position="bottom-right" />
          
          {!gameMode ? (
            <div className="w-full max-w-4xl flex flex-col items-center z-10">
              <div className="w-full flex justify-end gap-3 mb-6 px-4">
                <InviteButton gameType="dominoes" />
                <RequestButton gameType="dominoes" />
              </div>
              <GameModeSelector onStart={(mode, diff) => { setGameMode(mode); setDifficulty(diff); }} />
            </div>
          ) : (
            <div className="text-center p-12 bg-card/80 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl max-w-lg w-full mx-auto z-10">
              <h2 className="text-4xl font-black mb-4 tracking-tight uppercase">NICD Dominoes</h2>
              <p className="text-muted-foreground mb-8 font-medium">Mode: {gameMode} | Difficulty: {difficulty || 'N/A'}</p>
              <div className="py-6 px-4 bg-primary/10 rounded-2xl border border-primary/20 mb-8">
                <p className="text-xl font-bold text-primary">This premium experience is currently under development.</p>
              </div>
              <button onClick={() => setGameMode(null)} className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black uppercase tracking-widest interactive-scale w-full shadow-lg">Back to Menu</button>
            </div>
          )}
        </div>
      </FullScreenGameLayout>
    </>
  );
};

export default DominoesPage;
