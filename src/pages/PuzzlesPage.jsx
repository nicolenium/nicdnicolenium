
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PrivacySelector from '@/components/PrivacySelector.jsx';
import FullScreenGameLayout from '@/components/FullScreenGameLayout.jsx';
import BrandedGameHeader from '@/components/BrandedGameHeader.jsx';
import BrandedGameOverScreen from '@/components/BrandedGameOverScreen.jsx';
import MoveTracker from '@/components/MoveTracker.jsx';

const PuzzlesPage = () => {
  const [privacy, setPrivacy] = useState(null);
  const [moves, setMoves] = useState(0);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  if (!privacy) return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 flex justify-center items-center"><PrivacySelector onSelect={setPrivacy} /></main><Footer /></div>;

  const handleTileClick = (i) => {
    setMoves(m => m + 1);
    setMoveHistory(prev => [...prev, { notation: `Moved Tile ${i + 1}` }]);
    if (moves >= 10) setGameOver(true);
  };

  const rightPanel = (
    <div className="space-y-4 h-full flex flex-col">
      <div className="p-4 bg-muted border border-border rounded-xl text-center">
        <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Moves</p>
        <p className="text-4xl font-black mt-2">{moves}</p>
      </div>
      <div className="flex-1">
        <MoveTracker moves={moveHistory} title="Puzzle Steps" />
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Logic Puzzles - NICD NICOLENIUM</title></Helmet>
      <FullScreenGameLayout title={<BrandedGameHeader gameTitle="NICD NICOLENIUM Logic Puzzles" />} mode="15-Puzzle" onExit={() => window.location.reload()} rightPanelContent={rightPanel}>
        <div className="w-full max-w-[70vh] aspect-square mx-auto bg-card border-8 border-brand-primary/50 rounded-3xl p-6 shadow-2xl relative z-10 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05)_0,transparent_100%)]">
          {gameOver ? (
            <BrandedGameOverScreen gameType="Logic Puzzles" score={moves} onReplay={() => {setMoves(0); setMoveHistory([]); setGameOver(false);}} />
          ) : (
            <div className="grid grid-cols-4 gap-3 h-full">
              {Array.from({length: 15}).map((_, i) => (
                <button key={i} onClick={() => handleTileClick(i)} className="bg-brand-primary text-primary-foreground text-4xl font-black rounded-xl hover:bg-brand-primary/80 hover:scale-[1.02] transition-all shadow-md border-b-4 border-brand-primary/80 relative overflow-hidden group">
                  <span className="absolute top-1 left-2 text-[8px] font-normal opacity-50 group-hover:opacity-80">{i+1}</span>
                  {i + 1}
                </button>
              ))}
              <div className="bg-background rounded-xl border-2 border-dashed border-border/50 shadow-inner"></div>
            </div>
          )}
        </div>
      </FullScreenGameLayout>
    </>
  );
};
export default PuzzlesPage;
