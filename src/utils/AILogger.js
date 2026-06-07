
import pb from '@/lib/pocketbaseClient.js';

export const AILogger = {
  logMove: (game, move, metrics) => {
    // Legacy logger placeholder to avoid breaking existing references
    console.log(`[${game}] AI Move:`, move, metrics);
  },
  generateExplanation: (game, score, metrics) => {
    if (score > 9000) return "Found forced winning sequence.";
    if (score < -9000) return "Attempting to delay losing sequence.";
    if (score > 2) return "Capitalizing on significant advantage.";
    if (score > 0.5) return "Improving positional advantage.";
    if (score < -2) return "Defending against strong threat.";
    if (score < -0.5) return "Maneuvering from a slight disadvantage.";
    return "Maintaining balance in an equal position.";
  }
};

export async function logAIMove({ game, level, depth, eval: evalScore, evalBefore, time, move }) {
  try {
    if (pb.authStore.isValid) {
      await pb.collection('ai_move_logs').create({
        game,
        level,
        depth: depth || 0,
        eval: evalScore || 0,
        evalBefore: evalBefore || 0,
        time: time || 0,
        move: typeof move === 'string' ? move : JSON.stringify(move),
        status: 'SUCCESS'
      }, { $autoCancel: false });
    }
  } catch (error) {
    console.error('Failed to log AI move:', error);
  }
}

export const getDifficultyTimeout = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 500;
    case 'medium': return 1000;
    case 'hard': return 2000;
    case 'expert': return 3000;
    case 'impossible': return 5000;
    default: return 2000;
  }
};

export const executeWithTimeout = async (fn, timeoutMs, game, level) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('TIMEOUT'));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([fn(), timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.message === 'TIMEOUT') {
      const errorMsg = `ERROR: AI_TIMEOUT - Game=${game}, Level=${level}, Time=${timeoutMs}ms`;
      console.error(errorMsg);
      logAIMove({
        game,
        level,
        depth: 0,
        eval: 0,
        evalBefore: 0,
        time: timeoutMs,
        move: errorMsg
      });
      throw error;
    }
    throw error;
  }
};
