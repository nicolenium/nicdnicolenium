
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
import SocialMediaLinks from '@/components/SocialMediaLinks.jsx';
import { useGamePrivacy } from '@/hooks/useGamePrivacy.js';
import { Button } from '@/components/ui/button.jsx';
import { PlaySquare } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';

const GRID_SIZE = 15;
const GAME_SESSION_ID = 'local-pacman-session';

const PacManPage = () => {
  const { privacySetting, updatePrivacy } = useGamePrivacy(GAME_SESSION_ID);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [pacman, setPacman] = useState({ x: 7, y: 7 });
  const [ghosts, setGhosts] = useState([{x: 1, y: 1}, {x: 13, y: 1}, {x: 1, y: 13}]);
  const [pellets, setPellets] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);

  const initGame = useCallback(() => {
    const newPellets = [];
    for(let y=0; y<GRID_SIZE; y++) {
      for(let x=0; x<GRID_SIZE; x++) {
        if (Math.random() > 0.3 && (x !== 7 || y !== 7)) newPellets.push({x, y});
      }
    }
    setPellets(newPellets);
    setPacman({ x: 7, y: 7 });
    setGhosts([{x: 1, y: 1}, {x: 13, y: 1}, {x: 1, y: 13}]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setMoveHistory([]);
  }, []);

  const saveSessionToDB = useCallback(async (finalScore) => {
    try {
      if (pb.authStore.isValid && pb.authStore.model?.collectionName === 'users') {
        await pb.collection('game_sessions').create({
          gameType: 'pacman',
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
    if (!isPlaying || gameOver) return;
    const handleKeyDown = (e) => {
      let dx = 0, dy = 0;
      if (e.key === 'ArrowUp' || e.key === 'w') dy = -1;
      if (e.key === 'ArrowDown' || e.key === 's') dy = 1;
      if (e.key === 'ArrowLeft' || e.key === 'a') dx = -1;
      if (e.key === 'ArrowRight' || e.key === 'd') dx = 1;
      if (dx !== 0 || dy !== 0) {
        setPacman(prev => ({ x: Math.max(0, Math.min(GRID_SIZE - 1, prev.x + dx)), y: Math.max(0, Math.min(GRID_SIZE - 1, prev.y + dy)) }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const interval = setInterval(() => {
      setGhosts(prev => prev.map(g => {
        const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        return { x: Math.max(0, Math.min(GRID_SIZE - 1, g.x + dir[0])), y: Math.max(0, Math.min(GRID_SIZE - 1, g.y + dir[1])) };
      }));
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const pelletIdx = pellets.findIndex(p => p.x === pacman.x && p.y === pacman.y);
    if (pelletIdx !== -1) {
      setPellets(prev => prev.filter((_, i) => i !== pelletIdx));
      setScore(s => s + 10);
    }
    if (ghosts.some(g => g.x === pacman.x && g.y === pacman.y)) {
      setGameOver(true);
      setIsPlaying(false);
      saveSessionToDB(score);
    }
  }, [pacman, ghosts, pellets, isPlaying, gameOver, score, saveSessionToDB]);

  const rightPanel = (
    <div className="space-y-4 h-full flex flex-col">
      <div className="bg-card border border-border rounded-xl p-3 flex items-center justify-between shadow-sm">
        <PrivacyIndicator privacyLevel={privacySetting} />
        <Button variant="ghost" size="sm" onClick={() => setShowPrivacyModal(true)} className="h-7 px-2 text-xs">Change</Button>
      </div>
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center">
        <p className="text-sm text-yellow-500 font-bold uppercase tracking-wider">Score</p>
        <p className="text-4xl font-black text-yellow-500 mt-2">{score}</p>
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
      <Helmet><title>Pac-Man - NICD</title></Helmet>
      <FullScreenGameLayout title={<BrandedGameHeader gameTitle="NICD PAC-MAN" />} mode="Arcade" onExit={() => window.location.reload()} rightPanelContent={rightPanel}>
        <div className="w-full max-w-[70vh] aspect-square relative rounded-xl overflow-hidden shadow-2xl border-4 border-blue-900 bg-slate-950">
          {gameOver ? (
            <div className="absolute inset-0 z-20 bg-black/80 flex items-center justify-center">
              <BrandedGameOverScreen gameType="PAC-MAN" score={score} onReplay={initGame} />
            </div>
          ) : !isPlaying ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
              <Button onClick={initGame} size="lg" className="bg-yellow-400 text-black hover:bg-yellow-500 font-black text-2xl px-12 py-8 rounded-2xl">
                <PlaySquare className="w-8 h-8 mr-3" /> Start Game
              </Button>
            </div>
          ) : null}

          <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}>
            {pellets.map((p, i) => (
              <div key={`p-${i}`} className="flex items-center justify-center" style={{ gridColumn: p.x + 1, gridRow: p.y + 1 }}>
                <div className="w-2 h-2 bg-yellow-200 rounded-full"></div>
              </div>
            ))}
            {ghosts.map((g, i) => (
              <div key={`g-${i}`} className="flex items-center justify-center z-10 transition-all duration-300" style={{ gridColumn: g.x + 1, gridRow: g.y + 1 }}>
                <div className="w-3/4 h-3/4 bg-red-500 rounded-t-full rounded-b-sm"></div>
              </div>
            ))}
            <div className="flex items-center justify-center z-10 transition-all duration-100" style={{ gridColumn: pacman.x + 1, gridRow: pacman.y + 1 }}>
              <div className="w-3/4 h-3/4 bg-yellow-400 rounded-full border-r-4 border-transparent animate-pulse"></div>
            </div>
          </div>
        </div>
      </FullScreenGameLayout>
      <PrivacySettingsModal open={showPrivacyModal} onOpenChange={setShowPrivacyModal} privacyLevel={privacySetting} onPrivacyChange={updatePrivacy} />
    </>
  );
};

export default PacManPage;
