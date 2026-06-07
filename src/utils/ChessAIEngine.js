
import { getValidMoves, executeMove, isWhite, isBlack, getGameStatus } from './ChessGameLogic.js';
import { AIEngineBase } from './AIEngineBase.js';
import { AILogger, logAIMove, getDifficultyTimeout, executeWithTimeout } from './AILogger.js';

const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

const PST = {
  p: [
    [0,  0,  0,  0,  0,  0,  0,  0], [50, 50, 50, 50, 50, 50, 50, 50], [10, 10, 20, 30, 30, 20, 10, 10], [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0], [5, -5,-10,  0,  0,-10, -5,  5], [5, 10, 10,-20,-20, 10, 10,  5], [0,  0,  0,  0,  0,  0,  0,  0]
  ],
  n: [
    [-50,-40,-30,-30,-30,-30,-40,-50], [-40,-20,  0,  0,  0,  0,-20,-40], [-30,  0, 10, 15, 15, 10,  0,-30], [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30], [-30,  5, 10, 15, 15, 10,  5,-30], [-40,-20,  0,  5,  5,  0,-20,-40], [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  center: [
    [-20,-10,-10,-10,-10,-10,-10,-20], [-10,  0,  0,  0,  0,  0,  0,-10], [-10,  0,  5, 10, 10,  5,  0,-10], [-10,  0, 10, 20, 20, 10,  0,-10],
    [-10,  0, 10, 20, 20, 10,  0,-10], [-10,  0,  5, 10, 10,  5,  0,-10], [-10,  0,  0,  0,  0,  0,  0,-10], [-20,-10,-10,-10,-10,-10,-10,-20]
  ]
};

const evaluatePosition = (state) => {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = state.board[r][c];
      if (!piece) continue;
      const isW = isWhite(piece);
      const type = piece.toLowerCase();
      let val = PIECE_VALUES[type] || 0;
      
      if (type === 'p') val += PST.p[isW ? r : 7-r][c];
      else if (type === 'n') val += PST.n[isW ? r : 7-r][c];
      else val += PST.center[isW ? r : 7-r][c];

      score += isW ? val : -val;
    }
  }
  return score / 100.0;
};

const isStrictlyLegal = (state, move) => {
  try {
    const nextState = executeMove(state, move.fromR, move.fromC, move.r, move.c, move);
    const reverseStatus = getGameStatus(nextState, state.turnWhite);
    if (reverseStatus.status === 'check' || reverseStatus.status === 'checkmate') return false;
    
    if (move.castle) {
      const intermediateCol = move.c > move.fromC ? move.fromC + 1 : move.fromC - 1;
      const intermediateState = executeMove(state, move.fromR, move.fromC, move.fromR, intermediateCol, { ...move, castle: false, r: move.fromR, c: intermediateCol });
      const intStatus = getGameStatus(intermediateState, state.turnWhite);
      if (intStatus.status === 'check' || intStatus.status === 'checkmate') return false;
    }
    return true;
  } catch(e) {
    return false;
  }
};

const getAllLegalMoves = (state) => {
  const moves = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = state.board[r][c];
      if (piece && ((state.turnWhite && isWhite(piece)) || (!state.turnWhite && isBlack(piece)))) {
        const rawMoves = getValidMoves(state, r, c);
        for (const rm of rawMoves) {
          if (isStrictlyLegal(state, rm)) moves.push(rm);
        }
      }
    }
  }
  return moves.sort((a, b) => (b.capture ? 1 : 0) - (a.capture ? 1 : 0));
};

export const calculateBestChessMove = async (state, isWhiteTurn, difficulty = 'hard') => {
  const startTime = Date.now();
  const timeoutMs = getDifficultyTimeout(difficulty);
  const config = AIEngineBase.getDifficultyConfig(difficulty);
  const legalMoves = getAllLegalMoves(state);
  
  if (legalMoves.length === 0) return null;

  const fallbackMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
  const evalBefore = evaluatePosition(state) * (isWhiteTurn ? 1 : -1);

  try {
    if (Math.random() < config.randomness) {
      const moveStr = `${fallbackMove.fromR},${fallbackMove.fromC}->${fallbackMove.r},${fallbackMove.c}`;
      await logAIMove({
        game: 'Chess',
        level: difficulty,
        depth: 0,
        eval: evalBefore,
        evalBefore: evalBefore,
        time: Date.now() - startTime,
        move: moveStr
      });
      return { move: fallbackMove, score: evalBefore };
    }

    return await executeWithTimeout(async () => {
      let bestScore = isWhiteTurn ? -Infinity : Infinity;
      let bestMove = fallbackMove;
      let nodes = 0;

      const minimax = async (currState, depth, alpha, beta, isMax) => {
        nodes++;
        if (nodes % 500 === 0) await new Promise(r => setTimeout(r, 0));
        
        if (depth === 0) return evaluatePosition(currState);

        const moves = getAllLegalMoves(currState);
        if (moves.length === 0) return isMax ? -20000 : 20000;

        if (isMax) {
          let maxEval = -Infinity;
          for (const move of moves) {
            const nextState = executeMove(currState, move.fromR, move.fromC, move.r, move.c, move);
            const ev = await minimax(nextState, depth - 1, alpha, beta, false);
            maxEval = Math.max(maxEval, ev);
            alpha = Math.max(alpha, ev);
            if (beta <= alpha) break;
          }
          return maxEval;
        } else {
          let minEval = Infinity;
          for (const move of moves) {
            const nextState = executeMove(currState, move.fromR, move.fromC, move.r, move.c, move);
            const ev = await minimax(nextState, depth - 1, alpha, beta, true);
            minEval = Math.min(minEval, ev);
            beta = Math.min(beta, ev);
            if (beta <= alpha) break;
          }
          return minEval;
        }
      };

      for (const move of legalMoves) {
        const nextState = executeMove(state, move.fromR, move.fromC, move.r, move.c, move);
        const currentMoveScore = await minimax(nextState, config.depth - 1, -Infinity, Infinity, !isWhiteTurn);
        
        if (isWhiteTurn) {
          if (currentMoveScore > bestScore) { bestScore = currentMoveScore; bestMove = move; }
        } else {
          if (currentMoveScore < bestScore) { bestScore = currentMoveScore; bestMove = move; }
        }
      }
      
      const timeMs = Date.now() - startTime;
      const evalScore = bestScore * (isWhiteTurn ? 1 : -1);
      const metrics = { depth: config.depth, score: bestScore, nodes: nodes || 1, timeMs };
      const explanation = AILogger.generateExplanation('Chess', evalScore, metrics);
      
      const moveStr = `${bestMove.fromR},${bestMove.fromC}->${bestMove.r},${bestMove.c}`;
      
      await logAIMove({
        game: 'Chess',
        level: difficulty,
        depth: config.depth,
        eval: evalScore,
        evalBefore: evalBefore,
        time: timeMs,
        move: moveStr
      });

      return {
        move: {
          from: { r: bestMove.fromR, c: bestMove.fromC },
          to: { r: bestMove.r, c: bestMove.c },
          capture: bestMove.capture,
          promotion: bestMove.promotion,
          castle: bestMove.castle
        },
        analysisText: explanation,
        score: bestScore,
        timeMs
      };
    }, timeoutMs, 'Chess', difficulty);

  } catch (e) {
    if (e.message === 'TIMEOUT') {
      const moveStr = `${fallbackMove.fromR},${fallbackMove.fromC}->${fallbackMove.r},${fallbackMove.c}`;
      return {
        move: {
          from: { r: fallbackMove.fromR, c: fallbackMove.fromC },
          to: { r: fallbackMove.r, c: fallbackMove.c },
          capture: fallbackMove.capture,
          promotion: fallbackMove.promotion,
          castle: fallbackMove.castle
        },
        analysisText: "Timeout reached. Played random fallback move.",
        score: evalBefore,
        timeMs: Date.now() - startTime
      };
    }
    throw e;
  }
};
