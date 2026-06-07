
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { createInitialBoard, executeMove, switchTurn, getGameStatus, convertPositionToNotation } from '@/utils/CheckersGameLogic.js';
import { selectMove } from '@/utils/UnbeatableAI.js';
import AIvsAIDisplay from './AIvsAIDisplay.jsx';
import { useGameSession } from '@/hooks/useGameSession.js';

const getInitialTime = (diff) => {
  switch(diff) {
    case 'easy': return 5000;
    case 'medium': return 10000;
    case 'hard': return 30000;
    case 'impossible': return 60000;
    default: return 10000;
  }
};

const AIvsAIGame = ({ difficulty }) => {
  const [boardState, setBoardState] = useState(() => createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameStatus, setGameStatus] = useState('active');
  const [capturedPieces, setCapturedPieces] = useState({ p1: 0, p2: 0 });
  const [localMoveHistory, setLocalMoveHistory] = useState([]);
  
  const [timeP1, setTimeP1] = useState(() => getInitialTime(difficulty));
  const [timeP2, setTimeP2] = useState(() => getInitialTime(difficulty));
  
  const [speed, setSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  
  const isThinkingRef = useRef(false);
  const [sessionInitialized, setSessionInitialized] = useState(false);

  const { initializeSession, recordMove, handleGameOver, moveHistory } = useGameSession('checkers-8x8', { mode: 'ai_vs_ai', difficulty });

  useEffect(() => {
    if (!sessionInitialized) {
      initializeSession({ mode: 'ai_vs_ai', timeControl: 'custom', difficulty });
      setSessionInitialized(true);
    }
  }, [initializeSession, sessionInitialized, difficulty]);

  useEffect(() => {
    let interval;
    if (gameStatus === 'active' && !isPaused && isThinking) {
      interval = setInterval(() => {
        const decrement = 100 * speed;
        if (currentPlayer === 1) {
          setTimeP1(prev => Math.max(0, prev - decrement));
        } else {
          setTimeP2(prev => Math.max(0, prev - decrement));
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameStatus, isPaused, currentPlayer, isThinking, speed]);

  const handleMoveExecution = useCallback((fromR, fromC, move, player) => {
    const { newBoard, capturedPieces: caps, madeKing } = executeMove(boardState, {r: fromR, c: fromC}, move, player);
    
    if (caps && caps.length > 0) {
      setCapturedPieces(prev => ({
        ...prev,
        [player === 1 ? 'p1' : 'p2']: prev[player === 1 ? 'p1' : 'p2'] + caps.length
      }));
    }

    const finalPathPos = move.path ? move.path[move.path.length-1] : { r: move.toR, c: move.toC };
    
    let notation = convertPositionToNotation({r: fromR, c: fromC}, finalPathPos, move.isCapture);
    if (madeKing) notation += ' (King)';
    
    recordMove(notation, caps.length * 10, { 
      player: player === 1 ? 'AI_1 (Red)' : 'AI_2 (Black)',
      moveNumber: Math.floor(moveHistory.length / 2) + 1 
    });

    setLocalMoveHistory(prev => [...prev, { from: {r: fromR, c: fromC}, to: finalPathPos, player }]);
    setBoardState(newBoard);
    
    const nextPlayer = switchTurn(player);
    setCurrentPlayer(nextPlayer);
    
    const nextTime = getInitialTime(difficulty);
    if (nextPlayer === 1) setTimeP1(nextTime);
    else setTimeP2(nextTime);

    const status = getGameStatus(newBoard, nextPlayer);
    if (status !== 'in_progress' && status !== 'active') {
      setGameStatus(status);
      handleGameOver(status);
      toast.success(status === 'player1_win' ? 'White AI Wins!' : status === 'player2_win' ? 'Black AI Wins!' : 'Draw!');
    }
  }, [boardState, difficulty, recordMove, moveHistory.length, handleGameOver]);

  const processAITurn = useCallback(async () => {
    if (gameStatus !== 'active' && gameStatus !== 'in_progress') return;
    if (isPaused || isThinkingRef.current) return;
    
    isThinkingRef.current = true;
    setIsThinking(true);
    
    const moveDelay = 1000 / speed;
    await new Promise(r => setTimeout(r, moveDelay));
    
    const timeLimit = getInitialTime(difficulty);
    const aiMove = await selectMove(boardState, difficulty, timeLimit, currentPlayer);
    
    isThinkingRef.current = false;
    setIsThinking(false);
    
    if (aiMove && (gameStatus === 'active' || gameStatus === 'in_progress') && !isPaused) {
      handleMoveExecution(aiMove.fromR, aiMove.fromC, aiMove.move, currentPlayer);
    } else if (!aiMove) {
      const status = currentPlayer === 1 ? 'player2_wins' : 'player1_wins';
      setGameStatus(status);
      handleGameOver(status);
      toast.info(`Game Over. ${status.replace('_', ' ')}`);
    }
  }, [boardState, gameStatus, isPaused, currentPlayer, difficulty, speed, handleMoveExecution, handleGameOver]);

  useEffect(() => {
    if ((gameStatus === 'active' || gameStatus === 'in_progress') && !isPaused && sessionInitialized) {
      processAITurn();
    }
  }, [currentPlayer, gameStatus, isPaused, processAITurn, sessionInitialized]);

  const handleReset = () => {
    setBoardState(createInitialBoard());
    setCurrentPlayer(1);
    setGameStatus('active');
    setCapturedPieces({ p1: 0, p2: 0 });
    setLocalMoveHistory([]);
    setTimeP1(getInitialTime(difficulty));
    setTimeP2(getInitialTime(difficulty));
    setIsPaused(false);
    isThinkingRef.current = false;
    setIsThinking(false);
    initializeSession({ mode: 'ai_vs_ai', timeControl: 'custom', difficulty });
  };

  return (
    <AIvsAIDisplay 
      boardState={boardState}
      currentPlayer={currentPlayer}
      ai1Time={timeP1}
      ai2Time={timeP2}
      gameStatus={gameStatus}
      difficulty={difficulty}
      speed={speed}
      isPaused={isPaused}
      moveHistory={localMoveHistory}
      capturedPieces={capturedPieces}
      onPauseToggle={() => setIsPaused(!isPaused)}
      onSpeedChange={setSpeed}
      onReset={handleReset}
    />
  );
};

export default AIvsAIGame;
