
import { AdaptiveEngine } from '@/utils/AIProIntelligent.js';

export const AIResponseManager = {
  getDelayMs: (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 1500;
      case 'intermediate': return 1200;
      case 'advanced': return 1000;
      case 'expert': return 800;
      case 'master': return 600;
      case 'grandmaster': return 400;
      case 'world-class': return 200;
      default: return 1000;
    }
  },
  
  executeAITurn: async ({
    gameType, 
    gameState, 
    player, 
    difficulty = 'intermediate', 
    calculateMoveFn, 
    applyMoveFn, 
    fallbackMoveFn,
    onTimeout
  }) => {
    const delay = AIResponseManager.getDelayMs(difficulty);
    const startTime = Date.now();
    
    try {
      console.log(`[AIResponseManager] ${gameType} calculating move for player ${player} (Difficulty: ${difficulty})...`);
      
      let moveResult = await calculateMoveFn(gameState, player, difficulty);
      
      if (moveResult === null || moveResult === undefined) {
         console.warn(`[AIResponseManager] ${gameType} calculation failed. Engaging fallback...`);
         if (fallbackMoveFn) {
            moveResult = fallbackMoveFn(gameState, player);
         }
      }

      const elapsed = Date.now() - startTime;
      if (elapsed < delay) {
        await new Promise(res => setTimeout(res, delay - elapsed));
      }

      if (moveResult !== null && moveResult !== undefined) {
        console.log(`[AIResponseManager] ${gameType} executing move.`);
        applyMoveFn(moveResult);
        return true;
      } else {
        console.error(`[AIResponseManager] ${gameType} AI has no valid moves.`);
        if (onTimeout) onTimeout();
        return false;
      }
    } catch (error) {
      console.error(`[AIResponseManager] Critical error during AI turn for ${gameType}:`, error);
      
      if (fallbackMoveFn) {
        try {
          const fallback = fallbackMoveFn(gameState, player);
          if (fallback !== null && fallback !== undefined) {
             applyMoveFn(fallback);
             return true;
          }
        } catch (fallbackErr) {
          console.error(`[AIResponseManager] Fallback also failed:`, fallbackErr);
        }
      }
      
      if (onTimeout) onTimeout();
      return false;
    }
  },

  simulateQuizAnswer: async (difficulty) => {
    const delay = AIResponseManager.getDelayMs(difficulty);
    await new Promise(res => setTimeout(res, delay + Math.random() * 1000));
    const accuracy = AdaptiveEngine.getAccuracyProbability(difficulty);
    return Math.random() < accuracy;
  }
};
