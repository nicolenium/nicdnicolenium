
import { checkWinDetails as calculateWinner, isBoardFull } from './TicTacToeLogic.js';
import { logAIMove, getDifficultyTimeout, executeWithTimeout } from './AILogger.js';

export async function getBestMove(board, difficulty = 'expert', timeLimitMs = 1000, player = 'O') {
  const startTime = Date.now();
  const timeoutMs = getDifficultyTimeout(difficulty);
  const opponent = player === 'X' ? 'O' : 'X';

  const available = board.map((s, i) => s === null ? i : null).filter(s => s !== null);
  if (available.length === 0) return null;
  
  const fallbackMove = available[Math.floor(Math.random() * available.length)];

  await new Promise(r => setTimeout(r, 250)); 

  if (difficulty === 'easy' && Math.random() < 0.6) {
    await logAIMove({
      game: 'TicTacToe',
      level: difficulty,
      depth: 1,
      eval: 0,
      evalBefore: 0,
      time: Date.now() - startTime,
      move: `pos:${fallbackMove}`
    });
    return { move: fallbackMove, score: 0, depth: 1, timeMs: Date.now() - startTime, nodes: 0, explanation: "Random move for easy." };
  }
  if (difficulty === 'medium' && Math.random() < 0.2) {
    await logAIMove({
      game: 'TicTacToe',
      level: difficulty,
      depth: 1,
      eval: 0,
      evalBefore: 0,
      time: Date.now() - startTime,
      move: `pos:${fallbackMove}`
    });
    return { move: fallbackMove, score: 0, depth: 1, timeMs: Date.now() - startTime, nodes: 0, explanation: "Sub-optimal move for medium." };
  }

  let nodes = 0;

  try {
    return await executeWithTimeout(async () => {
      const minimax = (currBoard, depth, isMaximizing) => {
        nodes++;
        
        const winInfo = calculateWinner(currBoard);
        if (winInfo?.winner === player) return 10 - depth;
        if (winInfo?.winner === opponent) return depth - 10;
        if (isBoardFull(currBoard)) return 0;

        if (isMaximizing) {
          let maxEval = -Infinity;
          for (let i = 0; i < 9; i++) {
            if (!currBoard[i]) {
              currBoard[i] = player;
              let ev = minimax(currBoard, depth + 1, false);
              currBoard[i] = null;
              maxEval = Math.max(maxEval, ev);
            }
          }
          return maxEval;
        } else {
          let minEval = Infinity;
          for (let i = 0; i < 9; i++) {
            if (!currBoard[i]) {
              currBoard[i] = opponent;
              let ev = minimax(currBoard, depth + 1, true);
              currBoard[i] = null;
              minEval = Math.min(minEval, ev);
            }
          }
          return minEval;
        }
      };

      let bestScore = -Infinity;
      let move = -1;
      
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = player;
          let score = minimax(board, 0, false);
          board[i] = null;
          
          if (score > bestScore || (score === bestScore && Math.random() > 0.5)) {
            bestScore = score;
            move = i;
          }
        }
      }

      const timeSpent = Date.now() - startTime;
      const expl = bestScore > 0 ? "Found winning path." : (bestScore === 0 ? "Opted for optimal draw continuation." : "Defensive block.");

      await logAIMove({
        game: 'TicTacToe',
        level: difficulty,
        depth: 9,
        eval: bestScore,
        evalBefore: 0,
        time: timeSpent,
        move: `pos:${move}`
      });

      return {
        move,
        score: bestScore,
        depth: 9,
        timeMs: timeSpent,
        nodes,
        explanation: expl,
        log: { depth: 9, eval: bestScore, nodesSearched: nodes, time: timeSpent }
      };
    }, timeoutMs, 'TicTacToe', difficulty);
  } catch (e) {
    if (e.message === 'TIMEOUT') {
      return {
        move: fallbackMove,
        score: 0,
        depth: 1,
        timeMs: Date.now() - startTime,
        nodes,
        explanation: "Timeout reached. Played random fallback move.",
        log: { depth: 1, eval: 0, nodesSearched: nodes, time: Date.now() - startTime }
      };
    }
    throw e;
  }
}

export const calculatePerfectTicTacToeMove = async (board, player, difficulty = 'expert') => {
  const result = await getBestMove(board, difficulty, 1000, player);
  return result;
};
