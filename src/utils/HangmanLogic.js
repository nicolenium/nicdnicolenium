
export const initializeGame = (difficulty = 'medium') => {
  const wordLists = {
    easy: ['CAT', 'DOG', 'SUN', 'MOON', 'STAR', 'TREE', 'FISH', 'BIRD'],
    medium: ['PUZZLE', 'GAMING', 'VICTORY', 'CHALLENGE', 'ADVENTURE', 'TREASURE'],
    hard: ['EXTRAORDINARY', 'MAGNIFICENT', 'SPECTACULAR', 'PHENOMENAL', 'EXCEPTIONAL']
  };
  
  const words = wordLists[difficulty] || wordLists.medium;
  const word = words[Math.floor(Math.random() * words.length)];
  
  return {
    word,
    guessedLetters: [],
    wrongGuesses: 0,
    maxWrongGuesses: 6,
    gameStatus: 'ongoing',
    score: 0
  };
};

export const validateMove = (gameState, letter) => {
  return !gameState.guessedLetters.includes(letter.toUpperCase()) && gameState.gameStatus === 'ongoing';
};

export const executeMove = (gameState, letter) => {
  const upperLetter = letter.toUpperCase();
  const newGuessedLetters = [...gameState.guessedLetters, upperLetter];
  
  let newWrongGuesses = gameState.wrongGuesses;
  let newScore = gameState.score;
  
  if (!gameState.word.includes(upperLetter)) {
    newWrongGuesses++;
    newScore = Math.max(0, newScore - 10);
  } else {
    newScore += 20;
  }
  
  const newGameState = {
    ...gameState,
    guessedLetters: newGuessedLetters,
    wrongGuesses: newWrongGuesses,
    score: newScore
  };
  
  const status = checkGameStatus(newGameState);
  newGameState.gameStatus = status.status;
  
  return newGameState;
};

export const checkGameStatus = (gameState) => {
  if (gameState.wrongGuesses >= gameState.maxWrongGuesses) {
    return { status: 'lost', winner: null };
  }
  
  const allLettersGuessed = gameState.word.split('').every(letter =>
    gameState.guessedLetters.includes(letter)
  );
  
  if (allLettersGuessed) {
    return { status: 'won', winner: 'player' };
  }
  
  return { status: 'ongoing', winner: null };
};

export const calculateScore = (gameState) => {
  if (gameState.gameStatus === 'won') {
    const remainingLives = gameState.maxWrongGuesses - gameState.wrongGuesses;
    return gameState.score + (remainingLives * 50);
  }
  return gameState.score;
};

export const getDisplayWord = (gameState) => {
  return gameState.word.split('').map(letter =>
    gameState.guessedLetters.includes(letter) ? letter : '_'
  ).join(' ');
};
