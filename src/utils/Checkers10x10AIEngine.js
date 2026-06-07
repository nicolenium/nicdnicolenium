
import { getValidMoves10x10, executeMove10x10, checkGameStatus10x10 } from './CheckersGameLogic10x10.js';

const evaluatePosition10x10 = (board, player) => {
  let score = 0;
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const piece = board[r][c];
      if (piece) {
        let value = piece.isKing ? 30 : 10;
        // Positional advantage
        if (!piece.isKing) {
          if (piece.player === 1) value += (9 - r) * 0.5;
          if (piece.player === 2) value += r * 0.5;
        }
        // Center control
        if (c >= 3 && c <= 6 && r >= 3 && r <= 6) {
          value += 2;
        }
        
        if (piece.player === player) score += value;
        else score -= value;
      }
    }
  }
  return score;
};

const yieldThread = () => new Promise(r => setTimeout(r, 0));

export async function getBestMove(board, difficulty = 'medium', timeLimitMs = 1000, player = 2) {
  const startTime = Date.now();
  let nodes = 0;
  const opponent = player === 1 ? 2 : 1;

  let maxDepth = 2;
  let allocatedTime = 500;
  
  if (difficulty === 'easy') { maxDepth = 2; allocatedTime = 500; }
  else if (difficulty === 'medium') { maxDepth = 4; allocatedTime = 1000; }
  else if (difficulty === 'hard') { maxDepth = 6; allocatedTime = 2000; }
  else if (difficulty === 'expert') { maxDepth = 8; allocatedTime = 4000; }

  const moves = getValidMoves10x10(board, player);
  if (moves.length === 0) return null;

  if (moves.length === 1) return { move: moves[0], score: 0, depth: 1, timeMs: 0, nodes: 0, explanation: "Forced capture." };

  const minimax = async (currBoard, depth, alpha, beta, isMax, currPlayer) => {
    nodes++;
    if (nodes % 1000 === 0) await yieldThread();
    if (Date.now() - startTime > allocatedTime) throw new Error("TIMEOUT");

    const status = checkGameStatus10x10(currBoard, currPlayer);
    if (status.status === 'won') {
      if (status.winner === player) return 10000 + depth;
      else if (status.winner === opponent) return -10000 - depth;
      return 0; 
    }

    if (depth === 0) return evaluatePosition10x10(currBoard, player);

    let nextMoves = getValidMoves10x10(currBoard, currPlayer);

    if (isMax) {
      let maxEval = -Infinity;
      for (const m of nextMoves) {
        const { newBoard } = executeMove10x10(currBoard, m);
        const ev = await minimax(newBoard, depth - 1, alpha, beta, false, opponent);
        maxEval = Math.max(maxEval, ev);
        alpha = Math.max(alpha, ev);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const m of nextMoves) {
        const { newBoard } = executeMove10x10(currBoard, m);
        const ev = await minimax(newBoard, depth - 1, alpha, beta, true, player);
        minEval = Math.min(minEval, ev);
        beta = Math.min(beta, ev);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  };

  let bestMove = moves[0];
  let bestScore = -Infinity;
  let currentDepth = 1;

  try {
    for (let d = 1; d <= maxDepth; d++) {
      currentDepth = d;
      let dBestScore = -Infinity;
      let dBestMove = moves[0];

      for (const m of moves) {
        const { newBoard } = executeMove10x10(board, m);
        const score = await minimax(newBoard, d - 1, -Infinity, Infinity, false, opponent);
        
        if (score > dBestScore) {
          dBestScore = score;
          dBestMove = m;
        }
      }
      bestScore = dBestScore;
      bestMove = dBestMove;
      
      if (bestScore > 9000) break; 
    }
  } catch (e) {
    if (e.message !== "TIMEOUT") console.error(e);
  }

  const timeSpent = Date.now() - startTime;
  if (timeSpent < 300) await new Promise(r => setTimeout(r, 300 - timeSpent));

  const explanation = bestMove.captured && bestMove.captured.length > 0 
    ? "Executing majority capture sequence." 
    : "Positional improvement.";

  return {
    move: bestMove,
    score: bestScore,
    depth: currentDepth,
    timeMs: timeSpent,
    nodes,
    explanation,
    log: { depth: currentDepth, eval: bestScore, nodesSearched: nodes, time: timeSpent }
  };
}
