
import { getAllValidMoves, executeMove, isPlayer1, isPlayer2, isKing, getGameStatus } from './CheckersGameLogic.js';

const evaluateCheckersPosition = (board, player) => {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece === 0) continue;

      const isP1 = isPlayer1(piece);
      const isK = isKing(piece);
      
      let val = isK ? 30 : 10;
      
      if (!isK) {
        if (isP1) val += (7 - r);
        else val += r;
      }
      
      if (c === 0 || c === 7) val += 2; // Edge protection
      if (r >= 3 && r <= 4 && c >= 2 && c <= 5) val += 3; // Center control

      if (isP1) score += val;
      else score -= val;
    }
  }
  return player === 1 ? score : -score;
};

const yieldThread = () => new Promise(r => setTimeout(r, 0));

export async function getBestMove(board, difficulty = 'medium', timeLimitMs = 1000, player = 2) {
  const startTime = Date.now();
  let nodes = 0;
  const opponent = player === 1 ? 2 : 1;

  let maxDepth = 2;
  let allocatedTime = 500;
  
  if (difficulty === 'easy') { maxDepth = 3; allocatedTime = 500; }
  else if (difficulty === 'medium') { maxDepth = 6; allocatedTime = 1000; }
  else if (difficulty === 'hard') { maxDepth = 8; allocatedTime = 2000; }
  else if (difficulty === 'expert') { maxDepth = 10; allocatedTime = 4000; }

  const movesMap = getAllValidMoves(board, player);
  if (movesMap.size === 0) return null;

  let allMoves = [];
  for (const [fromKey, moves] of movesMap.entries()) {
    const [r, c] = fromKey.split(',').map(Number);
    moves.forEach(m => allMoves.push({ from: { r, c }, move: m }));
  }

  // Force capture order
  allMoves.sort((a, b) => {
    const aCap = a.move.isCapture ? a.move.capturedPieces.length : 0;
    const bCap = b.move.isCapture ? b.move.capturedPieces.length : 0;
    return bCap - aCap;
  });

  if (allMoves.length === 1) return { move: allMoves[0], score: 0, depth: 1, timeMs: 0, nodes: 0, explanation: "Forced move." };
  
  if (difficulty === 'easy' && Math.random() < 0.4) {
    return { move: allMoves[Math.floor(Math.random() * allMoves.length)], explanation: "Random move for easy difficulty." };
  }

  const minimax = async (currBoard, depth, alpha, beta, isMax, currPlayer) => {
    nodes++;
    if (nodes % 1000 === 0) await yieldThread();
    if (Date.now() - startTime > allocatedTime) throw new Error("TIMEOUT");

    const status = getGameStatus(currBoard, currPlayer);
    if (status.status !== 'in_progress') {
      if (status.winner === player) return 10000 + depth;
      else if (status.winner === opponent) return -10000 - depth;
      return 0; // draw
    }

    if (depth === 0) return evaluateCheckersPosition(currBoard, player);

    const mmMap = getAllValidMoves(currBoard, currPlayer);
    let nextMoves = [];
    for (const [fKey, mArr] of mmMap.entries()) {
      const [rr, cc] = fKey.split(',').map(Number);
      mArr.forEach(m => nextMoves.push({ from: { r: rr, c: cc }, move: m }));
    }

    nextMoves.sort((a, b) => (b.move.isCapture ? b.move.capturedPieces.length : 0) - (a.move.isCapture ? a.move.capturedPieces.length : 0));

    if (isMax) {
      let maxEval = -Infinity;
      for (const m of nextMoves) {
        const { newBoard } = executeMove(currBoard, m.from, m.move, currPlayer);
        const ev = await minimax(newBoard, depth - 1, alpha, beta, false, opponent);
        maxEval = Math.max(maxEval, ev);
        alpha = Math.max(alpha, ev);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const m of nextMoves) {
        const { newBoard } = executeMove(currBoard, m.from, m.move, currPlayer);
        const ev = await minimax(newBoard, depth - 1, alpha, beta, true, player);
        minEval = Math.min(minEval, ev);
        beta = Math.min(beta, ev);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  };

  let bestMove = allMoves[0];
  let bestScore = -Infinity;
  let currentDepth = 1;

  try {
    for (let d = 1; d <= maxDepth; d++) {
      currentDepth = d;
      let dBestScore = -Infinity;
      let dBestMove = allMoves[0];

      for (const m of allMoves) {
        const { newBoard } = executeMove(board, m.from, m.move, player);
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

  const explanation = bestMove.move.isCapture ? "Tactical sequence execution." : "Positional advancement.";

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
