
export const DifficultyConfig = {
  easy: {
    elo: 1000,
    searchDepth: 2,
    timeLimit: 1000,
    evaluationWeights: { material: 1.0, positional: 0.1, mobility: 0.1 },
    useOpeningBook: false,
    useEndgameTablebase: false,
    randomness: 0.4
  },
  medium: {
    elo: 1600,
    searchDepth: 4,
    timeLimit: 3000,
    evaluationWeights: { material: 1.0, positional: 0.5, mobility: 0.3 },
    useOpeningBook: true,
    useEndgameTablebase: false,
    randomness: 0.1
  },
  hard: {
    elo: 2200,
    searchDepth: 6,
    timeLimit: 5000,
    evaluationWeights: { material: 1.0, positional: 1.0, mobility: 0.8 },
    useOpeningBook: true,
    useEndgameTablebase: true,
    randomness: 0.0
  },
  expert: {
    elo: 2400,
    searchDepth: 8,
    timeLimit: 8000,
    evaluationWeights: { material: 1.0, positional: 1.2, mobility: 1.0, centralControl: 0.5 },
    useOpeningBook: true,
    useEndgameTablebase: true,
    randomness: 0.0
  },
  master: {
    elo: 2600,
    searchDepth: 10,
    timeLimit: 12000,
    evaluationWeights: { material: 1.0, positional: 1.5, mobility: 1.2, centralControl: 0.8, kingSafety: 0.5 },
    useOpeningBook: true,
    useEndgameTablebase: true,
    randomness: 0.0
  }
};
