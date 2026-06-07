
import { getAIResponse, varyResponseTone, addPersonality } from './aiResponseVariety.js';

export const PERSONALITIES = {
  EASY: 'Unpredictable',
  MEDIUM: 'Balanced',
  HARD: 'Strategic',
  EXPERT: 'Aggressive',
  PRO: 'Adaptive'
};

export const selectPersonality = (difficulty) => {
  return PERSONALITIES[difficulty?.toUpperCase()] || 'Balanced';
};

export const getPersonalityResponse = (gameType, actionType, difficulty, personalityOverride = null) => {
  const personality = personalityOverride || selectPersonality(difficulty);
  const baseResponse = getAIResponse(gameType, actionType, difficulty);
  
  let tone = 'neutral';
  if (personality === 'Aggressive') tone = 'challenging';
  if (personality === 'Balanced') tone = 'encouraging';
  
  const tonedResponse = varyResponseTone(baseResponse, tone);
  return addPersonality(tonedResponse, personality);
};

export const getPersonalityMoves = (gameType, validMoves, personality, baseEvaluationFn) => {
  if (!validMoves || validMoves.length === 0) return null;
  
  // Sort moves using base evaluation
  const scoredMoves = validMoves.map(m => ({ ...m, score: baseEvaluationFn(m) }));
  scoredMoves.sort((a, b) => b.score - a.score);

  if (personality === 'Unpredictable') {
    // 40% chance to pick a random top 3 move
    if (Math.random() < 0.4 && scoredMoves.length > 2) {
      return scoredMoves[Math.floor(Math.random() * 3)];
    }
  } else if (personality === 'Defensive') {
    // Favor non-capture, solid moves (custom sorting logic)
    const defensiveMoves = scoredMoves.filter(m => m.defensive || !m.risky);
    if (defensiveMoves.length > 0) return defensiveMoves[0];
  } else if (personality === 'Aggressive') {
    const aggressiveMoves = scoredMoves.filter(m => m.isCapture || m.aggressive);
    if (aggressiveMoves.length > 0) return aggressiveMoves[0];
  }

  return scoredMoves[0]; // Default best move
};

export const adjustDifficultyByPersonality = (baseDifficultyNum, personality) => {
  const mods = { 'Aggressive': 1, 'Defensive': 0, 'Balanced': 0, 'Unpredictable': -1, 'Strategic': 2, 'Adaptive': 1 };
  return Math.max(1, baseDifficultyNum + (mods[personality] || 0));
};
