
import { selectMove as unbeatableSelectMove } from './UnbeatableAI.js';

// Backward compatibility wrapper, forwarding everything to UnbeatableAI.js
export const evaluatePosition = (board, isP1) => {
  // Can delegate if needed, but not primarily used outside UnbeatableAI now.
  return 0; 
};

export const getMovePriority = (move) => {
  return 0;
};

export const minimax = (board, depth, alpha, beta, isMaximizing, player) => {
  return 0;
};

export const selectMove = async (board, difficulty = 'medium', timeLimit = 5000, player = 2) => {
  return await unbeatableSelectMove(board, difficulty, timeLimit, player);
};
