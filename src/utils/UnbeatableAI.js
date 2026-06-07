
import { getAllValidMoves, executeMove, isPlayer1, isKing } from '@/utils/CheckersGameLogic.js';

const endgameCache = new Map();

export const evaluatePosition = (board, isP1) => {
  let p1Score = 0;
  let p2Score = 0;
  let p1Pieces = 0;
  let p2Pieces = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p === 0) continue;
      
      const isP1Piece = isPlayer1(p);
      const isK = isKing(p);
      
      let val = isK ? 3 : 1;
      let posBonus = isK ? 0 : (isP1Piece ? (7 - r) * 0.05 : r * 0.05);
      
      const centerDist = Math.abs(r - 3.5) + Math.abs(c - 3.5);
      posBonus += (8 - centerDist) * 0.01;

      if (isP1Piece) {
        p1Score += val + posBonus;
        p1Pieces++;
      } else {
        p2Score += val + posBonus;
        p2Pieces++;
      }
    }
  }

  const totalPieces = p1Pieces + p2Pieces;
  const isEndgame = totalPieces <= 6;

  let score = p1Score - p2Score;

  if (p1Pieces === 0) score = -1000;
  if (p2Pieces === 0) score = 1000;

  return { score: isP1 ? score : -score, totalPieces, isEndgame };
};

export const getMoveScore = (board, r, c, move, player) => {
  let score = 0;
  if (move.isCapture) score += 10;
  
  const p = board[r][c];
  if (!isKing(p)) {
    if (player === 1 && move.toR === 0) score += 5;
    if (player === 2 && move.toR === 7) score += 5;
  }
  return score;
};

export const getValidMovesWithScores = (board, player) => {
  const movesMap = getAllValidMoves(board, player);
  const scoredMoves = [];
  
  movesMap.forEach((moves, pos) => {
    const [r, c] = pos.split(',').map(Number);
    moves.forEach(move => {
      scoredMoves.push({
        fromR: r,
        fromC: c,
        move,
        score: getMoveScore(board, r, c, move, player)
      });
    });
  });
  
  return scoredMoves.sort((a, b) => b.score - a.score);
};

const boardToString = (board, player) => {
  return board.map(row => row.join('')).join('') + player;
};

const minimax = (board, depth, alpha, beta, isMaximizing, player, totalPieces) => {
  const cacheKey = totalPieces <= 6 ? boardToString(board, player) + depth : null;
  if (cacheKey && endgameCache.has(cacheKey)) {
    return endgameCache.get(cacheKey);
  }

  const evalResult = evaluatePosition(board, player === 1);
  
  if (Math.abs(evalResult.score) >= 900 || depth === 0) {
    if (cacheKey) endgameCache.set(cacheKey, evalResult.score);
    return evalResult.score;
  }

  const movesMap = getAllValidMoves(board, player);
  if (movesMap.size === 0) {
    const lossScore = isMaximizing ? -1000 : 1000;
    if (cacheKey) endgameCache.set(cacheKey, lossScore);
    return lossScore;
  }

  let bestScore = isMaximizing ? -Infinity : Infinity;
  const scoredMoves = getValidMovesWithScores(board, player);

  for (const m of scoredMoves) {
    const { newBoard } = executeMove(board, {r: m.fromR, c: m.fromC}, m.move, player);
    const score = minimax(newBoard, depth - 1, alpha, beta, !isMaximizing, player === 1 ? 2 : 1, evalResult.totalPieces);

    if (isMaximizing) {
      bestScore = Math.max(bestScore, score);
      alpha = Math.max(alpha, score);
    } else {
      bestScore = Math.min(bestScore, score);
      beta = Math.min(beta, score);
    }
    if (beta <= alpha) break;
  }

  if (cacheKey) endgameCache.set(cacheKey, bestScore);
  return bestScore;
};

export const selectMove = async (board, difficulty = 'medium', timeLimit = 5000, player = 2) => {
  const startTime = Date.now();
  const scoredMoves = getValidMovesWithScores(board, player);
  
  if (scoredMoves.length === 0) return null;

  if (difficulty === 'easy') {
    await new Promise(res => setTimeout(res, 300));
    return scoredMoves[Math.floor(Math.random() * scoredMoves.length)];
  }

  let baseDepth = 4;
  if (difficulty === 'hard') baseDepth = 6;
  if (difficulty === 'impossible') baseDepth = 8;

  const currentEval = evaluatePosition(board, player === 1);
  if (currentEval.isEndgame) {
    baseDepth += 2;
  }

  let bestMove = null;
  let bestScore = -Infinity;

  await new Promise(res => setTimeout(res, 0));

  for (const m of scoredMoves) {
    if (Date.now() - startTime > timeLimit) break;

    const { newBoard } = executeMove(board, {r: m.fromR, c: m.fromC}, m.move, player);
    const score = minimax(newBoard, baseDepth - 1, -Infinity, Infinity, false, player === 1 ? 2 : 1, currentEval.totalPieces);

    if (score > bestScore || bestMove === null) {
      bestScore = score;
      bestMove = m;
    }

    if (Date.now() - startTime > 50) {
      await new Promise(res => setTimeout(res, 0));
    }
  }

  return bestMove || scoredMoves[0];
};
