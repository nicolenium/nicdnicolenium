
import * as CheckersLogic from '@/utils/CheckersGameLogic.js';
import { AIEngineBase } from './AIEngineBase.js';
import { AILogger, logAIMove, getDifficultyTimeout, executeWithTimeout } from './AILogger.js';

const getAllValidMoves = CheckersLogic.getAllValidMoves || (() => new Map());
const executeMove = CheckersLogic.executeMove || ((b) => ({ newBoard: b }));

const getStrictLegalMoves = (board, player) => {
  const validMap = getAllValidMoves(board, player);
  let allMoves = [];
  let maxCaptures = 0;
  
  for (let [fromStr, moves] of validMap.entries()) {
    const [fromR, fromC] = fromStr.split(',').map(Number);
    for (const move of moves) {
      if (move.isCapture) maxCaptures = 1; 
      allMoves.push({ from: {r: fromR, c: fromC}, move });
    }
  }
  
  if (maxCaptures > 0) {
    return allMoves.filter(m => m.move.isCapture);
  }
  return allMoves;
};

const evaluateBoard = (board, player) => {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) continue;
      
      let val = (p === 3 || p === 4 ? 3.0 : 1.0);
      if (p === 1 || p === 2) {
        val += (p === 1 ? (7 - r) : r) * 0.05; 
      }
      if (c >= 2 && c <= 5 && r >= 2 && r <= 5) val += 0.15; 
      if ((p === 1 && r === 7) || (p === 2 && r === 0)) val += 0.20;

      if ((player === 1 && (p === 1 || p === 3)) || (player === 2 && (p === 2 || p === 4))) {
        score += val;
      } else {
        score -= val;
      }
    }
  }
  return score;
};

export const calculateBestMove8x8 = async (board, player, difficulty = 'hard') => {
  const startTime = Date.now();
  const timeoutMs = getDifficultyTimeout(difficulty);
  const config = AIEngineBase.getDifficultyConfig(difficulty);
  const legalMoves = getStrictLegalMoves(board, player);

  if (legalMoves.length === 0) return null;
  const fallbackMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
  const evalBefore = evaluateBoard(board, player);

  try {
    if (Math.random() < config.randomness) {
      const moveStr = `${fallbackMove.from.r},${fallbackMove.from.c}->${fallbackMove.move.toR},${fallbackMove.move.toC}`;
      await logAIMove({
        game: 'Checkers8x8',
        level: difficulty,
        depth: 0,
        eval: evalBefore,
        evalBefore: evalBefore,
        time: Date.now() - startTime,
        move: moveStr
      });
      return { from: fallbackMove.from, move: fallbackMove.move, analysisText: "Randomized move for difficulty balance.", score: evalBefore };
    }

    return await executeWithTimeout(async () => {
      let bestScore = -Infinity;
      let bestMove = fallbackMove;

      const minimax = async (currBoard, depth, alpha, beta, isMax, currPlayer) => {
        if (depth === 0) return evaluateBoard(currBoard, player);

        const moves = getStrictLegalMoves(currBoard, currPlayer);
        if (moves.length === 0) return isMax ? -100 : 100;

        if (isMax) {
          let maxEval = -Infinity;
          for (const m of moves) {
            const { newBoard } = executeMove(currBoard, m.from, m.move, currPlayer);
            const ev = await minimax(newBoard, depth - 1, alpha, beta, false, currPlayer === 1 ? 2 : 1);
            maxEval = Math.max(maxEval, ev);
            alpha = Math.max(alpha, ev);
            if (beta <= alpha) break;
          }
          return maxEval;
        } else {
          let minEval = Infinity;
          for (const m of moves) {
            const { newBoard } = executeMove(currBoard, m.from, m.move, currPlayer);
            const ev = await minimax(newBoard, depth - 1, alpha, beta, true, currPlayer === 1 ? 2 : 1);
            minEval = Math.min(minEval, ev);
            beta = Math.min(beta, ev);
            if (beta <= alpha) break;
          }
          return minEval;
        }
      };

      for (const m of legalMoves) {
        const { newBoard } = executeMove(board, m.from, m.move, player);
        const loopScore = await minimax(newBoard, config.depth - 1, -Infinity, Infinity, false, player === 1 ? 2 : 1);
        if (loopScore > bestScore) {
          bestScore = loopScore;
          bestMove = m;
        }
      }
      
      const timeMs = Date.now() - startTime;
      const explanation = AILogger.generateExplanation('Checkers 8x8', bestScore, { depth: config.depth });
      const moveStr = `${bestMove.from.r},${bestMove.from.c}->${bestMove.move.toR},${bestMove.move.toC}`;
      
      await logAIMove({
        game: 'Checkers8x8',
        level: difficulty,
        depth: config.depth,
        eval: bestScore,
        evalBefore: evalBefore,
        time: timeMs,
        move: moveStr
      });

      return {
        from: bestMove.from,
        move: bestMove.move,
        score: bestScore,
        analysisText: explanation,
        timeMs
      };
    }, timeoutMs, 'Checkers8x8', difficulty);

  } catch (e) {
    if (e.message === 'TIMEOUT') {
      return {
        from: fallbackMove.from,
        move: fallbackMove.move,
        score: evalBefore,
        analysisText: "Timeout reached. Played random fallback move.",
        timeMs: Date.now() - startTime
      };
    }
    throw e;
  }
};
