
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { UnifiedGameLayout } from '@/components/UnifiedGameLayout.jsx';
import ChessBoard from '@/components/ChessBoard.jsx';
import CombinedGameSetupModal from '@/components/CombinedGameSetupModal.jsx';
import { GameClockDisplay } from '@/components/GameClockDisplay.jsx';
import GameAnimationOverlay from '@/components/GameAnimationOverlay.jsx';
import { useGameConfig } from '@/contexts/GameConfigContext.jsx';
import { useGameSession } from '@/hooks/useGameSession.js';
import { useSoundEffects } from '@/utils/soundManager.js';
import { MoveAnalysisPanel } from '@/components/MoveAnalysisPanel.jsx';
import { toast } from 'sonner';
import { BrainCircuit, Loader2 } from 'lucide-react';

import { createInitialState, executeMove, getGameStatus, getValidMoves, isWhite, isBlack } from '@/utils/ChessGameLogic.js';
import { calculateBestChessMove } from '@/utils/ChessAIEngine.js';

export default function ChessGamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { playWin, playLose, playMove, playCapture } = useSoundEffects();
  const { gameConfig: contextConfig, setGameConfig } = useGameConfig();
  
  const routerConfig = location.state?.gameConfig;
  const [gameSetupData, setGameSetupData] = useState(() => routerConfig || contextConfig || null);
  
  const urlParams = new URLSearchParams(location.search);
  const urlGameId = urlParams.get('gameId');

  const [showSetupModal, setShowSetupModal] = useState(!gameSetupData && !urlGameId);

  const { initializeSession, recordMove, handleGameOver, moveHistory, loadGameState, saveGameState, isLoading } = useGameSession('chess', gameSetupData);

  const [gameState, setGameState] = useState(() => createInitialState());
  const [selectedCell, setSelectedCell] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState('playing');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [winner, setWinner] = useState(null);
  
  const initialSeconds = useMemo(() => {
    if (!gameSetupData) return 600;
    const tc = gameSetupData.timeLimit ?? gameSetupData.match?.timeControl;
    if (tc === 'unlimited' || tc === 0) return 'unlimited';
    return Number(tc) || 600;
  }, [gameSetupData]);

  const [timeP1, setTimeP1] = useState(initialSeconds);
  const [timeP2, setTimeP2] = useState(initialSeconds);
  
  const isProcessingRef = useRef(false);
  const gameLoadedRef = useRef(false);

  useEffect(() => {
    if (urlGameId && !gameLoadedRef.current) {
      gameLoadedRef.current = true;
      loadGameState(urlGameId).then(record => {
        if (record) {
          if (record.gameState && record.gameState.board) {
            setGameState(record.gameState);
            setGameStatus(record.status || 'playing');
          }
          if (record.player1Time !== undefined) setTimeP1(record.player1Time);
          if (record.player2Time !== undefined) setTimeP2(record.player2Time);
          setShowSetupModal(false);
        }
      });
    } else if (gameSetupData && !isGameOver && !showSetupModal) {
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

  const resetGame = (config = gameSetupData) => {
    setGameState(createInitialState());
    setSelectedCell(null);
    setValidMoves([]);
    setIsGameOver(false);
    setGameStatus('playing');
    setWinner(null);
    setAiAnalysis(null);
    setIsAiThinking(false);
    isProcessingRef.current = false;
    
    const tc = config?.timeLimit ?? config?.match?.timeControl;
    const newTime = tc === 'unlimited' || tc === 0 ? 'unlimited' : (Number(tc) || 600);
    setTimeP1(newTime);
    setTimeP2(newTime);
  };

  const getMoveNotation = (from, to, piece, isCapture) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const p = piece.toUpperCase() === 'P' ? '' : piece.toUpperCase();
    return `${p}${files[from.c]}${8-from.r}${isCapture?'x':'-'}${files[to.c]}${8-to.r}`;
  };

  const handleTimeExpired = () => {
    if (isGameOver) return;
    const timedOutColor = gameState.turnWhite ? 'white' : 'black';
    const winningColor = gameState.turnWhite ? 'black' : 'white';
    setWinner(winningColor);
    setIsGameOver(true);
    setGameStatus('timeout');
    const isPlayerWhite = gameSetupData?.players?.p1Color !== 'black';
    const isWin = (isPlayerWhite && winningColor === 'white') || (!isPlayerWhite && winningColor === 'black');
    handleGameOver(isWin ? 'win' : 'loss', 0);
    toast.error(`${timedOutColor.charAt(0).toUpperCase() + timedOutColor.slice(1)} ran out of time!`);
  };

  // AI Turn Handling
  useEffect(() => {
    let isMounted = true;
    if (isGameOver || !gameSetupData || gameSetupData.match?.mode !== 'human_vs_computer' || isProcessingRef.current) return;

    const isPlayerWhite = gameSetupData.players?.p1Color !== 'black';
    const isPlayerTurn = (gameState.turnWhite && isPlayerWhite) || (!gameState.turnWhite && !isPlayerWhite);

    if (!isPlayerTurn) {
      setIsAiThinking(true);
      isProcessingRef.current = true;
      
      const timer = setTimeout(async () => {
        try {
          const difficulty = gameSetupData.match?.difficulty || 'medium';
          const result = await calculateBestChessMove(gameState, gameState.turnWhite, difficulty);
          
          if (isMounted && result && result.move) {
            const move = result.move;
            const piece = gameState.board[move.from.r][move.from.c];
            const isCapture = !!move.capture || !!gameState.board[move.to.r][move.to.c];
            
            if (isCapture) playCapture(); else playMove();
            
            const notation = getMoveNotation(move.from, move.to, piece, isCapture);
            const newState = executeMove(gameState, move.from.r, move.from.c, move.to.r, move.to.c, move);
            
            setGameState(newState);
            setAiAnalysis(result);
            recordMove(notation, 0, { forceSync: true, player: 'AI' });
            
            saveGameState({
              gameState: newState,
              currentTurn: newState.turnWhite ? 'white' : 'black',
              player1Time: timeP1,
              player2Time: timeP2
            });

            checkStatus(newState);
          } else if (isMounted) {
            setWinner('Draw');
            handleGameOver('draw', 0);
          }
        } catch (e) {
          console.error("Chess AI error:", e);
        } finally {
          if (isMounted) {
            setIsAiThinking(false);
            isProcessingRef.current = false;
          }
        }
      }, 500); 
      return () => clearTimeout(timer);
    }
    
    return () => { isMounted = false; };
  }, [gameState, isGameOver, gameSetupData, playMove, playCapture]);

  const checkStatus = (state) => {
    const statusObj = getGameStatus(state, state.turnWhite);
    setGameStatus(statusObj.status);
    
    if (statusObj.status !== 'playing' && statusObj.status !== 'check') {
      setIsGameOver(true);
      if (statusObj.status === 'checkmate') {
        const winnerColor = state.turnWhite ? 'black' : 'white';
        setWinner(winnerColor);
        const isPlayerWhite = gameSetupData?.players?.p1Color !== 'black';
        const isWin = (isPlayerWhite && winnerColor === 'white') || (!isPlayerWhite && winnerColor === 'black');
        handleGameOver(isWin ? 'win' : 'loss', isWin ? 100 : 0);
        if (isWin) { playWin(); toast.success("Checkmate! You win!"); }
        else { playLose(); toast.error("Checkmate! Opponent wins."); }
      } else {
        setWinner('Draw');
        handleGameOver('draw', 50);
        toast.info("Game drawn.");
      }
    } else if (statusObj.status === 'check') {
      toast.warning("Check!");
    }
  };

  const onCellClick = (r, c) => {
    if (isGameOver || isAiThinking || isProcessingRef.current) return;
    
    if (gameSetupData?.match?.mode === 'human_vs_computer') {
      const isPlayerWhite = gameSetupData.players?.p1Color !== 'black';
      const isPlayerTurn = (gameState.turnWhite && isPlayerWhite) || (!gameState.turnWhite && !isPlayerWhite);
      if (!isPlayerTurn) return;
    }

    const piece = gameState.board[r][c];
    const isWhitePiece = piece && piece === piece.toUpperCase();
    const isOwnPiece = piece && (gameState.turnWhite ? isWhitePiece : !isWhitePiece);

    if (selectedCell) {
      const move = validMoves.find(m => m.r === r && m.c === c);
      if (move) {
        const selectedPiece = gameState.board[selectedCell.r][selectedCell.c];
        const isCapture = !!move.capture || !!gameState.board[r][c];
        
        if (isCapture) playCapture(); else playMove();

        const notation = getMoveNotation(selectedCell, {r, c}, selectedPiece, isCapture);
        const newState = executeMove(gameState, selectedCell.r, selectedCell.c, r, c, move);
        
        setGameState(newState);
        setSelectedCell(null);
        setValidMoves([]);
        recordMove(notation, 0, { forceSync: true, player: 'Player 1' });
        
        saveGameState({
          gameState: newState,
          currentTurn: newState.turnWhite ? 'white' : 'black',
          player1Time: timeP1,
          player2Time: timeP2
        });

        checkStatus(newState);
      } else if (isOwnPiece) {
        setSelectedCell({ r, c });
        setValidMoves(getValidMoves(gameState, r, c));
      } else {
        setSelectedCell(null);
        setValidMoves([]);
      }
    } else {
      if (isOwnPiece) {
        setSelectedCell({ r, c });
        setValidMoves(getValidMoves(gameState, r, c));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Restoring game state...</p>
      </div>
    );
  }

  const isPlayer1Turn = gameSetupData?.players?.p1Color !== 'black' ? gameState.turnWhite : !gameState.turnWhite;

  return (
    <>
      <Helmet><title>Chess | NICOLENIUM</title></Helmet>
      
      <CombinedGameSetupModal 
        isOpen={showSetupModal} 
        gameType="chess"
        game={{ name: "Chess", id: "chess" }}
        onGameStart={handleGameStart} 
        onClose={() => navigate('/games')} 
      />

      {!showSetupModal && gameSetupData && (
        <UnifiedGameLayout 
          title="Chess" 
          turnText={isGameOver ? gameStatus.toUpperCase() : (gameState.turnWhite ? "White's Turn" : "Black's Turn")} 
          onReset={() => resetGame()} 
          history={moveHistory} 
          gameType="chess"
          onResign={() => { setIsGameOver(true); setWinner(gameState.turnWhite ? 'black' : 'white'); handleGameOver('loss', 0); }}
        >
          <div className="w-full flex flex-col xl:flex-row items-start justify-center gap-8 py-8 px-4 max-w-7xl mx-auto">
            
            <div className="w-full max-w-[75vh] mx-auto xl:mx-0 shrink-0 flex flex-col gap-6">
              <div className="flex justify-between gap-4 w-full">
                <GameClockDisplay playerName={gameSetupData?.players?.p1Name || 'Player 1'} totalTimeSeconds={initialSeconds} timeRemainingSeconds={timeP1} isActive={isPlayer1Turn && !isGameOver} onTimeExpired={handleTimeExpired} />
                <GameClockDisplay playerName={gameSetupData?.players?.p2Name || 'AI'} totalTimeSeconds={initialSeconds} timeRemainingSeconds={timeP2} isActive={!isPlayer1Turn && !isGameOver} onTimeExpired={handleTimeExpired} />
              </div>

              <div className="relative">
                {isAiThinking && (
                  <div className="absolute -top-4 right-4 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-2 shadow-xl animate-pulse z-30">
                    <BrainCircuit className="w-4 h-4" /> AI is thinking
                  </div>
                )}
                
                <GameAnimationOverlay gameStatus={isGameOver ? (winner === 'Draw' ? 'draw' : 'won') : 'in-progress'}>
                  <ChessBoard
                    boardState={gameState.board}
                    onCellClick={onCellClick}
                    selectedCell={selectedCell}
                    validMoves={validMoves}
                    flipped={gameSetupData?.players?.p1Color === 'black'}
                  />
                </GameAnimationOverlay>
              </div>
            </div>

            <div className="w-full max-w-md mx-auto xl:mx-0 flex flex-col gap-6">
              {gameSetupData.match?.mode === 'human_vs_computer' && aiAnalysis && (
                <MoveAnalysisPanel analysis={aiAnalysis} />
              )}
            </div>
          </div>
        </UnifiedGameLayout>
      )}
    </>
  );
}
