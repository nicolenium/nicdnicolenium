
// Centralized configuration for AI engines across all NICD games
export const AI_DIFFICULTY_LEVELS = {
  EASY: {
    depth: 2,
    timeoutMs: 500,
    randomness: 0.3, // 30% chance to pick a sub-optimal move
    adaptive: false
  },
  MEDIUM: {
    depth: 4,
    timeoutMs: 1500,
    randomness: 0.1,
    adaptive: true
  },
  HARD: {
    depth: 6,
    timeoutMs: 3000,
    randomness: 0.01,
    adaptive: true
  },
  EXPERT: {
    depth: 8,
    timeoutMs: 5000,
    randomness: 0.0,
    adaptive: true
  }
};

// Generic improved minimax wrapper to limit calculation time
export const iterativeDeepeningMinimax = (initialState, getMoves, evaluate, difficultyLevel) => {
  const config = AI_DIFFICULTY_LEVELS[difficultyLevel] || AI_DIFFICULTY_LEVELS.MEDIUM;
  let bestMove = null;
  const startTime = Date.now();
  
  // Implementation of a generic alpha-beta pruning strategy would live here.
  // For the sake of standard integration, engines can reference this config 
  // to dynamically adjust search depths without locking the browser thread.
  
  return {
    depthLimit: config.depth,
    maxTime: config.timeoutMs,
    wobble: config.randomness
  };
};
