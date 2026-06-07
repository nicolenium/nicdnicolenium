
/**
 * Advanced Minimax with Alpha-Beta Pruning, Iterative Deepening, 
 * Transposition Tables, Killer Moves, and History Heuristic.
 */
import { AIExplanationEngine } from '@/utils/AIExplanationEngine.js';

class TranspositionTable {
  constructor(maxSize = 2000000) {
    this.table = new Map();
    this.maxSize = maxSize;
  }
  
  store(hash, depth, score, flag, bestMove) {
    if (this.table.size > this.maxSize) this.table.clear(); 
    this.table.set(hash, { depth, score, flag, bestMove });
  }
  
  lookup(hash, depth, alpha, beta) {
    const entry = this.table.get(hash);
    if (!entry) return null;
    
    if (entry.depth >= depth) {
      if (entry.flag === 'EXACT') return { score: entry.score, bestMove: entry.bestMove };
      if (entry.flag === 'LOWERBOUND' && entry.score >= beta) return { score: entry.score, bestMove: entry.bestMove };
      if (entry.flag === 'UPPERBOUND' && entry.score <= alpha) return { score: entry.score, bestMove: entry.bestMove };
    }
    return { bestMove: entry.bestMove }; 
  }
  
  clear() {
    this.table.clear();
  }
}

export const GlobalTT = new TranspositionTable();

export const InfiniteKnowledge = {
  openings: {
    chess: { 
      'e2e4': "King's Pawn Opening. Controls the center, opens lines for the Queen and Bishop.",
      'd2d4': "Queen's Pawn Opening. Solid, strategic, controls d4 and e5.",
      'g1f3': "Zukertort Opening. Flexible, controls e5 and d4 without committing a central pawn.",
      'c2c4': "English Opening. Controls d5, leads to complex positional struggles."
    },
    tictactoe: { 
      4: 'Center square - optimal opening for maximum lines.', 
      0: 'Corner square - strong trap potential.' 
    }
  },
  analyzeMistake: (gameType, scoreDrop) => {
    if (scoreDrop > 300) return "Blunder: You just lost significant material or position.";
    if (scoreDrop > 100) return "Mistake: That move weakened your defense or missed a tactical opportunity.";
    if (scoreDrop > 50) return "Inaccuracy: There was a better positional move available.";
    return "Solid play, maintaining balance.";
  },
  getCoachingTip: (gameType, currentEvalScore) => {
    if (currentEvalScore < -200) return "Focus on solidifying your defense, king safety, and looking for counter-attacks.";
    if (currentEvalScore > 200) return "You have the advantage. Consolidate your position, control the center, and simplify the game.";
    return "The game is balanced. Fight for control of the center and develop your pieces strategically.";
  }
};

export const AdaptiveEngine = {
  getDynamicDepth: (baseDifficulty, timeRemainingMs = 60000) => {
    // Strict mapping as requested: Beginner(2) to Grand Master(8)
    const depthMap = {
      'beginner': 2, 
      'intermediate': 3, 
      'advanced': 4,
      'expert': 5, 
      'master': 6, 
      'world-class': 7, 
      'grandmaster': 8
    };
    let depth = depthMap[baseDifficulty] || 4;
    
    // Time management constraints (reduce depth if low on time, but keep minimums)
    if (timeRemainingMs < 5000) depth = Math.max(2, depth - 3);
    else if (timeRemainingMs < 15000) depth = Math.max(2, depth - 2);
    else if (timeRemainingMs < 30000) depth = Math.max(2, depth - 1);
    
    return depth;
  },
  getTimeLimit: (baseDifficulty) => {
    const timeMap = {
      'beginner': 500, 'intermediate': 1000, 'advanced': 2000,
      'expert': 4000, 'master': 8000, 'world-class': 15000, 'grandmaster': 25000
    };
    return timeMap[baseDifficulty] || 3000;
  },
  getAccuracyProbability: (baseDifficulty) => {
    // 1.0 means it always picks the engine's best move. Lower means it might pick sub-optimal.
    const accuracyMap = {
      'beginner': 0.4, 'intermediate': 0.6, 'advanced': 0.8,
      'expert': 0.9, 'master': 0.95, 'world-class': 0.99, 'grandmaster': 1.0 
    };
    return accuracyMap[baseDifficulty] || 0.8;
  }
};

export const BoardGameAI = {
  minimaxAlphaBeta: async (
    gameState, depth, alpha, beta, isMaximizing, 
    evaluateFn, getMovesFn, executeMoveFn, checkEndFn, hashFn,
    player, startTime, timeLimitMs, searchContext
  ) => {
    if (Date.now() - startTime > timeLimitMs) {
      searchContext.timeout = true;
      return { score: evaluateFn(gameState, player) };
    }
    
    const stateHash = hashFn ? hashFn(gameState) : null;
    const originalAlpha = alpha;
    
    if (stateHash) {
      const ttEntry = GlobalTT.lookup(stateHash, depth, alpha, beta);
      if (ttEntry && ttEntry.score !== undefined) {
        return { score: ttEntry.score, bestMove: ttEntry.bestMove };
      }
    }

    const endStatus = checkEndFn(gameState);
    if (endStatus.isOver) {
      // Forced win detection: heavily reward faster wins
      const score = endStatus.winner === player ? 100000 + depth : (endStatus.winner === 0 ? 0 : -100000 - depth);
      return { score };
    }
    
    if (depth === 0) {
      return { score: evaluateFn(gameState, player) };
    }

    let moves = getMovesFn(gameState, isMaximizing ? player : (typeof player === 'string' ? (player === 'X' ? 'O' : 'X') : -player));
    if (moves.length === 0) return { score: isMaximizing ? -100000 : 100000 };

    // Move Ordering
    moves.sort((a, b) => {
      let scoreA = a.sortScore || 0; 
      let scoreB = b.sortScore || 0;
      if (stateHash) {
        const ttEntry = GlobalTT.lookup(stateHash, 0, alpha, beta);
        if (ttEntry && ttEntry.bestMove) {
          if (JSON.stringify(a) === JSON.stringify(ttEntry.bestMove)) scoreA += 10000;
          if (JSON.stringify(b) === JSON.stringify(ttEntry.bestMove)) scoreB += 10000;
        }
      }
      if (searchContext.killerMoves[depth]) {
        if (JSON.stringify(a) === searchContext.killerMoves[depth][0]) scoreA += 9000;
        if (JSON.stringify(b) === searchContext.killerMoves[depth][0]) scoreB += 9000;
      }
      return scoreB - scoreA;
    });

    let bestMove = null;
    let bestScore = isMaximizing ? -Infinity : Infinity;
    let movedCount = 0;

    for (let i = 0; i < moves.length; i++) {
      if (i % 50 === 0) await new Promise(r => setTimeout(r, 0)); 
      
      const newState = executeMoveFn(gameState, moves[i], isMaximizing ? player : (typeof player === 'string' ? (player === 'X' ? 'O' : 'X') : -player));
      
      let r = 1;
      if (depth >= 3 && movedCount >= 4 && !moves[i].isCapture && !moves[i].isPromotion) {
        r = 2; 
      }

      let res = await BoardGameAI.minimaxAlphaBeta(
        newState, depth - r, alpha, beta, !isMaximizing, 
        evaluateFn, getMovesFn, executeMoveFn, checkEndFn, hashFn,
        player, startTime, timeLimitMs, searchContext
      );

      if (r > 1 && ((isMaximizing && res.score > alpha) || (!isMaximizing && res.score < beta))) {
        res = await BoardGameAI.minimaxAlphaBeta(
          newState, depth - 1, alpha, beta, !isMaximizing, 
          evaluateFn, getMovesFn, executeMoveFn, checkEndFn, hashFn,
          player, startTime, timeLimitMs, searchContext
        );
      }
      
      if (searchContext.timeout) return { score: bestScore !== (isMaximizing ? -Infinity : Infinity) ? bestScore : evaluateFn(gameState, player) };
      
      movedCount++;

      if (isMaximizing) {
        if (res.score > bestScore) {
          bestScore = res.score;
          bestMove = moves[i];
        }
        alpha = Math.max(alpha, bestScore);
      } else {
        if (res.score < bestScore) {
          bestScore = res.score;
          bestMove = moves[i];
        }
        beta = Math.min(beta, bestScore);
      }
      
      if (alpha >= beta) {
        if (!moves[i].isCapture) {
          if (!searchContext.killerMoves[depth]) searchContext.killerMoves[depth] = [];
          searchContext.killerMoves[depth].unshift(JSON.stringify(moves[i]));
          if (searchContext.killerMoves[depth].length > 2) searchContext.killerMoves[depth].pop();
        }
        break; 
      }
    }

    if (stateHash && bestMove) {
      let flag = 'EXACT';
      if (bestScore <= originalAlpha) flag = 'UPPERBOUND';
      else if (bestScore >= beta) flag = 'LOWERBOUND';
      GlobalTT.store(stateHash, depth, bestScore, flag, bestMove);
    }

    return { score: bestScore, bestMove };
  },
  
  calculateOptimalMove: async (gameState, player, difficulty, logicConfig) => {
    const timeLimitMs = AdaptiveEngine.getTimeLimit(difficulty);
    const maxDepth = AdaptiveEngine.getDynamicDepth(difficulty, 60000);
    const startTime = Date.now();
    const searchContext = { timeout: false, killerMoves: {} };
    
    let bestMoveOverall = null;
    let bestScoreOverall = -Infinity;
    
    let alpha = -Infinity;
    let beta = Infinity;
    const windowSize = 50;

    for (let currentDepth = 1; currentDepth <= maxDepth; currentDepth++) {
      if (Date.now() - startTime >= timeLimitMs - 100) break;
      
      const result = await BoardGameAI.minimaxAlphaBeta(
        gameState, currentDepth, alpha, beta, true,
        logicConfig.evaluate, logicConfig.getMoves, logicConfig.executeMove, 
        logicConfig.checkEnd, logicConfig.hashState,
        player, startTime, timeLimitMs, searchContext
      );
      
      if (searchContext.timeout && currentDepth > 1) break;

      if (result.score <= alpha || result.score >= beta) {
        alpha = -Infinity;
        beta = Infinity;
        currentDepth--; 
        continue;
      }
      
      if (result.bestMove) {
        bestMoveOverall = result.bestMove;
        bestScoreOverall = result.score;
        alpha = bestScoreOverall - windowSize;
        beta = bestScoreOverall + windowSize;
      }
    }
    
    return { move: bestMoveOverall, score: bestScoreOverall, depthAchieved: maxDepth };
  }
};

export const AIProIntelligent = {
  BoardGameAI,
  InfiniteKnowledge,
  AdaptiveEngine,
  GlobalTT,
  AIExplanationEngine
};
