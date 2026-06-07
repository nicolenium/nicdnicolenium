
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

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SESSION_ID = 'local-snake-session';

const SnakePage = () => {
  const { privacySetting, updatePrivacy } = useGamePrivacy(GAME_SESSION_ID);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [moveHistory, setMoveHistory] = useState([]);

  const generateFood = useCallback((currentSnake) => {
    let newFood;
    while (true) {
      newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setFood(generateFood(INITIAL_SNAKE));
    setMoveHistory([]);
  };

  const saveSessionToDB = useCallback(async (finalScore) => {
    try {
      if (pb.authStore.isValid && pb.authStore.model?.collectionName === 'users') {
        await pb.collection('game_sessions').create({
          gameType: 'snake',
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
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': if (direction.y !== 1) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': case 's': if (direction.y !== -1) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': case 'a': if (direction.x !== 1) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': case 'd': if (direction.x !== -1) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE || prevSnake.some(s => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true); setIsPlaying(false); saveSessionToDB(score); return prevSnake;
        }
        const newSnake = [newHead, ...prevSnake];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10); setFood(generateFood(newSnake)); setMoveHistory(prev => [...prev, { notation: `Ate food at (${food.x}, ${food.y})` }]);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };
    const gameLoop = setInterval(moveSnake, 150);
    return () => clearInterval(gameLoop);
  }, [direction, food, isPlaying, gameOver, score, generateFood, saveSessionToDB]);

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
        <MoveTracker moves={moveHistory} title="Snake Log" />
      </div>
      <div className="pt-4 border-t border-border shrink-0 text-center">
        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-3 tracking-wider">Share & Follow</p>
        <SocialMediaLinks layout="horizontal" size="sm" className="justify-center" />
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Snake Master - NICD</title></Helmet>
      <FullScreenGameLayout title={<BrandedGameHeader gameTitle="NICD Snake Master" />} mode="Arcade" onExit={() => window.location.reload()} rightPanelContent={rightPanel}>
        <div className="w-full max-w-[70vh] aspect-square relative rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.2)] border-2 border-[#00ff00]/30 bg-[#1a1a1a]">
          {gameOver ? (
            <BrandedGameOverScreen gameType="Snake Master" score={score} onReplay={startGame} />
          ) : !isPlaying ? (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/50 backdrop-blur-sm">
              <Button onClick={startGame} size="lg" className="bg-[#00ff00] hover:bg-[#00cc00] text-black font-black text-xl px-10 py-8 rounded-2xl shadow-[0_0_30px_rgba(0,255,0,0.4)]">
                <PlaySquare className="w-8 h-8 mr-3" /> Start Game
              </Button>
            </div>
          ) : null}

          <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}>
            <div className="bg-red-500 rounded-full shadow-[0_0_10px_rgba(255,0,0,0.8)] m-1" style={{ gridColumn: food.x + 1, gridRow: food.y + 1 }} />
            {snake.map((segment, index) => (
              <div key={index} className={`m-[1px] rounded-sm ${index === 0 ? 'bg-[#00ff00] shadow-[0_0_10px_rgba(0,255,0,0.8)]' : 'bg-[#00cc00]'}`} style={{ gridColumn: segment.x + 1, gridRow: segment.y + 1 }} />
            ))}
          </div>
        </div>
      </FullScreenGameLayout>
      <PrivacySettingsModal open={showPrivacyModal} onOpenChange={setShowPrivacyModal} privacyLevel={privacySetting} onPrivacyChange={updatePrivacy} />
    </>
  );
};

export default SnakePage;
