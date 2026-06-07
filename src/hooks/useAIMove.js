
import { useState, useCallback, useRef, useEffect } from 'react';

export const useAIMove = (gameType, difficulty, onMoveReady) => {
  const [isThinking, setIsThinking] = useState(false);
  const cancelRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const makeAIMove = useCallback(async (gameState, player, timeLimitSec = 10) => {
    if (isThinking) return;
    setIsThinking(true);
    cancelRef.current = false;

    try {
      // Natural delay
      await new Promise(r => setTimeout(r, 600));
      if (cancelRef.current) { setIsThinking(false); return; }

      let chosenMove = null;

      if (gameType === 'checkers') {
        const { getAIMove } = await import('@/utils/CheckersGameLogic.js');
        chosenMove = await getAIMove(gameState, player, difficulty);
      } else if (gameType === 'chess') {
        const { getAIMove } = await import('@/utils/ChessGameLogic.js');
        chosenMove = await getAIMove(gameState, difficulty);
      } else if (gameType === 'ludo') {
        const { getAIMove } = await import('@/utils/LudoLogic.js');
        chosenMove = await getAIMove(gameState, player, difficulty);
      } else if (gameType === 'tictactoe') {
        const { getAIMove } = await import('@/utils/TicTacToeLogic.js');
        chosenMove = await getAIMove(gameState, player, difficulty);
      }

      if (!cancelRef.current && chosenMove !== null) {
        onMoveReady(chosenMove);
      }
    } catch (err) {
      console.error('AI Calculation Error:', err);
    } finally {
      setIsThinking(false);
    }
  }, [gameType, difficulty, onMoveReady, isThinking]);

  const cancelAIMove = useCallback(() => {
    cancelRef.current = true;
    setIsThinking(false);
  }, []);

  return { isThinking, makeAIMove, cancelAIMove };
};
