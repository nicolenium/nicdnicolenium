
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PrivacySelector from '@/components/PrivacySelector.jsx';
import FullScreenGameLayout from '@/components/FullScreenGameLayout.jsx';
import BrandedGameHeader from '@/components/BrandedGameHeader.jsx';
import BrandedGameOverScreen from '@/components/BrandedGameOverScreen.jsx';
import MoveTracker from '@/components/MoveTracker.jsx';
import { Button } from '@/components/ui/button';
import { Swords } from 'lucide-react';

const TeamCompetitionsPage = () => {
  const [privacy, setPrivacy] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  if (!privacy) return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 flex justify-center items-center"><PrivacySelector onSelect={setPrivacy} /></main><Footer /></div>;

  const rightPanel = (
    <div className="space-y-4 h-full flex flex-col">
      <div className="p-3 bg-[#ff0000]/10 border border-[#ff0000]/30 rounded-lg"><p className="text-sm text-[#ff0000] font-bold">Red Team (You)</p><p className="text-2xl font-black text-[#ff0000]">1,250</p></div>
      <div className="p-3 bg-[#0066ff]/10 border border-[#0066ff]/30 rounded-lg"><p className="text-sm text-[#0066ff] font-bold">Blue Team</p><p className="text-2xl font-black text-[#0066ff]">980</p></div>
      <div className="flex-1">
        <MoveTracker moves={moveHistory} title="Team Events" />
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Team Clash - NICD NICOLENIUM</title></Helmet>
      <FullScreenGameLayout title={<BrandedGameHeader gameTitle="NICD NICOLENIUM Team Clash" />} mode="Global Arena" onExit={() => window.location.reload()} rightPanelContent={rightPanel}>
        <div className="w-full h-full bg-card border-4 border-brand-primary/30 rounded-3xl flex flex-col items-center justify-center p-8 shadow-2xl relative z-10 overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-5 pointer-events-none">
             {Array.from({length: 64}).map((_, i) => <div key={i} className="border border-foreground relative"><span className="absolute top-1 left-1 text-[6px] font-normal">{i+1}</span></div>)}
          </div>
          {gameOver ? (
            <BrandedGameOverScreen gameType="Team Clash" score={1250} onReplay={() => {setMoveHistory([]); setGameOver(false);}} />
          ) : (
            <div className="relative z-10 text-center bg-background/80 p-12 rounded-3xl backdrop-blur border border-border shadow-xl">
              <Swords className="w-32 h-32 text-brand-primary mb-8 animate-pulse drop-shadow-[0_0_15px_rgba(0,255,255,0.5)] mx-auto" />
              <h2 className="text-5xl font-black text-foreground mb-4 uppercase tracking-tight">Match in Progress</h2>
              <p className="text-muted-foreground text-2xl mb-12 font-medium">Your team is currently competing in the global arena.</p>
              <div className="flex gap-6 justify-center">
                <Button size="lg" onClick={() => setMoveHistory(p => [...p, {notation: 'Contributed 50 points to Red Team', quality: 'good'}])} className="bg-[#ff0000] text-white hover:bg-red-700 font-bold text-xl px-8 py-6 rounded-xl border border-white/20 shadow-lg">Contribute Points</Button>
                <Button size="lg" variant="outline" onClick={() => setGameOver(true)} className="text-xl px-8 py-6 rounded-xl font-bold border-border hover:bg-muted">Concede Match</Button>
              </div>
            </div>
          )}
        </div>
      </FullScreenGameLayout>
    </>
  );
};
export default TeamCompetitionsPage;
