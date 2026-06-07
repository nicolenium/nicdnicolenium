
import { GameRules } from './GameRules.js';

export const GameAI = {
  ticTacToe: {
    getBestMove: (board, player) => {
      // Simple random move for effort 0.25
      const available = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
      if (available.length === 0) return null;
      return available[Math.floor(Math.random() * available.length)];
    }
  },
  connectFour: {
    getBestMove: (board) => {
      const availableCols = [];
      for (let c = 0; c < board[0].length; c++) {
        if (GameRules.connectFour.isValidMove(board, c)) availableCols.push(c);
      }
      if (availableCols.length === 0) return null;
      return availableCols[Math.floor(Math.random() * availableCols.length)];
    }
  },
  ludo: {
    getBestMove: (pieces, diceRoll) => {
      // Pick first movable piece
      const movable = pieces.findIndex(p => 
        (p.pos === 0 && diceRoll === 6) || 
        (p.pos > 0 && GameRules.ludo.isValidMove(p.pos, diceRoll))
      );
      return movable !== -1 ? movable : null;
    }
  }
};
