
export const AIEvaluator = {
  createTranspositionTable: () => new Map(),

  alphaBeta: async (state, depth, alpha, beta, isMaximizing, config) => {
    const { evaluateFn, getMovesFn, executeFn, isGameOverFn, hashFn, tt, timeoutLimit, startTime } = config;

    if (Date.now() - startTime > timeoutLimit) {
      throw new Error('TIMEOUT');
    }

    const stateHash = hashFn ? hashFn(state) : null;
    if (stateHash && tt && tt.has(stateHash)) {
      const entry = tt.get(stateHash);
      if (entry.depth >= depth) return entry.score;
    }

    const gameStatus = isGameOverFn(state);
    if (gameStatus.isOver) {
      return gameStatus.winner === 1 ? 10000 + depth : (gameStatus.winner === 2 ? -10000 - depth : 0);
    }

    if (depth === 0) {
      const evalScore = evaluateFn(state);
      if (stateHash && tt) tt.set(stateHash, { depth, score: evalScore });
      return evalScore;
    }

    const moves = getMovesFn(state, isMaximizing ? 1 : 2);
    if (moves.length === 0) {
      return isMaximizing ? -10000 : 10000;
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        const nextState = executeFn(state, move, 1);
        const ev = await AIEvaluator.alphaBeta(nextState, depth - 1, alpha, beta, false, config);
        maxEval = Math.max(maxEval, ev);
        alpha = Math.max(alpha, ev);
        if (beta <= alpha) break;
      }
      if (stateHash && tt) tt.set(stateHash, { depth, score: maxEval });
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        const nextState = executeFn(state, move, 2);
        const ev = await AIEvaluator.alphaBeta(nextState, depth - 1, alpha, beta, true, config);
        minEval = Math.min(minEval, ev);
        beta = Math.min(beta, ev);
        if (beta <= alpha) break;
      }
      if (stateHash && tt) tt.set(stateHash, { depth, score: minEval });
      return minEval;
    }
  }
};
