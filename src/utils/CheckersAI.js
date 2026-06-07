
import { getAllValidMoves, executeMove, isPlayer1, isPlayer2, isKing } from '@/utils/CheckersGameLogic.js';

export const getCheckersAIOptions = (player, opponent, timeLimit) => {
  return {
    player,
    opponent,
    timeLimit,
    getMoves: (board, p) => {
      const movesMap = getAllValidMoves(board, p);
      const allMoves = [];
      movesMap.forEach((moves, pos) => {
        const [r, c] = pos.split(',').map(Number);
        moves.forEach(move => allMoves.push({ fromR: r, fromC: c, move }));
      });
      return allMoves;
    },
    executeMove: (board, fullMove, p) => {
      return executeMove(board, { r: fullMove.fromR, c: fullMove.fromC }, fullMove.move, p).newBoard;
    },
    isTerminal: (board) => {
      let p1HasMoves = false;
      let p2HasMoves = false;
      
      const p1Map = getAllValidMoves(board, 1);
      const p2Map = getAllValidMoves(board, 2);
      
      p1Map.forEach((m) => { if (m.length > 0) p1HasMoves = true; });
      p2Map.forEach((m) => { if (m.length > 0) p2HasMoves = true; });
      
      return !p1HasMoves || !p2HasMoves;
    },
    evaluate: (board, p, opp) => {
      let score = 0;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const piece = board[r][c];
          if (piece === 0) continue;

          const isP1 = isPlayer1(piece);
          const isK = isKing(piece);
          
          // Material
          let val = isK ? 30 : 10;
          
          // Positional: advancement
          if (!isK) {
            if (isP1) val += (7 - r);
            else val += r;
          }
          
          // Center control
          if (r >= 2 && r <= 5 && c >= 2 && c <= 5) val += 2;

          if (isP1) score += val;
          else score -= val;
        }
      }
      return p === 1 ? score : -score;
    },
    sortMoves: (moves) => {
      // Prioritize captures
      moves.sort((a, b) => {
        const aCap = a.move.isCapture ? 1 : 0;
        const bCap = b.move.isCapture ? 1 : 0;
        return bCap - aCap;
      });
    }
  };
};
