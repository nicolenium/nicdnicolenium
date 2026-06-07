
import { AIEngineBase } from './AIEngineBase.js';

export const checkWinDetails = (squares) => {
  const lines = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c], winningLine: [a, b, c] };
    }
  }
  return null;
};

export const checkWin = (squares) => checkWinDetails(squares)?.winner || null;
export const isBoardFull = (squares) => squares.every(Boolean);
export const isDraw = (squares) => !checkWin(squares) && isBoardFull(squares);

export const getTicTacToeAIMove = async (board, aiPlayer, difficulty = 'hard') => {
  const config = AIEngineBase.getDifficultyConfig(difficulty);
  const opponent = aiPlayer === 'X' ? 'O' : 'X';
  const available = board.map((s, i) => s === null ? i : null).filter(s => s !== null);
  
  if (available.length === 0) return null;

  // Prevent center taking bug implicitly by searching depth 9 full tree for hard+
  if (Math.random() < config.randomness) {
    return available[Math.floor(Math.random() * available.length)];
  }

  const minimax = (b, depth, isMax) => {
    const winner = checkWin(b);
    if (winner === aiPlayer) return 10 - depth;
    if (winner === opponent) return depth - 10;
    if (isBoardFull(b)) return 0;

    if (isMax) {
      let max = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!b[i]) {
          b[i] = aiPlayer;
          max = Math.max(max, minimax(b, depth + 1, false));
          b[i] = null;
        }
      }
      return max;
    } else {
      let min = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!b[i]) {
          b[i] = opponent;
          min = Math.min(min, minimax(b, depth + 1, true));
          b[i] = null;
        }
      }
      return min;
    }
  };

  let bestScore = -Infinity;
  let bestMove = available[0];

  for (let i of available) {
    board[i] = aiPlayer;
    let score = minimax(board, 0, false);
    board[i] = null;
    
    if (score > bestScore || (score === bestScore && Math.random() > 0.5)) {
      bestScore = score;
      bestMove = i;
    }
  }
  
  await new Promise(r => setTimeout(r, 400)); // Natural delay
  return bestMove;
};

export const calculatePerfectTicTacToeMove = async (board, aiPlayer, difficulty) => {
  const move = await getTicTacToeAIMove(board, aiPlayer, difficulty);
  return { move, score: 0, analysisText: "Optimal calculated move." };
};
