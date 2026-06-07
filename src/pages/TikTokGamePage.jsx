
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UnifiedGameLayout } from '@/components/UnifiedGameLayout.jsx';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { cn } from '@/lib/utils.js';
import { useGameSession } from '@/hooks/useGameSession.js';

const defaultSettings = {
  mode: 'human_vs_ai',
  difficulty: 'medium',
  timeControl: 'unlimited',
  p1Name: 'Player 1',
  p2Name: 'AI Bot'
};

// Local AI logic to ensure it works perfectly
const getAIMove = (board, difficulty) => {
  const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
  if (emptyIndices.length === 0) return null;

  if (difficulty === 'easy') {
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  // Simple Minimax for Hard, random block/win for Medium
  const checkWin = (b, player) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let [x,y,z] of lines) {
      if (b[x] === player && b[y] === player && b[z] === player) return true;
    }
    return false;
  };

  // Check for immediate win
  for (let i of emptyIndices) {
    const b = [...board];
    b[i] = 'O';
    if (checkWin(b, 'O')) return i;
  }

  // Check for immediate block
  for (let i of emptyIndices) {
    const b = [...board];
    b[i] = 'X';
    if (checkWin(b, 'X')) return i;
  }

  if (difficulty === 'medium') {
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  // Hard: Take center if available
  if (board[4] === null) return 4;

  // Hard: Take corners
  const corners = [0, 2, 6, 8].filter(i => board[i] === null);
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
};

export default function TikTokGamePage() {
  const location = useLocation();
  const settings = location.state?.settings || defaultSettings;
  
  const { initializeSession, recordMove, moveHistory, handleGameOver } = useGameSession('tiktaktok', settings);

  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState('X');
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    initializeSession(settings);
  }, [initializeSession, settings]);

  const checkWinDetails = (squares) => {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    return null;
  };

  const applyMove = (i, player) => {
    const newBoard = [...board];
    newBoard[i] = player;
    setBoard(newBoard);
    
    const pName = player === 'X' ? settings.p1Name : settings.p2Name;
    const moveNum = moveHistory.length + 1;
    const winDetails = checkWinDetails(newBoard);

    if (winDetails) {
      recordMove(`plays at position ${i + 1}`, 0, { player: pName, moveNumber: moveNum });
      recordMove(`wins with positions ${winDetails.line.map(x=>x+1).join('-')}`, 0, { player: 'System', moveNumber: moveNum + 1 });
      setWinner(winDetails.winner);
      handleGameOver('win');
    } else if (!newBoard.includes(null)) {
      recordMove(`plays at position ${i + 1}`, 0, { player: pName, moveNumber: moveNum });
      recordMove(`Draw - board full`, 0, { player: 'System', moveNumber: moveNum + 1 });
      setWinner('draw');
      handleGameOver('draw');
    } else {
      recordMove(`plays at position ${i + 1}`, 0, { player: pName, moveNumber: moveNum });
      setTurn(player === 'X' ? 'O' : 'X');
    }
  };

  useEffect(() => {
    let isMounted = true;
    const runAI = () => {
      if (settings.mode === 'human_vs_ai' && turn === 'O' && !winner) {
        setTimeout(() => {
          if (!isMounted) return;
          const move = getAIMove(board, settings.difficulty);
          if (move !== null) applyMove(move, 'O');
        }, 600);
      }
    };
    runAI();
    return () => { isMounted = false; };
  }, [turn, board, winner, settings.mode, settings.difficulty]);

  const handleClick = (i) => {
    if (board[i] || winner) return;
    if (settings.mode === 'human_vs_ai' && turn === 'O') return;
    applyMove(i, turn);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn('X');
    setWinner(null);
    initializeSession(settings);
  };

  const handleResign = () => {
    setWinner(turn === 'X' ? 'O' : 'X');
    handleGameOver('resign');
    toast.info("Resigned");
  };

  let turnText = turn === 'X' ? `${settings.p1Name}'S TURN (X)` : `${settings.p2Name}'S TURN (O)`;
  if (winner === 'draw') turnText = "DRAW!";
  else if (winner) turnText = `${winner === 'X' ? settings.p1Name : settings.p2Name} WINS!`;

  return (
    <>
      <Helmet><title>TikTakTok | NICOLENIUM</title></Helmet>
      <UnifiedGameLayout 
        title="TikTakTok" 
        turnText={turnText} 
        history={moveHistory} 
        onReset={resetGame}
        onResign={handleResign}
        canUndo={false}
      >
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-[50vh] aspect-square bg-muted rounded-3xl border-[12px] border-secondary p-4 shadow-2xl">
            <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full">
              {board.map((cell, i) => (
                <button
                  key={i}
                  className={cn(
                    "bg-background rounded-xl text-6xl sm:text-8xl font-black flex items-center justify-center transition-colors shadow-inner",
                    !cell && !winner && "hover:bg-white/5 cursor-pointer",
                    cell === 'X' && "text-primary",
                    cell === 'O' && "text-blue-500"
                  )}
                  onClick={() => handleClick(i)}
                  disabled={!!cell || !!winner}
                >
                  {cell}
                </button>
              ))}
            </div>
          </div>
        </div>
      </UnifiedGameLayout>
    </>
  );
}
