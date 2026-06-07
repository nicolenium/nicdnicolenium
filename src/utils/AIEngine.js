
export class AIEngine {
  constructor() {
    this.isThinking = false;
    this.shouldCancel = false;
    this.startTime = 0;
  }

  // Yields execution to the main thread to prevent UI freezing
  async yieldThread() {
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  // Check if we should stop thinking
  checkInterrupt(timeLimit) {
    if (this.shouldCancel) return true;
    if (Date.now() - this.startTime > timeLimit) return true;
    return false;
  }

  cancel() {
    this.shouldCancel = true;
    this.isThinking = false;
  }

  getDepthForDifficulty(difficulty) {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 1;
      case 'medium': return 3;
      case 'hard': return 5;
      case 'impossible': return 7;
      default: return 3;
    }
  }

  /**
   * Generic Alpha-Beta Pruning Minimax
   * @param {Object} state Current game state
   * @param {Number} depth Depth remaining
   * @param {Number} alpha Alpha value
   * @param {Number} beta Beta value
   * @param {Boolean} isMaximizing Is maximizing player?
   * @param {Object} options Contains game-specific functions
   */
  async minimax(state, depth, alpha, beta, isMaximizing, options) {
    if (this.checkInterrupt(options.timeLimit)) {
      return options.evaluate(state, options.player, options.opponent);
    }

    // Yield every few iterations to keep UI perfectly smooth
    if (options.nodeCount++ % 50 === 0) await this.yieldThread();

    const isTerminal = options.isTerminal(state);
    if (depth === 0 || isTerminal) {
      return options.evaluate(state, options.player, options.opponent);
    }

    const moves = options.getMoves(state, isMaximizing ? options.player : options.opponent);
    if (moves.length === 0) {
      return isMaximizing ? -Infinity : Infinity;
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        const nextState = options.executeMove(state, move, options.player);
        const ev = await this.minimax(nextState, depth - 1, alpha, beta, false, options);
        maxEval = Math.max(maxEval, ev);
        alpha = Math.max(alpha, ev);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        const nextState = options.executeMove(state, move, options.opponent);
        const ev = await this.minimax(nextState, depth - 1, alpha, beta, true, options);
        minEval = Math.min(minEval, ev);
        beta = Math.min(beta, ev);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  async calculateMove(gameState, difficulty, options) {
    this.isThinking = true;
    this.shouldCancel = false;
    this.startTime = Date.now();
    options.nodeCount = 0;

    if (options.onCalculationStart) options.onCalculationStart();

    const moves = options.getMoves(gameState, options.player);
    if (!moves || moves.length === 0) {
      this.isThinking = false;
      if (options.onCalculationEnd) options.onCalculationEnd();
      return null;
    }

    // Easy mode: random valid move
    if (difficulty === 'easy') {
      await this.yieldThread();
      this.isThinking = false;
      const move = moves[Math.floor(Math.random() * moves.length)];
      if (options.onCalculationEnd) options.onCalculationEnd();
      return move;
    }

    // Check opening book for Impossible
    if (difficulty === 'impossible' && options.getOpeningMove) {
      const openingMove = options.getOpeningMove(gameState);
      if (openingMove) {
        await this.yieldThread();
        this.isThinking = false;
        if (options.onCalculationEnd) options.onCalculationEnd();
        return openingMove;
      }
    }

    let bestMove = moves[0];
    let bestValue = -Infinity;
    const depth = this.getDepthForDifficulty(difficulty);

    // Sort moves for better alpha-beta pruning (heuristics if provided)
    if (options.sortMoves) {
      options.sortMoves(moves, gameState);
    }

    // Root level evaluation
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const nextState = options.executeMove(gameState, move, options.player);
      
      const moveValue = await this.minimax(
        nextState, 
        depth - 1, 
        -Infinity, 
        Infinity, 
        false, 
        options
      );

      // Add slight randomness to equal values to avoid deterministic loops
      const noise = Math.random() * 0.1;
      
      if (moveValue + noise > bestValue) {
        bestValue = moveValue + noise;
        bestMove = move;
      }

      if (this.checkInterrupt(options.timeLimit)) break;
    }

    this.isThinking = false;
    if (options.onCalculationEnd) options.onCalculationEnd();
    return bestMove;
  }
}
