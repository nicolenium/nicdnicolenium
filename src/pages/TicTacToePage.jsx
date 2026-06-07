
import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import FullScreenGameLayout from '@/components/FullScreenGameLayout.jsx';
import BrandedGameHeader from '@/components/BrandedGameHeader.jsx';
import BrandedGameOverScreen from '@/components/BrandedGameOverScreen.jsx';
import MoveTracker from '@/components/MoveTracker.jsx';
import PrivacyIndicator from '@/components/PrivacyIndicator.jsx';
import PrivacySettingsModal from '@/components/PrivacySettingsModal.jsx';
import GameModeSelector from '@/components/GameModeSelector.jsx';
import SocialMediaLinks from '@/components/SocialMediaLinks.jsx';
import InviteButton from '@/components/InviteButton.jsx';
import JoinButton from '@/components/JoinButton.jsx';
import BrandingWatermark from '@/components/BrandingWatermark.jsx';
import { useGamePrivacy } from '@/hooks/useGamePrivacy.js';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient';
import { AIEngine } from '@/utils/AIEngine.js';

const GAME_SESSION_ID = 'local-tictactoe-session';

const TicTacToePage = () => {
  const { privacySetting, updatePrivacy } = useGamePrivacy(GAME_SESSION_ID);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [gameMode, setGameMode] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const inviteId = localStorage.getItem('nicd_tictactoe_invite_match');
    if (inviteId) {
      setGameMode('human_vs_human');
      localStorage.removeItem('nicd_tictactoe_invite_match');
    }
  }, []);

  const calculateWinner = (squares) => {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  const saveSessionToDB = useCallback(async (finalWinner) => {
    try {
      if (pb.authStore.isValid && pb.authStore.model?.collectionName === 'users') {
        await pb.collection('game_sessions').create({
          gameType: 'tic_tac_toe',
          userId: pb.authStore.model.id,
          score: finalWinner === 'X' ? 100 : 0,
          gameStatus: 'completed',
          moveHistory: moveHistory,
          mode: gameMode,
          aiDifficulty: difficulty
        }, { $autoCancel: false });
      }
    } catch (err) {
      console.error("Failed saving session:", err);
    }
  }, [moveHistory, gameMode, difficulty]);

  const executeMove = useCallback((i) => {
    if (board[i] || winner || gameOver) return;

    const newBoard = [...board];
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    
    const row = Math.floor(i / 3);
    const col = i % 3;
    setMoveHistory(prev => [...prev, { notation: `${xIsNext ? 'X' : 'O'} to (${row},${col})` }]);

    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      setGameOver(true);
      saveSessionToDB(newWinner);
    } else if (!newBoard.includes(null)) {
      setGameOver(true);
      saveSessionToDB('Draw');
    } else {
      setXIsNext(!xIsNext);
    }
  }, [board, winner, gameOver, xIsNext, saveSessionToDB]);

  useEffect(() => {
    if (gameMode === 'human_vs_computer' && !xIsNext && !gameOver) {
      const timer = setTimeout(() => {
        const aiMove = AIEngine.getTicTacToeMove(board, difficulty);
        if (aiMove !== null) executeMove(aiMove);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameMode, xIsNext, gameOver, board, difficulty, executeMove]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setGameOver(false);
    setMoveHistory([]);
  };

  const rightPanel = (
    <div className="space-y-4 h-full flex flex-col">
      <div className="bg-card border border-white/5 rounded-xl p-3 flex items-center justify-between shadow-sm">
        <PrivacyIndicator privacyLevel={privacySetting} />
        <Button variant="ghost" size="sm" onClick={() => setShowPrivacyModal(true)} className="h-7 px-3 rounded-lg text-xs font-bold uppercase">Change</Button>
      </div>
      {gameMode && (
        <div className="p-6 bg-card border border-white/5 rounded-xl text-center shadow-lg">
          <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">
            {gameMode === 'human_vs_computer' ? `Vs AI (${difficulty})` : '2 Players'}
          </p>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.2em] mt-6">Current Turn</p>
          <p className={`text-6xl font-black mt-4 drop-shadow-md ${xIsNext ? 'text-blue-500' : 'text-red-500'}`}>
            {gameOver ? (winner ? `${winner} Wins!` : 'Draw') : (xIsNext ? 'X' : 'O')}
          </p>
        </div>
      )}
      <div className="flex-1">
        <MoveTracker moves={moveHistory} title="Match Log" />
      </div>
      <div className="pt-4 border-t border-white/5 shrink-0 text-center">
        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-3 tracking-widest">Share & Follow</p>
        <SocialMediaLinks layout="horizontal" size="sm" className="justify-center" />
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>NICD Tic Tac Toe | Nicolenium Premium</title></Helmet>
      <FullScreenGameLayout title={<BrandedGameHeader gameTitle="NICD Tic Tac Toe" />} mode="Classic" onExit={() => setGameMode(null)} rightPanelContent={rightPanel}>
        <div className="w-full h-full flex items-center justify-center p-4 relative">
          <BrandingWatermark position="bottom-left" />
          
          {!gameMode ? (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="w-full flex justify-end gap-3 mb-6 px-4">
                <JoinButton gameType="tic_tac_toe" />
                <InviteButton gameType="tic_tac_toe" />
              </div>
              <GameModeSelector onStart={(mode, diff) => { setGameMode(mode); setDifficulty(diff); resetGame(); }} />
            </div>
          ) : (
            <div className="w-full max-w-[60vh] aspect-square bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10">
              {gameOver ? (
                <BrandedGameOverScreen gameType="NICD Tic Tac Toe" score={winner ? 100 : 0} onReplay={resetGame} />
              ) : (
                <div className="grid grid-cols-3 grid-rows-3 gap-3 sm:gap-5 h-full w-full">
                  {board.map((square, i) => (
                    <button
                      key={i}
                      onClick={() => executeMove(i)}
                      disabled={gameMode === 'human_vs_computer' && !xIsNext}
                      className={`bg-card shadow-inner rounded-2xl text-7xl sm:text-9xl font-black flex items-center justify-center transition-all duration-300 border-4 border-transparent hover:border-primary/50 focus:border-primary focus:outline-none ${square === 'X' ? 'text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]' : square === 'O' ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'hover:bg-card/80'}`}
                    >
                      {square}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </FullScreenGameLayout>
      <PrivacySettingsModal open={showPrivacyModal} onOpenChange={setShowPrivacyModal} privacyLevel={privacySetting} onPrivacyChange={updatePrivacy} />
    </>
  );
};

export default TicTacToePage;
