
export const canPlaceWord = (grid, word, row, col, direction, size) => {
  const len = word.length;
  if (direction === 0 && col + len > size) return false;
  if (direction === 1 && row + len > size) return false;
  if (direction === 2 && (row + len > size || col + len > size)) return false;
  if (direction === 3 && (row - len < -1 || col + len > size)) return false;
  
  for (let i = 0; i < len; i++) {
    let r = row, c = col;
    if (direction === 0) c += i;
    if (direction === 1) r += i;
    if (direction === 2) { r += i; c += i; }
    if (direction === 3) { r -= i; c += i; }
    if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
  }
  return true;
};

export const placeWord = (grid, word, row, col, direction) => {
  for (let i = 0; i < word.length; i++) {
    let r = row, c = col;
    if (direction === 0) c += i;
    if (direction === 1) r += i;
    if (direction === 2) { r += i; c += i; }
    if (direction === 3) { r -= i; c += i; }
    grid[r][c] = word[i];
  }
};

export const initializeGame = (difficulty = 'medium') => {
  const gridSizes = { easy: 10, medium: 15, hard: 20 };
  const wordCounts = { easy: 5, medium: 8, hard: 12 };
  
  const size = gridSizes[difficulty] || 15;
  const wordCount = wordCounts[difficulty] || 8;
  
  const wordList = [
    'GAME', 'PLAY', 'WIN', 'SCORE', 'LEVEL', 'QUEST', 'HERO', 'MAGIC',
    'POWER', 'SKILL', 'BATTLE', 'VICTORY', 'CHALLENGE', 'ADVENTURE', 'PUZZLE'
  ];
  
  const words = wordList.slice(0, wordCount);
  const grid = Array(size).fill(null).map(() => Array(size).fill(''));
  const placedWords = [];
  
  words.forEach(word => {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 100) {
      const direction = Math.floor(Math.random() * 4); 
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      if (canPlaceWord(grid, word, row, col, direction, size)) {
        placeWord(grid, word, row, col, direction);
        placedWords.push({ word, row, col, direction, found: false });
        placed = true;
      }
      attempts++;
    }
  });
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }
  
  return {
    grid,
    words: placedWords,
    foundWords: [],
    selectedCells: [],
    score: 0,
    startTime: Date.now()
  };
};

export const validateMove = (gameState, selectedCells) => {
  return selectedCells.length >= 2;
};

export const executeMove = (gameState, selectedCells) => {
  const selectedWord = selectedCells.map(([r, c]) => gameState.grid[r][c]).join('');
  const foundWord = gameState.words.find(w => w.word === selectedWord && !w.found);
  
  if (foundWord) {
    const newWords = gameState.words.map(w =>
      w.word === selectedWord ? { ...w, found: true } : w
    );
    return {
      ...gameState,
      words: newWords,
      foundWords: [...gameState.foundWords, selectedWord],
      selectedCells: [],
      score: gameState.score + selectedWord.length * 10
    };
  }
  return {
    ...gameState,
    selectedCells: []
  };
};

export const checkGameStatus = (gameState) => {
  const allFound = gameState.words.every(w => w.found);
  if (allFound) return { status: 'finished', winner: 'player' };
  return { status: 'ongoing', winner: null };
};

export const calculateScore = (gameState) => {
  const timeBonus = Math.max(0, 500 - Math.floor((Date.now() - gameState.startTime) / 1000));
  return gameState.score + timeBonus;
};
