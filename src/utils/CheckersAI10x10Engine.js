
import * as CheckersLogic10x10 from '@/utils/CheckersGameLogic10x10.js';
import { AIEngineBase } from './AIEngineBase.js';
import { AILogger, logAIMove, getDifficultyTimeout, executeWithTimeout } from './AILogger.js';

const getValidMoves10x10 = CheckersLogic10x10.getValidMoves10x10 || (() => []);
const executeMove10x10 = CheckersLogic10x10.executeMove10x10 || ((b) => ({ newBoard: b }));

const getStrictLegalMoves10x10 = (board, player) => {
  const moves = getValidMoves10x10(board, player);
  if (!moves || moves.length === 0) return [];
  
  const maxCaps = Math.max(...moves.map(m => m.captured?.length || 0));
  if (maxCaps > 0) {
    return moves.filter(m => (m.captured?.length || 0) === maxCaps);
  }
  return moves;
};

const evaluateBoard10x10 = (board, player) => {
  let score = 0;
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const p = board[r][c];
      if (!p) continue;
      
      let val = p.isKing ? 3.0 : 1.0;
      if (!p.isKing) {
        val += (p.player === 1 ? (9 - r) : r) * 0.05;
      }
      if (c >= 3 && c <= 6 && r >= 3 && r <= 6) val += 0.15;
      
      if (p.player === player) score += val;
      else score -= val;
    }
  }
  return score;
};

export const calculateBestMove10x10 = async (board, player, difficulty = 'hard') => {
  const startTime = Date.now();
  const timeoutMs = getDifficultyTimeout(difficulty);
  const config = AIEngineBase.getDifficultyConfig(difficulty);
  const legalMoves = getStrictLegalMoves10x10(board, player);

  if (legalMoves.length === 0) return null;
  const fallbackMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
  const evalBefore = evaluateBoard10x10(board, player);

  try {
    if (Math.random() < config.randomness) {
      const moveStr = `${fallbackMove.from.r},${fallbackMove.from.c}->${fallbackMove.to.r},${fallbackMove.to.c}`;
      await logAIMove({
        game: 'Checkers10x10',
        level: difficulty,
        depth: 0,
        eval: evalBefore,
        evalBefore: evalBefore,
        time: Date.now() - startTime,
        move: moveStr
      });
      return { ...fallbackMove, analysisText: "Randomized move for difficulty balance.", score: evalBefore };
    }

    return await executeWithTimeout(async () => {
      let bestScore = -Infinity;
      let bestMove = fallbackMove;

      const minimax = async (currBoard, depth, alpha, beta, isMax, currPlayer) => {
        if (depth === 0) return evaluateBoard10x10(currBoard, player);

        const moves = getStrictLegalMoves10x10(currBoard, currPlayer);
        if (moves.length === 0) return isMax ? -100 : 100;

        if (isMax) {
          let maxEval = -Infinity;
          for (const m of moves) {
            const { newBoard } = executeMove10x10(currBoard, m);
            const ev = await minimax(newBoard, depth - 1, alpha, beta, false, currPlayer === 1 ? 2 : 1);
            maxEval = Math.max(maxEval, ev);
            alpha = Math.max(alpha, ev);
            if (beta <= alpha) break;
          }
          return maxEval;
        } else {
          let minEval = Infinity;
          for (const m of moves) {
            const { newBoard } = executeMove10x10(currBoard, m);
            const ev = await minimax(newBoard, depth - 1, alpha, beta, true, currPlayer === 1 ? 2 : 1);
            minEval = Math.min(minEval, ev);
            beta = Math.min(beta, ev);
            if (beta <= alpha) break;
          }
          return minEval;
        }
      };

      for (const m of legalMoves) {
        const { newBoard } = executeMove10x10(board, m);
        const loopScore = await minimax(newBoard, config.depth - 1, -Infinity, Infinity, false, player === 1 ? 2 : 1);
        if (loopScore > bestScore) {
          bestScore = loopScore;
          bestMove = m;
        }
      }
      
      const timeMs = Date.now() - startTime;
      const moveStr = `${bestMove.from.r},${bestMove.from.c}->${bestMove.to.r},${bestMove.to.c}`;
      
      await logAIMove({
        game: 'Checkers10x10',
        level: difficulty,
        depth: config.depth,
        eval: bestScore,
        evalBefore: evalBefore,
        time: timeMs,
        move: moveStr
      });

      return {
        ...bestMove,
        score: bestScore,
        analysisText: AILogger.generateExplanation('Checkers 10x10', bestScore, { depth: config.depth }),
        timeMs
      };
    }, timeoutMs, 'Checkers10x10', difficulty);

  } catch (e) {
    if (e.message === 'TIMEOUT') {
      return {
        ...fallbackMove,
        score: evalBefore,
        analysisText: "Timeout reached. Played random fallback move.",
        timeMs: Date.now() - startTime
      };
    }
    throw e;
  }
};
