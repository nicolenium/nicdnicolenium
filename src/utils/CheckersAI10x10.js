
import { getValidMoves10x10, executeMove10x10, checkGameStatus10x10 } from './CheckersGameLogic10x10.js';

const evaluatePosition10x10 = (board, player) => {
  let score = 0;
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const piece = board[r][c];
      if (piece) {
        let value = piece.isKing ? 30 : 10;
        // Positional advantage: closer to promotion is better
        if (!piece.isKing) {
          if (piece.player === 1) value += (9 - r);
          if (piece.player === 2) value += r;
        }
        // Center control bonus
        if (c >= 3 && c <= 6 && r >= 3 && r <= 6) {
          value += 2;
        }
        
        if (piece.player === player) {
          score += value;
        } else {
          score -= value;
        }
      }
    }
  }
  return score;
};

const yieldThread = () => new Promise(r => setTimeout(r, 0));

const minimax10x10 = async (board, depth, alpha, beta, isMaximizing, player, opponent, startTime, timeLimit) => {
  if (Date.now() - startTime > timeLimit) return evaluatePosition10x10(board, player);

  const status = checkGameStatus10x10(board, isMaximizing ? player : opponent);
  if (status.status === 'won') {
    return status.winner === player ? 10000 + depth : -10000 - depth;
  }
  if (depth === 0) {
    return evaluatePosition10x10(board, player);
  }

  const moves = getValidMoves10x10(board, isMaximizing ? player : opponent);
  if (moves.length === 0) {
    return isMaximizing ? -10000 : 10000;
  }
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      if (Date.now() - startTime > timeLimit) return maxEval === -Infinity ? evaluatePosition10x10(board, player) : maxEval;
      const { newBoard } = executeMove10x10(board, move);
      const ev = await minimax10x10(newBoard, depth - 1, alpha, beta, false, player, opponent, startTime, timeLimit);
      maxEval = Math.max(maxEval, ev);
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      if (Date.now() - startTime > timeLimit) return minEval === Infinity ? evaluatePosition10x10(board, player) : minEval;
      const { newBoard } = executeMove10x10(board, move);
      const ev = await minimax10x10(newBoard, depth - 1, alpha, beta, true, player, opponent, startTime, timeLimit);
      minEval = Math.min(minEval, ev);
      beta = Math.min(beta, ev);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

export const getAIMove10x10 = async (board, player, difficulty, timeLimitSeconds = 600) => {
  const startTime = Date.now();
  const moves = getValidMoves10x10(board, player);
  
  if (moves.length === 0) return null;

  if (moves.length === 1) {
    await new Promise(r => setTimeout(r, 600));
    return moves[0];
  }

  if (difficulty === 'easy') {
    await new Promise(r => setTimeout(r, 1000));
    const captures = moves.filter(m => m.captured && m.captured.length > 0);
    if (captures.length > 0 && Math.random() > 0.3) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    return moves[Math.floor(Math.random() * moves.length)];
  }

  let depth = 2;
  let maxTimeMs = 2000;
  
  if (difficulty === 'hard') { depth = 4; maxTimeMs = 4000; }
  if (difficulty === 'impossible') { depth = 5; maxTimeMs = 5000; }

  // Adjust if real game timer is running low
  if (timeLimitSeconds > 0 && timeLimitSeconds < 30) { depth = 2; maxTimeMs = 1000; }

  let bestMove = moves[0];
  let bestValue = -Infinity;
  const opponent = player === 1 ? 2 : 1;

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    if (i % 2 === 0) await yieldThread();

    const { newBoard } = executeMove10x10(board, move);
    const moveValue = await minimax10x10(newBoard, depth - 1, -Infinity, Infinity, false, player, opponent, startTime, maxTimeMs);
    
    const noise = Math.random() * 0.1;
    if (moveValue + noise > bestValue) {
      bestValue = moveValue + noise;
      bestMove = move;
    }

    if (Date.now() - startTime > maxTimeMs) break;
  }

  const elapsed = Date.now() - startTime;
  if (elapsed < 1000) await new Promise(r => setTimeout(r, 1000 - elapsed));

  return bestMove;
};
