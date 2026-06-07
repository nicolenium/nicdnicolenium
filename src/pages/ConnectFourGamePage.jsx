
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UnifiedGameLayout } from '@/components/UnifiedGameLayout.jsx';
import { Helmet } from 'react-helmet';
import { cn } from '@/lib/utils.js';
import { GameClockDisplay } from '@/components/GameClockDisplay.jsx';
import { toast } from 'sonner';
import { useGameSession } from '@/hooks/useGameSession.js';
import CombinedGameSetupModal from '@/components/CombinedGameSetupModal.jsx';
import { useGameConfig } from '@/contexts/GameConfigContext.jsx';
import { AIResponseManager } from '@/utils/AIResponseManager.js';
import { Loader2 } from 'lucide-react';

import { createInitialConnectFourBoard, dropPiece, checkConnectFourWin, isConnectFourDraw, getValidColumns } from '@/utils/ConnectFourLogic.js';
import { getBestMove } from '@/utils/ConnectFourAIEngine.js';

export default function ConnectFourGamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { gameConfig: contextConfig, setGameConfig } = useGameConfig();
  
  const routerConfig = location.state?.gameConfig;
  const [gameSetupData, setGameSetupData] = useState(() => routerConfig || contextConfig || null);
  
  const urlParams = new URLSearchParams(location.search);
  const urlGameId = urlParams.get('gameId');

  const [showSetupModal, setShowSetupModal] = useState(!gameSetupData && !urlGameId);

  const { initializeSession, recordMove, moveHistory, handleGameOver, loadGameState, saveGameState, isLoading } = useGameSession('connect_four', gameSetupData);

  const isOnline = gameSetupData?.mode === 'multiplayer';

  const initialSeconds = useMemo(() => {
    if (!gameSetupData) return 600;
    const tc = gameSetupData.timeLimit ?? gameSetupData.match?.timeControl;
    if (tc === 'unlimited' || tc === 0) return 'unlimited';
    return Number(tc) || 600;
  }, [gameSetupData]);

  const [board, setBoard] = useState(createInitialConnectFourBoard());
  const [boardHistory, setBoardHistory] = useState([{ board: createInitialConnectFourBoard(), turn: 1 }]);
  const [turn, setTurn] = useState(1);
  const [winner, setWinner] = useState(null);
  const isProcessingRef = useRef(false);
  const gameLoadedRef = useRef(false);

  const [timeP1, setTimeP1] = useState(initialSeconds);
  const [timeP2, setTimeP2] = useState(initialSeconds);

  useEffect(() => {
    if (urlGameId && !gameLoadedRef.current) {
      gameLoadedRef.current = true;
      loadGameState(urlGameId).then(record => {
        if (record) {
          if (record.gameState && record.gameState.board) {
            setBoard(record.gameState.board);
            setTurn(record.gameState.turn);
            setBoardHistory([{ board: record.gameState.board, turn: record.gameState.turn }]);
          }
          if (record.player1Time !== undefined) setTimeP1(record.player1Time);
          if (record.player2Time !== undefined) setTimeP2(record.player2Time);
          setShowSetupModal(false);
        }
      });
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

  const applyMove = (c) => {
    const { newBoard, row } = dropPiece(board, c, turn);
    if (row !== -1) {
      setBoard(newBoard);
      const notation = `Played column ${c + 1}`;
      
      recordMove(notation, 0, {
        player: turn === 1 ? 'Player 1' : 'Player 2',
        forceSync: true
      });

      let newWinner = winner;
      let newTurn = turn;

      if (checkConnectFourWin(newBoard, row, c, turn)) {
        newWinner = turn;
        setWinner(newWinner);
        handleGameOver('win', 0);
      }
      else if (isConnectFourDraw(newBoard)) {
        newWinner = 'draw';
        setWinner(newWinner);
        handleGameOver('draw', 0);
      }
      else {
        newTurn = turn === 1 ? 2 : 1;
        setTurn(newTurn);
        setBoardHistory(prev => [...prev, { board: newBoard, turn: newTurn }]);
      }

      saveGameState({
        gameState: { board: newBoard, turn: newTurn },
        currentTurn: newTurn,
        player1Time: timeP1,
        player2Time: timeP2,
        status: newWinner ? 'completed' : 'active'
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (showSetupModal || winner !== null || isProcessingRef.current || isOnline) return;
    
    if (gameSetupData?.mode === 'human_vs_computer' && turn === 2) {
      isProcessingRef.current = true;
      
      AIResponseManager.executeAITurn({
        gameType: 'connect_four',
        gameState: board,
        player: 2,
        difficulty: gameSetupData?.difficulty,
        calculateMoveFn: async (b, p, diff) => {
          const res = await getBestMove(b, diff, 1500, p);
          return res?.move;
        },
        applyMoveFn: (col) => {
          if (isMounted) applyMove(col);
        },
        fallbackMoveFn: (b) => {
           for (let c=0; c<7; c++) {
             if (b[0][c] === null) return c;
           }
           return null;
        }
      }).finally(() => {
        if (isMounted) isProcessingRef.current = false;
      });
    }
    
    return () => { isMounted = false; };
  }, [turn, board, gameSetupData, winner, isOnline, showSetupModal]);

  const handleTimeExpired = () => {
    if (winner) return;
    setWinner(turn === 1 ? 2 : 1);
    handleGameOver('timeout', 0);
    toast.error(`Player ${turn} ran out of time!`);
  };

  const handleColClick = (c) => {
    if (showSetupModal || winner !== null || isProcessingRef.current) return;
    if (gameSetupData?.mode === 'human_vs_computer' && turn === 2) return;
    
    if (board[0][c] === null) {
      applyMove(c);
    }
  };

  const handleUndo = () => {
    if (boardHistory.length > 1) {
      const stepBack = gameSetupData?.mode === 'human_vs_computer' ? 2 : 1;
      if (boardHistory.length > stepBack) {
        const newHistoryStack = boardHistory.slice(0, -stepBack);
        const previousState = newHistoryStack[newHistoryStack.length - 1];
        setBoardHistory(newHistoryStack);
        setBoard(previousState.board);
        setTurn(previousState.turn);
        setWinner(null);
        
        saveGameState({
          gameState: { board: previousState.board, turn: previousState.turn },
          currentTurn: previousState.turn,
          player1Time: timeP1,
          player2Time: timeP2
        });
      }
    }
  };

  const handleResign = () => {
    setWinner(turn === 1 ? 2 : 1);
    handleGameOver('resign', 0);
    toast.info("You have resigned.");
  };

  const resetGame = (config = gameSetupData) => {
    const initBoard = createInitialConnectFourBoard();
    setBoard(initBoard);
    setBoardHistory([{ board: initBoard, turn: 1 }]);
    setTurn(1);
    setWinner(null);
    const tc = config?.timeLimit ?? config?.match?.timeControl;
    const newTime = tc === 'unlimited' || tc === 0 ? 'unlimited' : (Number(tc) || 600);
    setTimeP1(newTime);
    setTimeP2(newTime);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Restoring game state...</p>
      </div>
    );
  }

  let turnText = turn === 1 ? `${gameSetupData?.playerName || 'Player 1'}'S TURN` : `${gameSetupData?.opponentName || 'AI'}'S TURN`;
  if (winner === 'draw') turnText = "DRAW!";
  else if (winner) turnText = `${winner === 1 ? (gameSetupData?.playerName || 'Player 1') : (gameSetupData?.opponentName || 'AI')} WINS!`;

  return (
    <>
      <Helmet><title>Connect Four | NICOLENIUM</title></Helmet>
      
      <CombinedGameSetupModal 
        isOpen={showSetupModal} 
        gameType="connect_four"
        onGameStart={handleGameStart} 
        onClose={handleCloseModal} 
      />

      {!showSetupModal && gameSetupData && (
        <UnifiedGameLayout 
          title="Connect Four" 
          turnText={turnText} 
          history={moveHistory} 
          onReset={() => { resetGame(); }}
          isOnline={isOnline}
          onUndo={handleUndo}
          onResign={handleResign}
          canUndo={!isOnline && boardHistory.length > 1 && winner === null}
          gameType="connect_four"
        >
          <div className="w-full flex flex-col items-center relative">
            <div className="w-full max-w-[70vh] mb-6 flex justify-between gap-4">
              <GameClockDisplay 
                playerName={gameSetupData?.playerName || 'Player 1'} totalTimeSeconds={initialSeconds} timeRemainingSeconds={timeP1} 
                isActive={turn === 1 && !winner} onTimeExpired={handleTimeExpired} 
              />
              <GameClockDisplay 
                playerName={gameSetupData?.opponentName || 'AI'} totalTimeSeconds={initialSeconds} timeRemainingSeconds={timeP2} 
                isActive={turn === 2 && !winner} onTimeExpired={handleTimeExpired} 
              />
            </div>

            <div className="w-full aspect-[7/6] bg-blue-600 rounded-3xl border-[12px] sm:border-[16px] border-blue-800 p-2 sm:p-4 shadow-2xl relative max-w-[70vh]">
              <div className="absolute inset-0 grid grid-cols-7 z-20">
                {Array(7).fill(null).map((_, c) => (
                  <div key={c} className="h-full cursor-pointer hover:bg-white/10 rounded-full transition-colors" onClick={() => handleColClick(c)} />
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2 sm:gap-4 h-full relative z-10 pointer-events-none">
                {board.map((row, r) => 
                  row.map((cell, c) => (
                    <div key={`${r}-${c}`} className="relative aspect-square flex items-center justify-center">
                      <div className="w-[85%] h-[85%] rounded-full bg-background shadow-inner absolute" />
                      {cell !== null && (
                        <div className={cn("w-[85%] h-[85%] rounded-full shadow-md border-4 border-black/10 absolute transition-all duration-300", cell === 1 ? "bg-red-500" : "bg-yellow-400")} />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </UnifiedGameLayout>
      )}
    </>
  );
}
