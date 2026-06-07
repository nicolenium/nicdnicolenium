
import { AIEngineBase } from './AIEngineBase.js';

export const createInitialConnectFourBoard = () => Array(6).fill(null).map(() => Array(7).fill(null));

export const getValidColumns = (board) => {
  const cols = [];
  for (let c = 0; c < 7; c++) if (board[0][c] === null) cols.push(c);
  return cols.sort((a, b) => Math.abs(a - 3) - Math.abs(b - 3));
};

export const dropPiece = (board, col, player) => {
  const newBoard = board.map(row => [...row]);
  for (let r = 5; r >= 0; r--) {
    if (newBoard[r][col] === null) {
      newBoard[r][col] = player;
      return { newBoard, row: r };
    }
  }
  return { newBoard, row: -1 };
};

export const checkConnectFourWin = (board, r, c, player) => {
  const check = (dr, dc) => {
    let count = 0;
    for (let i = -3; i <= 3; i++) {
      const nr = r + i * dr, nc = c + i * dc;
      if (nr >= 0 && nr < 6 && nc >= 0 && nc < 7 && board[nr][nc] === player) {
        count++;
        if (count >= 4) return true;
      } else { count = 0; }
    }
    return false;
  };
  return check(0,1) || check(1,0) || check(1,1) || check(1,-1);
};

export const isConnectFourDraw = (board) => board[0].every(c => c !== null);

const evaluateC4 = (board, player) => {
  let score = 0;
  const opp = player === 1 ? 2 : 1;
  const evWindow = (w) => {
    const p = w.filter(c=>c===player).length;
    const o = w.filter(c=>c===opp).length;
    const e = w.filter(c=>c===null).length;
    if (p===4) return 1000;
    if (p===3 && e===1) return 50;
    if (p===2 && e===2) return 10;
    if (o===3 && e===1) return -80;
    return 0;
  };
  
  for(let r=0; r<6; r++) for(let c=0; c<4; c++) score += evWindow([board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]]);
  for(let c=0; c<7; c++) for(let r=0; r<3; r++) score += evWindow([board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]]);
  for(let r=0; r<3; r++) for(let c=0; c<4; c++) {
    score += evWindow([board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]]);
    score += evWindow([board[r+3][c], board[r+2][c+1], board[r+1][c+2], board[r][c+3]]);
  }
  return score;
};

export const getConnectFourAIMove = async (board, player, difficulty = 'hard') => {
  const config = AIEngineBase.getDifficultyConfig(difficulty);
  const cols = getValidColumns(board);
  if (cols.length === 0) return null;

  if (Math.random() < config.randomness) {
    return cols[Math.floor(Math.random() * cols.length)];
  }

  const minimax = (b, depth, alpha, beta, isMax, currP) => {
    if (depth === 0) return evaluateC4(b, player);
    const valid = getValidColumns(b);
    if (valid.length === 0) return 0;

    for (let c of valid) {
      const { newBoard, row } = dropPiece(b, c, currP);
      if (checkConnectFourWin(newBoard, row, c, currP)) return isMax ? 10000 + depth : -10000 - depth;
    }

    if (isMax) {
      let maxEv = -Infinity;
      for (let c of valid) {
        const { newBoard } = dropPiece(b, c, currP);
        maxEv = Math.max(maxEv, minimax(newBoard, depth - 1, alpha, beta, false, currP === 1 ? 2 : 1));
        alpha = Math.max(alpha, maxEv);
        if (beta <= alpha) break;
      }
      return maxEv;
    } else {
      let minEv = Infinity;
      for (let c of valid) {
        const { newBoard } = dropPiece(b, c, currP);
        minEv = Math.min(minEv, minimax(newBoard, depth - 1, alpha, beta, true, currP === 1 ? 2 : 1));
        beta = Math.min(beta, minEv);
        if (beta <= alpha) break;
      }
      return minEv;
    }
  };

  let bestScore = -Infinity;
  let bestCol = cols[0];

  for (let c of cols) {
    const { newBoard, row } = dropPiece(board, c, player);
    if (checkConnectFourWin(newBoard, row, c, player)) return c;
    const score = minimax(newBoard, config.depth - 1, -Infinity, Infinity, false, player === 1 ? 2 : 1);
    if (score > bestScore) {
      bestScore = score;
      bestCol = c;
    }
  }
  return bestCol;
};
