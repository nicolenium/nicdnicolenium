
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';
import { UnifiedGameLayout } from '@/components/UnifiedGameLayout.jsx';
import CheckersBoard10x10 from '@/components/CheckersBoard10x10.jsx';
import { useSoundEffects } from '@/utils/soundManager.js';
import { useGameSession } from '@/hooks/useGameSession.js';
import { useGameConfig } from '@/contexts/GameConfigContext.jsx';
import CombinedGameSetupModal from '@/components/CombinedGameSetupModal.jsx';
import { GameClockDisplay } from '@/components/GameClockDisplay.jsx';
import GameAnimationOverlay from '@/components/GameAnimationOverlay.jsx';
import { MoveAnalysisPanel } from '@/components/MoveAnalysisPanel.jsx';
import { BrainCircuit } from 'lucide-react';

import { createInitialBoard10x10, getValidMoves10x10, executeMove10x10, checkGameStatus10x10, formatMoveNotation10x10 } from '@/utils/CheckersGameLogic10x10.js';
import { calculateBestMove10x10 } from '@/utils/CheckersAI10x10Engine.js';

export default function Checkers10x10GamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { playWin, playLose, playMove, playCapture } = useSoundEffects();
  const { gameConfig: contextConfig, setGameConfig } = useGameConfig();
  
  const routerConfig = location.state?.gameConfig;
  const [gameSetupData, setGameSetupData] = useState(() => routerConfig || contextConfig || null);
  const [showSetupModal, setShowSetupModal] = useState(!gameSetupData);

  const { initializeSession, recordMove, moveHistory, handleGameOver } = useGameSession('checkers_10x10', gameSetupData);

  const [boardHistory, setBoardHistory] = useState([createInitialBoard10x10()]);
  const [board, setBoard] = useState(createInitialBoard10x10());
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [gameStatus, setGameStatus] = useState('active');
  const [winner, setWinner] = useState(null);
  const [restrictedSquare, setRestrictedSquare] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [currentTurnNotation, setCurrentTurnNotation] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  const initialSeconds = useMemo(() => {
    if (!gameSetupData) return 600;
    const tc = gameSetupData.timeLimit ?? gameSetupData.match?.timeControl;
    if (tc === 'unlimited' || tc === 0) return 'unlimited';
    return Number(tc) || 600;
  }, [gameSetupData]);

  const [timeP1, setTimeP1] = useState(initialSeconds); 
  const [timeP2, setTimeP2] = useState(initialSeconds);
  
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (gameSetupData && gameStatus === 'active' && !showSetupModal) {
      handleGameStart(gameSetupData);
    }
  }, []);

  const handleGameStart = (config) => {
    setGameConfig(config);
    setGameSetupData(config);
    setShowSetupModal(false);
    initializeSession(config);
    resetGame(config);
  };

  const handleCloseModal = () => navigate('/games');

  const resetGame = (config = gameSetupData) => {
    const initBoard = createInitialBoard10x10();
    setBoard(initBoard);
    setBoardHistory([initBoard]);
    setCurrentPlayer(1);
    setSelectedSquare(null);
    setValidMoves([]);
    setGameStatus('active');
    setWinner(null);
    setRestrictedSquare(null);
    setLastMove(null);
    setCurrentTurnNotation('');
    setAiAnalysis(null);
    setIsAiThinking(false);
    
    const tc = config?.timeLimit ?? config?.match?.timeControl;
    const newTime = tc === 'unlimited' || tc === 0 ? 'unlimited' : (Number(tc) || 600);
    setTimeP1(newTime);
    setTimeP2(newTime);
    isProcessingRef.current = false;
  };

  const handleFinalizeTurn = (nextTurn, newBoard, finalNotation, madeKing) => {
    let completeNotation = finalNotation || '';
    if (madeKing) completeNotation += ' (King)';
    
    setCurrentTurnNotation('');
    setCurrentPlayer(nextTurn);
    setSelectedSquare(null);
    setValidMoves([]);
    setRestrictedSquare(null);
    setBoardHistory(prev => [...prev, newBoard]);

    const statusObj = checkGameStatus10x10(newBoard, nextTurn);
    
    recordMove(completeNotation, 0, {
      player: currentPlayer === 1 ? 'Player 1' : 'Player 2',
      forceSync: true
    });

    if (statusObj?.status === 'won') {
      setGameStatus('won');
      setWinner(statusObj.winner);
      handleGameOver(statusObj.winner === 1 ? 'win' : 'loss', 0);
      if (statusObj.winner === 1) {
        playWin();
        toast.success(`Player 1 wins!`);
      } else {
        playLose();
        toast.error(`Player 2 wins!`);
      }
    }
  };

  const applyMove = (move) => {
    try {
      const { newBoard, capturedPieces, madeKing } = executeMove10x10(board, move);
      setBoard(newBoard);
      setLastMove(move);
      
      const isCapture = capturedPieces.length > 0;
      if (isCapture) playCapture(); else playMove();

      let notationChunk = formatMoveNotation10x10(move.from.r, move.from.c, move.to.r, move.to.c);
      notationChunk += isCapture ? 'x' : '';
      const nextNotation = currentTurnNotation + notationChunk;
      setCurrentTurnNotation(nextNotation);

      let multiJumpPossible = false;
      if (isCapture) {
        const jumps = getValidMoves10x10(newBoard, currentPlayer, move.to).filter(m => m.captured && m.captured.length > 0);
        if (jumps.length > 0) {
          multiJumpPossible = true;
          setRestrictedSquare(move.to);
          setSelectedSquare(move.to);
          setValidMoves(jumps);
        }
      }

      if (!multiJumpPossible) {
        handleFinalizeTurn(currentPlayer === 1 ? 2 : 1, newBoard, nextNotation, madeKing);
      }
    } catch (e) {
      console.error("Move application error:", e);
    }
  };

  const handleSquareClick = useCallback((r, c) => {
    if (gameStatus !== 'active' || isProcessingRef.current) return;
    if (gameSetupData?.mode === 'human_vs_computer' && currentPlayer === 2) return;

    if (restrictedSquare && (r !== restrictedSquare.r || c !== restrictedSquare.c)) {
      if (selectedSquare && selectedSquare.r === restrictedSquare.r && selectedSquare.c === restrictedSquare.c) {
        const move = validMoves.find(m => m.to.r === r && m.to.c === c);
        if (move) applyMove(move);
      }
      return;
    }

    const piece = board[r][c];

    if (selectedSquare) {
      const move = validMoves.find(m => m.to.r === r && m.to.c === c);
      if (move) {
        applyMove(move);
      } else if (!restrictedSquare && piece && piece.player === currentPlayer) {
        setSelectedSquare({ r, c });
        setValidMoves(getValidMoves10x10(board, currentPlayer).filter(m => m.from.r === r && m.from.c === c));
      } else if (!restrictedSquare) {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else {
      if (piece && piece.player === currentPlayer && (!restrictedSquare || (restrictedSquare.r === r && restrictedSquare.c === c))) {
        setSelectedSquare({ r, c });
        setValidMoves(getValidMoves10x10(board, currentPlayer).filter(m => m.from.r === r && m.from.c === c));
      }
    }
  }, [board, currentPlayer, selectedSquare, validMoves, gameStatus, gameSetupData?.mode, restrictedSquare]);

  useEffect(() => {
    let isMounted = true;
    if (gameSetupData?.mode === 'human_vs_computer' && currentPlayer === 2 && gameStatus === 'active' && !isProcessingRef.current) {
      const playAI = async () => {
        isProcessingRef.current = true;
        setIsAiThinking(true);
        try {
          const difficulty = gameSetupData?.difficulty ?? 'medium';
          const aiMove = await calculateBestMove10x10(board, 2, difficulty, restrictedSquare);
          if (isMounted && aiMove) {
            setAiAnalysis(aiMove.analysis || { score: 12, depth: 3, analysisText: "Solid tactical progression." });
            applyMove(aiMove);
          } else if (isMounted) {
            setGameStatus('won');
            setWinner(1);
            handleGameOver('win', 0);
            playWin();
            toast.success("You win! AI has no moves.");
          }
        } catch (e) {
          console.error("AI Error:", e);
        } finally {
          if (isMounted) {
            isProcessingRef.current = false;
            setIsAiThinking(false);
          }
        }
      };
      playAI();
    }
    return () => { isMounted = false; };
  }, [currentPlayer, gameStatus, gameSetupData, board, restrictedSquare]);

  const handleUndo = () => {
    if (boardHistory.length <= 1 || gameStatus !== 'active' || isProcessingRef.current) return;
    const stepsToUndo = gameSetupData?.mode === 'human_vs_computer' ? 2 : 1;
    if (boardHistory.length <= stepsToUndo) return;

    const newHistory = boardHistory.slice(0, boardHistory.length - stepsToUndo);
    setBoardHistory(newHistory);
    setBoard(newHistory[newHistory.length - 1]);
    setCurrentPlayer(gameSetupData?.mode === 'human_vs_computer' ? 1 : (currentPlayer === 1 ? 2 : 1));
    setSelectedSquare(null);
    setValidMoves([]);
    setRestrictedSquare(null);
    setLastMove(null);
    setAiAnalysis(null);
    toast.info("Move undone.");
  };

  const handleTimeExpired = () => {
    if (gameStatus !== 'active') return;
    const winnerColor = currentPlayer === 1 ? 2 : 1;
    setWinner(winnerColor);
    setGameStatus('won');
    handleGameOver('timeout', 0);
    toast.error(`Player ${currentPlayer} ran out of time!`);
  };

  return (
    <>
      <Helmet><title>Pro Checkers 10x10 | NICOLENIUM</title></Helmet>
      
      <CombinedGameSetupModal 
        isOpen={showSetupModal} 
        gameType="checkers_10x10"
        game={{ name: "Pro Checkers 10x10", id: "checkers-10x10" }}
        onGameStart={handleGameStart} 
        onClose={handleCloseModal} 
      />

      {!showSetupModal && gameSetupData && (
        <UnifiedGameLayout 
          title="Pro Checkers 10x10" 
          turnText={gameStatus === 'won' ? `PLAYER ${winner} WINS!` : `PLAYER ${currentPlayer}'S TURN`} 
          history={moveHistory} 
          onReset={() => resetGame()}
          canUndo={boardHistory.length > 1 && gameStatus === 'active'}
          onUndo={handleUndo}
          onResign={() => { setWinner(currentPlayer === 1 ? 2 : 1); setGameStatus('won'); handleGameOver('loss', 0); }}
          gameType="checkers_10x10"
        >
          <div className="w-full flex flex-col xl:flex-row items-start justify-center gap-8 py-8 px-4 max-w-7xl mx-auto">
            
            <div className="w-full max-w-[85vh] mx-auto xl:mx-0 shrink-0 flex flex-col items-center">
              <div className="w-full mb-6 flex justify-between gap-4">
                <GameClockDisplay 
                  playerName={gameSetupData?.players?.p1Name || 'Player 1'} 
                  totalTimeSeconds={initialSeconds} 
                  timeRemainingSeconds={timeP1} 
                  isActive={currentPlayer === 1 && gameStatus === 'active'} 
                  onTimeExpired={handleTimeExpired} 
                />
                <GameClockDisplay 
                  playerName={gameSetupData?.players?.p2Name || 'Pro AI Bot'} 
                  totalTimeSeconds={initialSeconds} 
                  timeRemainingSeconds={timeP2} 
                  isActive={currentPlayer === 2 && gameStatus === 'active'} 
                  onTimeExpired={handleTimeExpired} 
                />
              </div>

              <div className="w-full aspect-square relative mx-auto xl:mx-0">
                {isAiThinking && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-2 shadow-lg animate-pulse z-20">
                    <BrainCircuit className="w-4 h-4" /> Pro AI Thinking
                  </div>
                )}
                <GameAnimationOverlay gameStatus={gameStatus === 'won' ? (winner === 1 ? 'won' : 'lost') : 'in-progress'}>
                  <CheckersBoard10x10 
                    board={board}
                    onSquareClick={handleSquareClick}
                    selectedSquare={selectedSquare}
                    validMoves={validMoves}
                    interactive={gameStatus === 'active'}
                    lastMove={lastMove}
                  />
                </GameAnimationOverlay>
              </div>
            </div>

            <div className="w-full max-w-md mx-auto xl:mx-0 flex flex-col gap-6">
              {gameSetupData.mode === 'human_vs_computer' && aiAnalysis && (
                <MoveAnalysisPanel analysis={aiAnalysis} title="Pro AI Evaluation" />
              )}
            </div>
            
          </div>
        </UnifiedGameLayout>
      )}
    </>
  );
}
