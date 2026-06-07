
import { getValidMoves10x10, executeMove10x10, checkGameStatus10x10 } from './CheckersGameLogic10x10.js';

class CheckersAIEngine {
  constructor() {
    this.isThinking = false;
    this.shouldCancel = false;
  }

  async yieldThread() {
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  cancel() {
    this.shouldCancel = true;
    this.isThinking = false;
  }

  evaluatePosition(board, player) {
    let score = 0;
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        const piece = board[r][c];
        if (piece) {
          let value = piece.isKing ? 30 : 10;
          
          // Positional advantage: closer to promotion is better
          if (!piece.isKing) {
            if (piece.player === 1) value += (9 - r) * 0.5;
            if (piece.player === 2) value += r * 0.5;
          }
          
          // Center control bonus
          if (c >= 3 && c <= 6 && r >= 3 && r <= 6) {
            value += 2;
          }
          
          // King safety / centralization
          if (piece.isKing) {
            const centerDist = Math.abs(r - 4.5) + Math.abs(c - 4.5);
            value += (10 - centerDist) * 0.2;
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
  }

  async minimax(board, depth, alpha, beta, isMaximizing, player, opponent, startTime, timeLimit, nodeCount) {
    if (this.shouldCancel || Date.now() - startTime > timeLimit) {
      return this.evaluatePosition(board, player);
    }

    if (nodeCount.count++ % 50 === 0) await this.yieldThread();

    const status = checkGameStatus10x10(board, isMaximizing ? player : opponent);
    if (status.status === 'won') {
      return status.winner === player ? 10000 + depth : -10000 - depth;
    }
    if (status.status === 'draw') return 0;
    
    if (depth === 0) {
      return this.evaluatePosition(board, player);
    }

    const moves = getValidMoves10x10(board, isMaximizing ? player : opponent);
    if (moves.length === 0) {
      return isMaximizing ? -10000 : 10000;
    }

    // Sort moves to improve alpha-beta pruning (captures first)
    moves.sort((a, b) => {
      const aCap = (a.captured && a.captured.length > 0) ? a.captured.length : 0;
      const bCap = (b.captured && b.captured.length > 0) ? b.captured.length : 0;
      return bCap - aCap;
    });
    
    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        const { newBoard } = executeMove10x10(board, move);
        const ev = await this.minimax(newBoard, depth - 1, alpha, beta, false, player, opponent, startTime, timeLimit, nodeCount);
        maxEval = Math.max(maxEval, ev);
        alpha = Math.max(alpha, ev);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        const { newBoard } = executeMove10x10(board, move);
        const ev = await this.minimax(newBoard, depth - 1, alpha, beta, true, player, opponent, startTime, timeLimit, nodeCount);
        minEval = Math.min(minEval, ev);
        beta = Math.min(beta, ev);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  async calculateMove(board, player, difficulty, timeLimitMs = 10000, restrictedPiece = null) {
    this.isThinking = true;
    this.shouldCancel = false;
    const startTime = Date.now();
    const nodeCount = { count: 0 };

    const moves = getValidMoves10x10(board, player, restrictedPiece);
    if (moves.length === 0) {
      this.isThinking = false;
      return null;
    }

    if (moves.length === 1) {
      await new Promise(r => setTimeout(r, 500)); // Natural delay
      this.isThinking = false;
      return moves[0];
    }

    if (difficulty === 'easy') {
      await new Promise(r => setTimeout(r, 800));
      this.isThinking = false;
      const captures = moves.filter(m => m.captured && m.captured.length > 0);
      if (captures.length > 0 && Math.random() > 0.2) {
        return captures[Math.floor(Math.random() * captures.length)];
      }
      return moves[Math.floor(Math.random() * moves.length)];
    }

    let depth = 4; // Medium
    if (difficulty === 'hard') depth = 6;
    if (difficulty === 'impossible') depth = 8;

    // Adjust depth if time is extremely short
    if (timeLimitMs < 2000) depth = Math.min(depth, 4);

    let bestMove = moves[0];
    let bestValue = -Infinity;
    const opponent = player === 1 ? 2 : 1;

    // Root level sorting
    moves.sort((a, b) => {
      const aCap = (a.captured && a.captured.length > 0) ? a.captured.length : 0;
      const bCap = (b.captured && b.captured.length > 0) ? b.captured.length : 0;
      return bCap - aCap;
    });

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const { newBoard } = executeMove10x10(board, move);
      
      const moveValue = await this.minimax(newBoard, depth - 1, -Infinity, Infinity, false, player, opponent, startTime, timeLimitMs, nodeCount);
      
      // Add tiny noise to break ties randomly
      const noise = Math.random() * 0.1;
      if (moveValue + noise > bestValue) {
        bestValue = moveValue + noise;
        bestMove = move;
      }

      if (this.shouldCancel || Date.now() - startTime > timeLimitMs) break;
    }

    const elapsed = Date.now() - startTime;
    if (elapsed < 500 && !this.shouldCancel) {
      await new Promise(r => setTimeout(r, 500 - elapsed));
    }

    this.isThinking = false;
    return bestMove;
  }
}

export const checkersAIEngine = new CheckersAIEngine();
