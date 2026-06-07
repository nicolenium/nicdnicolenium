
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Bot, Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSoundEffects } from '@/utils/soundManager';

// Helper to generate a full set of 28 dominoes
const generateDominoSet = () => {
  const set = [];
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      set.push([i, j]);
    }
  }
  // Shuffle
  for (let i = set.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [set[i], set[j]] = [set[j], set[i]];
  }
  return set;
};

// Local AI Fallback to ensure game always works
const getLocalAIMove = (hand, ends) => {
  if (ends.length === 0) {
    // Play highest double or highest tile
    let best = hand[0];
    let maxScore = -1;
    for (const t of hand) {
      const score = t[0] + t[1] + (t[0] === t[1] ? 10 : 0);
      if (score > maxScore) { maxScore = score; best = t; }
    }
    return { tile: best, end: 0 };
  }

  const validMoves = hand.filter(t => t.includes(ends[0]) || t.includes(ends[1]));
  if (validMoves.length === 0) return null;

  // Pick the highest value valid tile
  let bestMove = null;
  let maxScore = -1;
  
  for (const t of validMoves) {
    const score = t[0] + t[1];
    if (score > maxScore) {
      maxScore = score;
      const end = t.includes(ends[0]) ? 0 : 1;
      bestMove = { tile: t, end };
    }
  }
  return bestMove;
};

const DominoTile = ({ tile, onClick, isPlayable, horizontal = false }) => {
  if (!tile) return null;
  
  const renderDots = (num) => {
    const dots = [];
    const positions = {
      1: ['col-start-2 row-start-2'],
      2: ['col-start-1 row-start-1', 'col-start-3 row-start-3'],
      3: ['col-start-1 row-start-1', 'col-start-2 row-start-2', 'col-start-3 row-start-3'],
      4: ['col-start-1 row-start-1', 'col-start-3 row-start-1', 'col-start-1 row-start-3', 'col-start-3 row-start-3'],
      5: ['col-start-1 row-start-1', 'col-start-3 row-start-1', 'col-start-2 row-start-2', 'col-start-1 row-start-3', 'col-start-3 row-start-3'],
      6: ['col-start-1 row-start-1', 'col-start-3 row-start-1', 'col-start-1 row-start-2', 'col-start-3 row-start-2', 'col-start-1 row-start-3', 'col-start-3 row-start-3']
    };

    for (let i = 0; i < 9; i++) {
      const posClass = `col-start-${(i % 3) + 1} row-start-${Math.floor(i / 3) + 1}`;
      const hasDot = positions[num]?.includes(posClass);
      dots.push(
        <div key={i} className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${hasDot ? 'bg-black' : 'bg-transparent'} ${posClass}`} />
      );
    }
    return <div className="grid grid-cols-3 grid-rows-3 gap-1 p-2 w-full h-full">{dots}</div>;
  };

  return (
    <div 
      onClick={isPlayable ? () => onClick(tile) : undefined}
      className={`domino-tile ${horizontal ? 'w-24 h-12 flex-row' : 'w-12 h-24 flex-col'} 
        ${isPlayable ? 'cursor-pointer hover:-translate-y-2 ring-2 ring-primary ring-offset-2' : 'opacity-90'}
        bg-white rounded-lg shadow-md border border-black/10 flex items-center justify-between overflow-hidden transition-all duration-200 shrink-0`}
    >
      <div className={`flex-1 flex items-center justify-center ${horizontal ? 'border-r border-black/20' : 'border-b border-black/20'}`}>
        {renderDots(tile[0])}
      </div>
      <div className="flex-1 flex items-center justify-center">
        {renderDots(tile[1])}
      </div>
    </div>
  );
};

export default function DominoGame() {
  const location = useLocation();
  const navigate = useNavigate();
  const sounds = useSoundEffects();
  const { difficulty = 'medium' } = location.state || {};

  const [playerHand, setPlayerHand] = useState([]);
  const [aiHand, setAiHand] = useState([]);
  const [boneyard, setBoneyard] = useState([]);
  const [board, setBoard] = useState([]); 
  const [boardEnds, setBoardEnds] = useState([]); 
  const [turn, setTurn] = useState('player'); 
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const set = generateDominoSet();
    setPlayerHand(set.slice(0, 7));
    setAiHand(set.slice(7, 14));
    setBoneyard(set.slice(14));
    setBoard([]);
    setBoardEnds([]);
    setTurn('player');
    setGameOver(false);
    setWinner(null);
  }, []);

  const getValidMoves = useCallback((hand, ends) => {
    if (ends.length === 0) return hand;
    return hand.filter(t => t.includes(ends[0]) || t.includes(ends[1]));
  }, []);

  const checkGameOver = useCallback(() => {
    if (playerHand.length === 0) {
      setGameOver(true);
      setWinner('player');
      sounds.playWin();
      return true;
    }
    if (aiHand.length === 0) {
      setGameOver(true);
      setWinner('ai');
      sounds.playLose();
      return true;
    }

    const playerValid = getValidMoves(playerHand, boardEnds);
    const aiValid = getValidMoves(aiHand, boardEnds);
    
    if (playerValid.length === 0 && aiValid.length === 0 && boneyard.length === 0) {
      setGameOver(true);
      const pScore = playerHand.reduce((sum, t) => sum + t[0] + t[1], 0);
      const aScore = aiHand.reduce((sum, t) => sum + t[0] + t[1], 0);
      if (pScore < aScore) {
        setWinner('player');
        sounds.playWin();
      } else if (aScore < pScore) {
        setWinner('ai');
        sounds.playLose();
      } else {
        setWinner('draw');
      }
      return true;
    }
    return false;
  }, [playerHand, aiHand, boardEnds, boneyard, getValidMoves, sounds]);

  const playTile = useCallback((tile, playerType, endChoice = null) => {
    sounds.playMove();
    
    let newEnds = [...boardEnds];
    let newBoard = [...board];

    if (boardEnds.length === 0) {
      newEnds = [tile[0], tile[1]];
      newBoard = [tile];
    } else {
      let playEnd = endChoice;
      if (playEnd === null) {
        if (tile.includes(boardEnds[0]) && !tile.includes(boardEnds[1])) playEnd = 0;
        else if (!tile.includes(boardEnds[0]) && tile.includes(boardEnds[1])) playEnd = 1;
        else playEnd = 0; 
      }

      const matchVal = boardEnds[playEnd];
      const newVal = tile[0] === matchVal ? tile[1] : tile[0];
      const orientedTile = tile[0] === matchVal ? [tile[1], tile[0]] : [tile[0], tile[1]];

      if (playEnd === 0) {
        newEnds[0] = newVal;
        newBoard = [orientedTile, ...board];
      } else {
        newEnds[1] = newVal;
        newBoard = [...board, orientedTile];
      }
    }

    setBoard(newBoard);
    setBoardEnds(newEnds);

    if (playerType === 'player') {
      setPlayerHand(prev => prev.filter(t => t !== tile));
      setTurn('ai');
    } else {
      setAiHand(prev => prev.filter(t => t !== tile));
      setTurn('player');
    }
  }, [board, boardEnds, sounds]);

  const drawTile = useCallback((playerType) => {
    if (boneyard.length === 0) {
      setTurn(playerType === 'player' ? 'ai' : 'player');
      return;
    }

    const tile = boneyard[0];
    setBoneyard(prev => prev.slice(1));
    
    if (playerType === 'player') {
      setPlayerHand(prev => [...prev, tile]);
    } else {
      setAiHand(prev => [...prev, tile]);
    }
  }, [boneyard]);

  useEffect(() => {
    if (turn === 'ai' && !gameOver) {
      const timer = setTimeout(() => {
        const validMoves = getValidMoves(aiHand, boardEnds);
        
        if (validMoves.length > 0) {
          const bestMove = getLocalAIMove(aiHand, boardEnds);
          if (bestMove) {
            playTile(bestMove.tile, 'ai', bestMove.end);
          } else {
            drawTile('ai');
          }
        } else {
          drawTile('ai');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [turn, gameOver, aiHand, boardEnds, getValidMoves, playTile, drawTile]);

  useEffect(() => {
    if (!gameOver) checkGameOver();
  }, [playerHand, aiHand, boneyard, gameOver, checkGameOver]);

  const handlePlayerMove = (tile) => {
    if (turn !== 'player' || gameOver) return;
    let endChoice = null;
    if (boardEnds.length > 0 && tile.includes(boardEnds[0]) && tile.includes(boardEnds[1]) && boardEnds[0] !== boardEnds[1]) {
      endChoice = 0; 
    }
    playTile(tile, 'player', endChoice);
  };

  const handlePlayerDraw = () => {
    if (turn !== 'player' || gameOver) return;
    const validMoves = getValidMoves(playerHand, boardEnds);
    if (validMoves.length > 0) {
      toast.warning("You have playable tiles!");
      return;
    }
    drawTile('player');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Playing Dominoes | NICOLENIUM</title></Helmet>
      
      <header className="bg-card border-b border-border p-4 flex justify-between items-center">
        <Button variant="ghost" size="sm" onClick={() => navigate('/domino-setup')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Quit
        </Button>
        <div className="font-bold font-serif text-xl">Dominoes</div>
        <div className="text-sm font-medium text-muted-foreground">
          Boneyard: {boneyard.length}
        </div>
      </header>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-secondary/10">
        
        <div className="p-4 flex justify-center items-center gap-4 min-h-[80px]">
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm border border-border">
            <Bot className="w-5 h-5 text-primary" />
            <span className="font-bold">AI ({difficulty})</span>
            <span className="ml-2 text-muted-foreground text-sm">{aiHand.length} tiles</span>
          </div>
          {turn === 'ai' && !gameOver && <span className="animate-pulse text-primary text-sm font-bold">Thinking...</span>}
        </div>

        <div className="flex-1 flex items-center justify-center p-4 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max p-8 bg-card/50 rounded-3xl border border-border shadow-inner">
            {board.length === 0 ? (
              <div className="text-muted-foreground font-medium">Board is empty. Play a tile to start.</div>
            ) : (
              board.map((tile, idx) => (
                <DominoTile key={idx} tile={tile} horizontal={true} />
              ))
            )}
          </div>
        </div>

        <div className="p-6 bg-card border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-center mb-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <span className="font-bold">Your Hand</span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handlePlayerDraw}
                disabled={turn !== 'player' || gameOver || getValidMoves(playerHand, boardEnds).length > 0}
              >
                Draw Tile
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto min-h-[120px]">
            {playerHand.map((tile, idx) => {
              const isPlayable = turn === 'player' && !gameOver && (boardEnds.length === 0 || tile.includes(boardEnds[0]) || tile.includes(boardEnds[1]));
              return (
                <DominoTile 
                  key={idx} 
                  tile={tile} 
                  isPlayable={isPlayable}
                  onClick={handlePlayerMove}
                />
              );
            })}
          </div>
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card p-8 rounded-3xl shadow-2xl border border-border text-center max-w-md w-full animate-in zoom-in-95">
              <Trophy className={`w-16 h-16 mx-auto mb-4 ${winner === 'player' ? 'text-yellow-500' : 'text-muted-foreground'}`} />
              <h2 className="text-3xl font-black font-serif mb-2">
                {winner === 'player' ? 'You Won!' : winner === 'ai' ? 'AI Won' : 'Draw!'}
              </h2>
              <p className="text-muted-foreground mb-8">
                {winner === 'player' ? 'Great strategy!' : 'Better luck next time.'}
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate('/domino-setup')}>Exit</Button>
                <Button onClick={() => window.location.reload()} className="bg-primary text-primary-foreground">
                  <RotateCcw className="w-4 h-4 mr-2" /> Play Again
                </Button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
