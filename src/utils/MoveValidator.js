
/**
 * Unified Move Validation System
 * Ensures all moves are legal before state updates across all games.
 */
export const MoveValidator = {
  validateTicTacToeMove: (board, index) => {
    if (index < 0 || index > 8) return { valid: false, error: 'Out of bounds' };
    if (board[index] !== null) return { valid: false, error: 'Square already occupied' };
    return { valid: true };
  },

  validateConnectFourMove: (board, col) => {
    if (col < 0 || col > 6) return { valid: false, error: 'Column out of bounds' };
    if (board[0][col] !== null) return { valid: false, error: 'Column is full' };
    return { valid: true };
  },

  validateChessMove: (validMoves, targetR, targetC) => {
    const move = validMoves.find(m => m.r === targetR && m.c === targetC);
    if (!move) return { valid: false, error: 'Illegal chess move' };
    return { valid: true, move };
  },

  validateCheckers8x8Move: (validMoves, targetR, targetC) => {
    const move = validMoves.find(m => m.toR === targetR && m.toC === targetC);
    if (!move) return { valid: false, error: 'Illegal checkers move' };
    return { valid: true, move };
  },

  validateCheckers10x10Move: (validMoves, targetR, targetC) => {
    const move = validMoves.find(m => m.to.r === targetR && m.to.c === targetC);
    if (!move) return { valid: false, error: 'Illegal checkers move' };
    return { valid: true, move };
  },

  validateDominoMove: (tile, boardEnds) => {
    if (boardEnds.length === 0) return { valid: true }; // First move
    if (!tile.includes(boardEnds[0]) && !tile.includes(boardEnds[1])) {
      return { valid: false, error: 'Tile does not match board ends' };
    }
    return { valid: true };
  },

  validateLudoMove: (validPieces, pieceIndex) => {
    if (!validPieces.includes(pieceIndex)) {
      return { valid: false, error: 'Piece cannot be moved with current dice roll' };
    }
    return { valid: true };
  }
};
