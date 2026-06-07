
export class AIEngineBase {
  static getDifficultyConfig(difficulty) {
    const configs = {
      'easy': { depth: 2, timeout: 500, randomness: 0.4 },
      'medium': { depth: 4, timeout: 1000, randomness: 0.1 },
      'hard': { depth: 6, timeout: 2000, randomness: 0.0 },
      'expert': { depth: 8, timeout: 3000, randomness: 0.0 },
      'impossible': { depth: 12, timeout: 5000, randomness: 0.0 }
    };
    return configs[difficulty?.toLowerCase()] || configs['medium'];
  }

  static async executeWithGuarantees(logicPromise, fallbackMove, timeoutMs = 2000) {
    try {
      const result = await Promise.race([
        logicPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_LIMIT_REACHED')), timeoutMs))
      ]);
      return result || fallbackMove;
    } catch (error) {
      console.warn(`[AI Engine] Safety Fallback Triggered: ${error.message}`);
      return fallbackMove;
    }
  }

  static validateMoveSafety(move, validMoves, matchLogic) {
    if (!move) return false;
    return validMoves.some(vm => matchLogic(move, vm));
  }
}
