
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UnifiedGameLayout } from '@/components/UnifiedGameLayout.jsx';
import { Helmet } from 'react-helmet';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';

import CheckersBoard10x10 from '@/components/CheckersBoard10x10.jsx';
import CheckersBoard from '@/components/CheckersBoard.jsx';

import { GameClockDisplay } from '@/components/GameClockDisplay.jsx';
import BrandedGameOverScreen from '@/components/BrandedGameOverScreen.jsx';
import GameAnimationOverlay from '@/components/GameAnimationOverlay.jsx';
import { useSoundEffects } from '@/utils/soundManager.js';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { useGameSession } from '@/hooks/useGameSession.js';
import CombinedGameSetupModal from '@/components/CombinedGameSetupModal.jsx';
import { formatDuration } from '@/lib/utils.js';
import { useGameConfig } from '@/contexts/GameConfigContext.jsx';

import { createInitialBoard10x10, getValidMoves10x10, executeMove10x10, checkGameStatus10x10, getSquareNumber10x10 } from '@/utils/CheckersGameLogic10x10.js';
import { calculateBestMove10x10 } from '@/utils/CheckersAI10x10Engine.js';

import { createInitialBoard, getAllValidMoves, executeMove, getGameStatus, getSquareNumber } from '@/utils/CheckersGameLogic.js';
import { calculateBestMove8x8 } from '@/utils/CheckersAI8x8Engine.js';

import { Loader2, BrainCircuit } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckersGamePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { playWin, playLose } = useSoundEffects();
  const { t } = useLanguage();
  const soundPlayedRef = useRef(false);
  const { gameConfig: contextConfig, setGameConfig } = useGameConfig();
  
  const is10x10 = location.pathname.includes('10x10');
  const gameTypeStr = is10x10 ? 'checkers_10x10' : 'checkers_8x8';
  
  const routerConfig = location.state?.gameConfig;
  const [gameSetupData, setGameSetupData] = useState(() => routerConfig || contextConfig || null);
  
  const urlParams = new URLSearchParams(location.search);
  const urlGameId = urlParams.get('gameId');
  
  const [showSetupModal, setShowSetupModal] = useState(!gameSetupData && !urlGameId);

  const { initializeSession, recordMove, moveHistory, handleGameOver, loadGameState, saveGameState, isLoading } = useGameSession(gameTypeStr, gameSetupData);

  const isOnline = gameSetupData?.gameMode === 'online';

  const initialSeconds = useMemo(() => {
    if (!gameSetupData) return 600;
    const tc = gameSetupData.timeLimit ?? gameSetupData.match?.timeControl;
    if (tc === 'unlimited' || tc === 0) return 'unlimited';
    return Number(tc) || 600;
  }, [gameSetupData]);

  const [board, setBoard] = useState(() => {
    try {
      return is10x10 ? createInitialBoard10x10() : createInitialBoard();
    } catch (e) {
      return [];
    }
  });
  
  const [turn, setTurn] = useState(1);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [winner, setWinner] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [restrictedPiece, setRestrictedPiece] = useState(null);
  const [currentTurnNotation, setCurrentTurnNotation] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  
  const [boardHistory, setBoardHistory] = useState([]);
  
  const [timeP1, setTimeP1] = useState(initialSeconds);
  const [timeP2, setTimeP2] = useState(initialSeconds);
  
  const isProcessingRef = useRef(false);
  const gameStartTimeRef = useRef(Date.now());
  const gameLoadedRef = useRef(false);

  useEffect(() => {
    if (urlGameId && !gameLoadedRef.current) {
      gameLoadedRef.current = true;
      loadGameState(urlGameId).then(record => {
        if (record) {
          if (record.gameState && record.gameState.board) {
            setBoard(record.gameState.board);
            setTurn(record.gameState.turn || 1);
            setBoardHistory([{ board: record.gameState.board, turn: record.gameState.turn || 1, lastMove: null }]);
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

  useEffect(() => {
    if (board && board.length > 0 && boardHistory.length === 0) {
      setBoardHistory([{ board, turn: 1, lastMove: null }]);
    }
  }, [board, boardHistory.length]);

  const handleFinalizeTurn = (nextTurn, newBoard, finalNotation, madeKing) => {
    try {
      let completeNotation = finalNotation || '';
      if (madeKing) completeNotation += ' (King)';
      
      setBoardHistory(prev => [...prev, { board: newBoard, turn: nextTurn, lastMove }]);
      
      setCurrentTurnNotation('');
      setTurn(nextTurn);
      setSelectedSquare(null);
      setValidMoves([]);
      setRestrictedPiece(null);

      const statusObj = is10x10 ? checkGameStatus10x10(newBoard, nextTurn) : getGameStatus(newBoard, nextTurn);
      
      recordMove(completeNotation, 0, {
        player: turn === 1 ? 'Player 1' : 'Player 2',
        forceSync: true
      });

      saveGameState({
        gameState: { board: newBoard, turn: nextTurn },
        currentTurn: nextTurn,
        player1Time: timeP1,
        player2Time: timeP2
      });

      if (statusObj?.status === 'won' || (statusObj?.status !== 'in_progress' && !is10x10)) {
        setWinner(statusObj.winner || 'draw');
        handleGameOver(statusObj.winner ? 'win' : 'draw', 0);
      }
    } catch (e) {
      console.error("Error finalizing turn:", e);
    }
  };

  const applyMove10x10 = (move) => {
    try {
      const { newBoard, capturedPieces, madeKing } = executeMove10x10(board, move);
      setBoard(newBoard);
      setLastMove(move);
      
      const isCapture = capturedPieces.length > 0;
      const fromSq = getSquareNumber10x10(move.from.r, move.from.c);
      const toSq = getSquareNumber10x10(move.to.r, move.to.c);
      
      let notationChunk = isCapture ? `x${toSq}` : `-${toSq}`;
      if (!currentTurnNotation) notationChunk = `${fromSq}${notationChunk}`;
      const nextNotation = currentTurnNotation + notationChunk;
      setCurrentTurnNotation(nextNotation);

      let multiJumpPossible = false;
      if (isCapture) {
        const jumps = getValidMoves10x10(newBoard, turn, { r: move.to.r, c: move.to.c })
                       .filter(m => m.captured && m.captured.length > 0);
        if (jumps.length > 0) {
          multiJumpPossible = true;
          setValidMoves(jumps);
          setSelectedSquare({ r: move.to.r, c: move.to.c });
          setRestrictedPiece({ r: move.to.r, c: move.to.c });
        }
      }

      if (!multiJumpPossible) {
        handleFinalizeTurn(turn === 1 ? 2 : 1, newBoard, nextNotation, madeKing);
      }
    } catch (e) {
      console.error("Error executing 10x10 move:", e);
    }
  };

  const applyMove8x8 = (moveWrapper) => {
    try {
      const { newBoard, capturedPieces, madeKing } = executeMove(board, moveWrapper.from, moveWrapper.move, turn);
      setBoard(newBoard);
      setLastMove({ from: moveWrapper.from, to: {r: moveWrapper.move.toR, c: moveWrapper.move.toC} });
      
      const isCapture = moveWrapper.move.isCapture;
      const fromSq = getSquareNumber(moveWrapper.from.r, moveWrapper.from.c);
      const toSq = getSquareNumber(moveWrapper.move.toR, moveWrapper.move.toC);
      
      let notationChunk = isCapture ? `x${toSq}` : `-${toSq}`;
      if (!currentTurnNotation) notationChunk = `${fromSq}${notationChunk}`;
      const nextNotation = currentTurnNotation + notationChunk;
      setCurrentTurnNotation(nextNotation);

      let multiJumpPossible = false;
      if (isCapture && !madeKing) {
        const jumps = getAllValidMoves(newBoard, turn).get(`${moveWrapper.move.toR},${moveWrapper.move.toC}`) || [];
        const captureJumps = jumps.filter(j => j.isCapture);
        if (captureJumps.length > 0) {
          multiJumpPossible = true;
          setValidMoves(captureJumps);
          setSelectedSquare({ r: moveWrapper.move.toR, c: moveWrapper.move.toC });
          setRestrictedPiece({ r: moveWrapper.move.toR, c: moveWrapper.move.toC });
        }
      }

      if (!multiJumpPossible) {
        handleFinalizeTurn(turn === 1 ? 2 : 1, newBoard, nextNotation, madeKing);
      }
    } catch (e) {
      console.error("Error executing 8x8 move:", e);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (showSetupModal || winner !== null || isPaused || isProcessingRef.current || isOnline || !board || board.length === 0) return;
    
    if (gameSetupData?.mode === 'human_vs_computer' && turn === 2) {
      isProcessingRef.current = true;
      
      const calculateFn = is10x10 ? calculateBestMove10x10 : calculateBestMove8x8;
      
      setTimeout(async () => {
        try {
          const result = await calculateFn(board, turn, gameSetupData.difficulty);
          if (isMounted && result) {
            setAiAnalysis(result);
            if (is10x10) applyMove10x10(result);
            else applyMove8x8(result);
          } else if (isMounted) {
            setWinner(1);
            handleGameOver('win', 0);
          }
        } catch (err) {
          console.error("AI Error:", err);
        } finally {
          if (isMounted) isProcessingRef.current = false;
        }
      }, 500);
    }
    
    return () => { isMounted = false; };
  }, [turn, winner, isPaused, gameSetupData, is10x10, isOnline, showSetupModal, board]);

  const handleTimeExpired = () => {
    if (winner) return;
    setWinner(`timeout_${turn}`);
    handleGameOver('timeout', 0);
    toast.error(`Player ${turn} ran out of time!`);
  };

  const handleSquareClick10x10 = (r, c) => {
    if (showSetupModal || winner !== null || isPaused || isProcessingRef.current || (gameSetupData?.mode === 'human_vs_computer' && turn === 2 && !isOnline)) return;
    
    try {
      if (restrictedPiece && (r !== restrictedPiece.r || c !== restrictedPiece.c)) {
        if (selectedSquare && selectedSquare.r === restrictedPiece.r && selectedSquare.c === restrictedPiece.c) {
          const move = validMoves.find(m => m.to.r === r && m.to.c === c);
          if (move) applyMove10x10(move);
        }
        return;
      }
      
      const piece = board?.[r]?.[c];
      if (selectedSquare) {
        const move = validMoves.find(m => m.to.r === r && m.to.c === c);
        if (move) {
          applyMove10x10(move);
        } else if (!restrictedPiece && piece && piece.player === turn) {
          const pieceMoves = getValidMoves10x10(board, turn).filter(m => m.from.r === r && m.from.c === c);
          setSelectedSquare({ r, c }); setValidMoves(pieceMoves);
        } else if (!restrictedPiece) {
          setSelectedSquare(null); setValidMoves([]);
        }
      } else {
        if (piece && piece.player === turn) {
          const pieceMoves = getValidMoves10x10(board, turn).filter(m => m.from.r === r && m.from.c === c);
          if (pieceMoves.length > 0) { setSelectedSquare({ r, c }); setValidMoves(pieceMoves); }
        }
      }
    } catch (e) {
      console.error("Square click error:", e);
    }
  };

  const handleSquareClick8x8 = ({r, c}) => {
    if (showSetupModal || winner !== null || isPaused || isProcessingRef.current || (gameSetupData?.mode === 'human_vs_computer' && turn === 2 && !isOnline)) return;
    
    try {
      if (restrictedPiece && (r !== restrictedPiece.r || c !== restrictedPiece.c)) {
        if (selectedSquare && selectedSquare.r === restrictedPiece.r && selectedSquare.c === restrictedPiece.c) {
          const move = validMoves.find(m => m.toR === r && m.toC === c);
          if (move) applyMove8x8({from: selectedSquare, move});
        }
        return;
      }

      const piece = board?.[r]?.[c];
      const isOwner = (turn === 1 && (piece === 1 || piece === 3)) || (turn === 2 && (piece === 2 || piece === 4));
      
      if (selectedSquare) {
        const move = validMoves.find(m => m.toR === r && m.toC === c);
        if (move) {
          applyMove8x8({from: selectedSquare, move});
        } else if (!restrictedPiece && piece && isOwner) {
          setSelectedSquare({ r, c });
          setValidMoves(getAllValidMoves(board, turn).get(`${r},${c}`) || []);
        } else if (!restrictedPiece) {
          setSelectedSquare(null); setValidMoves([]);
        }
      } else {
        if (piece && isOwner) {
          setSelectedSquare({ r, c });
          setValidMoves(getAllValidMoves(board, turn).get(`${r},${c}`) || []);
        }
      }
    } catch (e) {
      console.error("Square click error:", e);
    }
  };

  const handleResign = () => {
    setWinner(`resign_${turn}`);
    handleGameOver('resign', 0);
  };

  const handleUndo = () => {
    if (boardHistory.length <= 1 || winner) return;
    
    const stepsToPop = gameSetupData?.mode === 'human_vs_computer' ? 2 : 1;
    if (boardHistory.length <= stepsToPop) return;

    try {
      const newHistory = boardHistory.slice(0, boardHistory.length - stepsToPop);
      const previousState = newHistory[newHistory.length - 1];
      
      setBoardHistory(newHistory);
      setBoard(previousState.board);
      setTurn(previousState.turn);
      setLastMove(previousState.lastMove);
      setSelectedSquare(null);
      setValidMoves([]);
      setRestrictedPiece(null);
      setCurrentTurnNotation('');
      setAiAnalysis(null);
      
      saveGameState({
        gameState: { board: previousState.board, turn: previousState.turn },
        currentTurn: previousState.turn,
        player1Time: timeP1,
        player2Time: timeP2
      });
    } catch (e) {
      console.error("Undo error:", e);
    }
  };

  const resetGame = (config = gameSetupData) => {
    try {
      const initBoard = is10x10 ? createInitialBoard10x10() : createInitialBoard();
      setBoard(initBoard);
      setTurn(1);
      setWinner(null);
      setSelectedSquare(null);
      setValidMoves([]);
      setLastMove(null);
      setRestrictedPiece(null);
      setCurrentTurnNotation('');
      setAiAnalysis(null);
      
      const tc = config?.timeLimit ?? config?.match?.timeControl;
      const newTime = tc === 'unlimited' || tc === 0 ? 'unlimited' : (Number(tc) || 600);
      setTimeP1(newTime);
      setTimeP2(newTime);
      
      setBoardHistory([{ board: initBoard, turn: 1, lastMove: null }]);
      soundPlayedRef.current = false;
      gameStartTimeRef.current = Date.now();
      isProcessingRef.current = false;
    } catch (e) {
      console.error("Reset error:", e);
    }
  };

  let isWin = false;
  let isLoss = false;
  let isDraw = winner === 'draw';
  
  if (winner) {
    if (winner === 1 || winner === 'timeout_2' || winner === 'resign_2') isWin = true;
    if (winner === 2 || winner === 'timeout_1' || winner === 'resign_1') isLoss = true;
  }

  useEffect(() => {
    if (winner && !soundPlayedRef.current) {
      soundPlayedRef.current = true;
      if (isWin) playWin();
      else if (isLoss) playLose();
      else if (isDraw) playWin();
    }
  }, [winner, isWin, isLoss, isDraw, playWin, playLose]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Restoring game state...</p>
      </div>
    );
  }

  let turnText = turn === 1 ? `${gameSetupData?.playerName || 'Player 1'}'S TURN` : `${gameSetupData?.opponentName || 'AI'}'S TURN`;
  const durationSeconds = Math.floor((Date.now() - gameStartTimeRef.current)/1000);
  const endStats = {
    moves: moveHistory?.length || 0,
    duration: formatDuration(durationSeconds),
    analysis: isWin ? "Excellent positional play secured the victory." : isLoss ? "Opponent capitalized on tactical errors." : "A balanced match that resulted in a draw."
  };

  const animationStatus = isWin ? 'won' : isLoss ? 'lost' : 'in-progress';

  return (
    <>
      <Helmet><title>{`${is10x10 ? t('games.checkers10') : t('games.checkers8')} | NICOLENIUM`}</title></Helmet>
      
      <CombinedGameSetupModal 
        isOpen={showSetupModal} 
        gameType={gameTypeStr}
        onGameStart={handleGameStart} 
        onClose={handleCloseModal} 
      />

      {!showSetupModal && gameSetupData && (
        <UnifiedGameLayout 
          title={is10x10 ? t('games.checkers10') : t('games.checkers8')} 
          turnText={winner ? t('common.gameOver') : turnText} 
          history={moveHistory} 
          onReset={() => { resetGame(); }}
          isOnline={isOnline}
          onResign={handleResign}
          canUndo={boardHistory.length > 1 && !winner}
          onUndo={handleUndo}
          gameType={gameTypeStr}
        >
          {winner && (
            <BrandedGameOverScreen 
              gameType={is10x10 ? t('games.checkers10') : t('games.checkers8')}
              isWin={isWin}
              isLoss={isLoss}
              isDraw={isDraw}
              stats={endStats}
              onReplay={() => { resetGame(); }}
            />
          )}

          <div className="w-full flex flex-col xl:flex-row items-start justify-center gap-8 py-8 px-4 max-w-7xl mx-auto">
            <div className="w-full max-w-[70vh] flex flex-col items-center relative mx-auto xl:mx-0 shrink-0">
              <div className="w-full mb-6 flex justify-between gap-4">
                <GameClockDisplay playerName={gameSetupData?.playerName || 'Player 1'} totalTimeSeconds={initialSeconds} timeRemainingSeconds={timeP1} isActive={turn === 1 && !winner && !isPaused} onTimeExpired={handleTimeExpired} />
                <GameClockDisplay playerName={gameSetupData?.opponentName || 'AI'} totalTimeSeconds={initialSeconds} timeRemainingSeconds={timeP2} isActive={turn === 2 && !winner && !isPaused} onTimeExpired={handleTimeExpired} />
              </div>

              <ErrorBoundary>
                <div className="w-full aspect-square relative shadow-2xl rounded-xl overflow-hidden border-8 border-secondary">
                  {isProcessingRef.current && (
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-md animate-pulse z-10">
                      <BrainCircuit className="w-4 h-4" /> AI is thinking...
                    </div>
                  )}
                  <GameAnimationOverlay gameStatus={animationStatus}>
                    {is10x10 ? (
                      <CheckersBoard10x10 board={board} onSquareClick={handleSquareClick10x10} selectedSquare={selectedSquare} validMoves={validMoves} currentPlayer={turn} lastMove={lastMove} interactive={!isPaused && winner === null} />
                    ) : (
                      <CheckersBoard board={board} onSquareClick={handleSquareClick8x8} selectedSquare={selectedSquare} validMoves={validMoves} currentPlayer={turn} interactive={!isPaused && winner === null} />
                    )}
                  </GameAnimationOverlay>
                </div>
              </ErrorBoundary>
            </div>

            <div className="w-full max-w-md mx-auto xl:mx-0 flex flex-col gap-6">
              {gameSetupData.mode === 'human_vs_computer' && aiAnalysis && (
                <div className="bg-card border-2 border-border rounded-2xl p-5 shadow-sm">
                  <h3 className="font-black text-lg mb-3 flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-primary" /> AI Pro Intelligence
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <span className="text-muted-foreground font-medium">Difficulty</span>
                      <span className="font-bold capitalize text-primary">{gameSetupData.difficulty}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <span className="text-muted-foreground font-medium">Evaluation Score</span>
                      <span className="font-bold tabular-nums">{aiAnalysis.score > 0 ? '+' : ''}{aiAnalysis.score}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <span className="text-muted-foreground font-medium">Search Depth</span>
                      <span className="font-bold tabular-nums">{aiAnalysis.depthAchieved || aiAnalysis.depth || 1} ply</span>
                    </div>
                    {aiAnalysis.analysisText && (
                      <div className="pt-2">
                        <span className="text-muted-foreground font-medium block mb-1">Analysis</span>
                        <p className="font-medium leading-relaxed">{aiAnalysis.analysisText}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </UnifiedGameLayout>
      )}
    </>
  );
}
