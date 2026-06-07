import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UnifiedGameLayout } from '@/components/UnifiedGameLayout.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Trophy, RotateCcw, Loader2 } from 'lucide-react';
import { useGameSession } from '@/hooks/useGameSession.js';
import GameAnimationOverlay from '@/components/GameAnimationOverlay.jsx';
import CombinedGameSetupModal from '@/components/CombinedGameSetupModal.jsx';
import { GameClockDisplay } from '@/components/GameClockDisplay.jsx';
import { useGameConfig } from '@/contexts/GameConfigContext.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { MoveAnalysisPanel } from '@/components/MoveAnalysisPanel.jsx';
import { toast } from 'sonner';

import { checkWin, isDraw } from '@/utils/TicTacToeLogic.js';
import { calculatePerfectTicTacToeMove } from '@/utils/TicTacToeAIEngine.js';

export default function TicTacToeGamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { gameConfig: contextConfig, setGameConfig } = useGameConfig();
  
  const routerConfig = location.state?.gameConfig;
  const [gameSetupData, setGameSetupData] = useState(() => routerConfig || contextConfig || null);
  
  const urlParams = new URLSearchParams(location.search);
  const urlGameId = urlParams.get('gameId');

  const [showSetupModal, setShowSetupModal] = useState(!gameSetupData && !urlGameId);

  const { initializeSession, recordMove, handleGameOver, moveHistory, loadGameState, saveGameState, isLoading } = useGameSession('tictactoe', gameSetupData);

  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const gameLoadedRef = useRef(false);

  const initialSeconds = useMemo(() => {
    if (!gameSetupData) return 600;
    const tc = gameSetupData.timeLimit ?? gameSetupData.match?.timeControl;
    if (tc === 'unlimited' || tc === 0) return 'unlimited';
    return Number(tc) || 600;
  }, [gameSetupData]);

  const [timeP1, setTimeP1] = useState(initialSeconds);
  const [timeP2, setTimeP2] = useState(initialSeconds);

  useEffect(() => {
    if (urlGameId && !gameLoadedRef.current) {
      gameLoadedRef.current = true;
      loadGameState(urlGameId).then(record => {
        if (record) {
          if (record.gameState && record.gameState.board) {
            setBoard(record.gameState.board);
            setIsXNext(record.gameState.isXNext);
            setIsPlaying(record.status === 'in_progress' || record.status === 'active');
            setIsGameOver(record.status === 'completed' || record.status === 'abandoned');
          }
          if (record.player1Time !== undefined) setTimeP1(record.player1Time);
          if (record.player2Time !== undefined) setTimeP2(record.player2Time);
          setShowSetupModal(false);
        }
      });
    } else if (gameSetupData && !isPlaying && !isGameOver && !showSetupModal) {
      handleGameStart(gameSetupData);
    }
  }, [urlGameId]);

  const handleGameStart = (config) => {
    setGameConfig(config);
    setGameSetupData(config);
    setShowSetupModal(false);
    initializeSession(config);
    resetGame(config);
  };

  const handleCloseModal = () => navigate('/games');

  const resetGame = (config = gameSetupData) => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
    setIsPlaying(true);
    setIsGameOver(false);
    setAiAnalysis(null);

    const tc = config?.timeLimit ?? config?.match?.timeControl;
    const newTime = tc === 'unlimited' || tc === 0 ? 'unlimited' : (Number(tc) || 600);
    setTimeP1(newTime);
    setTimeP2(newTime);
  };

  const handleTimeExpired = () => {
    if (winner || isGameOver) return;
    const timedOutPlayer = isXNext ? 'X' : 'O';
    const winnerChar = isXNext ? 'O' : 'X';
    setWinner(winnerChar);
    setIsPlaying(false);
    setIsGameOver(true);
    handleGameOver('loss', 0);
    toast.error(`Player ${timedOutPlayer} ran out of time!`);
  };

  useEffect(() => {
    if (!isPlaying || isGameOver || !gameSetupData || gameSetupData.mode !== 'human_vs_computer') return;

    const isPlayerTurn = isXNext;
    if (!isPlayerTurn) {
      const timer = setTimeout(async () => {
        const aiResponse = await calculatePerfectTicTacToeMove(board, 'O', gameSetupData.difficulty);
        if (aiResponse && aiResponse.move !== null) {
          handleCellClick(aiResponse.move, true);
          setAiAnalysis(aiResponse);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [board, isXNext, isPlaying, isGameOver, gameSetupData]);

  const handleCellClick = (index, isAi = false) => {
    if (board[index] || winner || isGameOver || (!isXNext && !isAi && gameSetupData?.mode === 'human_vs_computer')) return;

    const newBoard = [...board];
    const currentPlayer = isXNext ? 'X' : 'O';
    newBoard[index] = currentPlayer;
    
    setBoard(newBoard);
    
    const row = Math.floor(index / 3);
    const col = index % 3;
    recordMove(`Player ${currentPlayer} moved to (${row}, ${col})`);

    const winResult = checkWin(newBoard, true);
    
    saveGameState({
      gameState: { board: newBoard, isXNext: !isXNext },
      currentTurn: !isXNext ? 'X' : 'O',
      player1Time: timeP1,
      player2Time: timeP2,
      status: winResult || isDraw(newBoard) ? 'completed' : 'active'
    });

    if (winResult) {
      setWinner(winResult.winner);
      setWinningLine(winResult.line);
      setIsPlaying(false);
      setIsGameOver(true);
      handleGameOver(currentPlayer === 'X' ? 'win' : 'loss', 100);
      toast.success(`Player ${currentPlayer} wins!`);
    } else if (isDraw(newBoard)) {
      setWinner('Draw');
      setIsPlaying(false);
      setIsGameOver(true);
      handleGameOver('draw', 50);
      toast.info("It's a draw!");
    } else {
      setIsXNext(!isXNext);
    }
  };

  const renderSquare = (i) => {
    const isWinningSquare = winningLine?.includes(i);
    const val = board[i];
    
    return (
      <Button
        variant="outline"
        className={`h-24 w-24 sm:h-32 sm:w-32 text-5xl sm:text-7xl font-black rounded-xl transition-all duration-300
          ${val === 'X' ? 'text-blue-500' : 'text-rose-500'}
          ${isWinningSquare ? 'bg-emerald-500 text-white shadow-glow-primary scale-105 z-10 border-emerald-500' : 'bg-card hover:bg-muted'}
          ${!val && !winner && (isXNext || gameSetupData?.mode !== 'human_vs_computer') ? 'hover:scale-105 active:scale-95' : ''}
        `}
        onClick={() => handleCellClick(i)}
        disabled={val || winner || (!isXNext && gameSetupData?.mode === 'human_vs_computer')}
      >
        {val && (
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            {val}
          </motion.div>
        )}
      </Button>
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Restoring game state...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Tic Tac Toe | NICOLENIUM</title></Helmet>
      
      <CombinedGameSetupModal 
        isOpen={showSetupModal} 
        gameType="tictactoe"
        game={{ name: "Tic Tac Toe", id: "tictactoe" }}
        onGameStart={handleGameStart} 
        onClose={handleCloseModal} 
      />

      {!showSetupModal && gameSetupData && (
        <UnifiedGameLayout 
          title="Tic Tac Toe" 
          turnText={winner ? (winner === 'Draw' ? "It's a Draw!" : `Player ${winner} Wins!`) : `Player ${isXNext ? 'X' : 'O'}'s Turn`} 
          onReset={() => resetGame()} 
          history={moveHistory} 
          gameType="tictactoe"
          onResign={() => { setIsGameOver(true); handleGameOver('loss', 0); }}
        >
          <div className="w-full flex flex-col items-center justify-center py-8">
            <GameAnimationOverlay gameStatus={isGameOver ? (winner === 'Draw' ? 'draw' : (winner === 'X' ? 'won' : 'loss')) : 'in-progress'}>
              {isGameOver && (
                <Card className="w-full max-w-md mx-auto mb-8 border-2 border-primary/20 shadow-xl bg-card">
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <Trophy className={`w-16 h-16 mb-4 ${winner === 'X' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">
                      {winner === 'Draw' ? 'Draw!' : `Player ${winner} Wins!`}
                    </h2>
                    <p className="text-muted-foreground font-medium mb-6">Great game! Ready for a rematch?</p>
                    <div className="flex gap-4">
                      <Button onClick={() => resetGame()} className="font-bold px-8 h-12 rounded-full shadow-glow-primary">
                        <RotateCcw className="w-4 h-4 mr-2" /> Play Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full max-w-5xl mx-auto px-4">
                <div className="w-full flex flex-col items-center relative">
                  <div className="w-full max-w-[70vh] mb-6 flex justify-between gap-4 mx-auto">
                    <GameClockDisplay 
                      playerName={gameSetupData?.players?.p1Name || 'Player 1 (X)'} 
                      totalTimeSeconds={initialSeconds} 
                      timeRemainingSeconds={timeP1} 
                      isActive={isXNext && isPlaying && !isGameOver} 
                      onTimeExpired={handleTimeExpired} 
                    />
                    <GameClockDisplay 
                      playerName={gameSetupData?.players?.p2Name || 'Player 2 (O)'} 
                      totalTimeSeconds={initialSeconds} 
                      timeRemainingSeconds={timeP2} 
                      isActive={!isXNext && isPlaying && !isGameOver} 
                      onTimeExpired={handleTimeExpired} 
                    />
                  </div>

                  <div className="bg-card p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-border mx-auto shrink-0 relative">
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 relative z-10">
                      {board.map((_, i) => <React.Fragment key={i}>{renderSquare(i)}</React.Fragment>)}
                    </div>
                    <div className="absolute inset-x-8 top-1/3 h-2 bg-border rounded-full -translate-y-1 z-0 hidden sm:block opacity-50"></div>
                    <div className="absolute inset-x-8 top-2/3 h-2 bg-border rounded-full -translate-y-1 z-0 hidden sm:block opacity-50"></div>
                    <div className="absolute inset-y-8 left-1/3 w-2 bg-border rounded-full -translate-x-1 z-0 hidden sm:block opacity-50"></div>
                    <div className="absolute inset-y-8 left-2/3 w-2 bg-border rounded-full -translate-x-1 z-0 hidden sm:block opacity-50"></div>
                  </div>
                </div>

                {gameSetupData.mode === 'human_vs_computer' && aiAnalysis && (
                  <div className="w-full lg:w-96 shrink-0 mt-8 lg:mt-0">
                    <MoveAnalysisPanel analysis={aiAnalysis} />
                  </div>
                )}
                
              </div>
            </GameAnimationOverlay>
          </div>
        </UnifiedGameLayout>
      )}
    </>
  );
}