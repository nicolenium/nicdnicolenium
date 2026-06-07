
import { getValidLudoPieces, SAFE_ZONES, LUDO_COLORS } from './LudoLogic.js';
import { AIEngineBase } from './AIEngineBase.js';
import { logAIMove, getDifficultyTimeout, executeWithTimeout } from './AILogger.js';

const evaluateLudoMove = (gameState, player, pieceIdx) => {
  let score = 0;
  const piecesArray = gameState.pieces || gameState.positions;
  const pos = piecesArray[player][pieceIdx];
  const dice = gameState.dice;

  if (pos === -1 && dice === 6) {
    score += 10.0; 
  } else {
    let newPos = pos;
    if (pos < 100) {
      const homeTile = LUDO_COLORS[player].home;
      const distToHome = (homeTile - pos + 52) % 52;
      if (distToHome < dice && distToHome !== 0) newPos = 100 + (dice - distToHome) - 1;
      else newPos = (pos + dice) % 52;
    } else {
      newPos = pos + dice;
    }

    if (newPos >= 100) {
      if (newPos === 105) score += 20.0; 
      else score += 4.0; 
    } else {
      if (SAFE_ZONES.includes(newPos)) score += 5.0; 
      
      let willCapture = false;
      for (let p = 0; p < 4; p++) {
        if (p !== player) {
          for (let i = 0; i < 4; i++) {
            if (piecesArray[p][i] === newPos && !SAFE_ZONES.includes(newPos)) {
              score += 15.0; 
              willCapture = true;
            }
          }
        }
      }
      
      if (SAFE_ZONES.includes(pos) && !SAFE_ZONES.includes(newPos) && !willCapture) {
        score -= 2.0; 
      }

      for (let p = 0; p < 4; p++) {
        if (p !== player) {
          for (let i = 0; i < 4; i++) {
            const oppPos = piecesArray[p][i];
            if (oppPos >= 0 && oppPos < 100) {
              const distFromOpp = (newPos - oppPos + 52) % 52;
              if (distFromOpp > 0 && distFromOpp <= 6 && !SAFE_ZONES.includes(newPos)) {
                score -= 6.0; 
              }
            }
          }
        }
      }
    }
  }
  return score;
};

export const calculateBestLudoMove = async (gameState, player, difficulty = 'hard') => {
  const startTime = Date.now();
  const timeoutMs = getDifficultyTimeout(difficulty);
  const config = AIEngineBase.getDifficultyConfig(difficulty);
  const validPieces = getValidLudoPieces(gameState, player);
  
  if (validPieces.length === 0) return null;
  if (validPieces.length === 1) {
    await logAIMove({
      game: 'Ludo',
      level: difficulty,
      depth: 1,
      eval: 0,
      evalBefore: 0,
      time: Date.now() - startTime,
      move: `piece:${validPieces[0]}`
    });
    return validPieces[0];
  }
  
  const fallbackMove = validPieces[Math.floor(Math.random() * validPieces.length)];
  const evalBefore = 0; // Simplified for Ludo

  try {
    return await executeWithTimeout(async () => {
      await new Promise(r => setTimeout(r, 600)); 

      if (Math.random() < config.randomness) {
        await logAIMove({
          game: 'Ludo',
          level: difficulty,
          depth: 1,
          eval: 0,
          evalBefore: 0,
          time: Date.now() - startTime,
          move: `piece:${fallbackMove}`
        });
        return fallbackMove;
      }

      let bestScore = -Infinity;
      let bestMove = validPieces[0];

      for (const pieceIdx of validPieces) {
        let score = evaluateLudoMove(gameState, player, pieceIdx);
        score += Math.random() * 0.5;

        if (score > bestScore) {
          bestScore = score;
          bestMove = pieceIdx;
        }
      }

      await logAIMove({
        game: 'Ludo',
        level: difficulty,
        depth: 4,
        eval: bestScore,
        evalBefore: evalBefore,
        time: Date.now() - startTime,
        move: `piece:${bestMove}`
      });
      return bestMove;
    }, timeoutMs, 'Ludo', difficulty);

  } catch (e) {
    if (e.message === 'TIMEOUT') {
      return fallbackMove;
    }
    throw e;
  }
};
