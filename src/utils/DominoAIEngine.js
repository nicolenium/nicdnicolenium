
import { getBoardEnds, canPlayTile } from './DominoesGameLogic.js';
import { AIEngineBase } from './AIEngineBase.js';
import { logAIMove, getDifficultyTimeout, executeWithTimeout } from './AILogger.js';

export const calculateBestDominoMove = async (board, hand, boneyard, difficulty = 'hard') => {
  const startTime = Date.now();
  const timeoutMs = getDifficultyTimeout(difficulty);
  const config = AIEngineBase.getDifficultyConfig(difficulty);
  const boardEnds = getBoardEnds(board);
  const validTiles = hand.filter(t => canPlayTile(t, boardEnds));
  
  if (validTiles.length === 0) return null;

  const fallbackTile = validTiles[Math.floor(Math.random() * validTiles.length)];
  const fallbackEnd = boardEnds.length === 0 ? 0 : (fallbackTile.includes(boardEnds[0]) ? 0 : 1);
  const fallbackMove = { tile: fallbackTile, end: fallbackEnd };

  try {
    return await executeWithTimeout(async () => {
      await new Promise(r => setTimeout(r, 600));

      if (Math.random() < config.randomness) {
        await logAIMove({
          game: 'Dominoes',
          level: difficulty,
          depth: 1,
          eval: 0,
          evalBefore: 0,
          time: Date.now() - startTime,
          move: `tile:[${fallbackMove.tile}]`
        });
        return fallbackMove;
      }

      let bestScore = -Infinity;
      let bestMove = { tile: validTiles[0], end: 0 };

      for (const tile of validTiles) {
        let score = (tile[0] + tile[1]) / 10.0; 
        if (tile[0] === tile[1]) score += 0.5; 
        
        const canPlayEnd0 = boardEnds.length === 0 || tile.includes(boardEnds[0]);
        const canPlayEnd1 = boardEnds.length > 0 && tile.includes(boardEnds[1]);

        if (canPlayEnd0 && score > bestScore) {
          bestScore = score;
          bestMove = { tile, end: 0 };
        }
        if (canPlayEnd1 && score > bestScore) {
          bestScore = score;
          bestMove = { tile, end: 1 };
        }
      }

      await logAIMove({
        game: 'Dominoes',
        level: difficulty,
        depth: 4,
        eval: bestScore,
        evalBefore: 0,
        time: Date.now() - startTime,
        move: `tile:[${bestMove.tile}]`
      });
      return bestMove;
    }, timeoutMs, 'Dominoes', difficulty);

  } catch (e) {
    if (e.message === 'TIMEOUT') {
      return fallbackMove;
    }
    throw e;
  }
};
