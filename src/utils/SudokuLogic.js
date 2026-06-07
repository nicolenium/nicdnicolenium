
export const generateSudoku = () => {
  const grid = Array(9).fill(null).map(() => Array(9).fill(0));
  fillGrid(grid);
  return grid;
};

export const fillGrid = (grid) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        shuffleArray(numbers);
        for (const num of numbers) {
          if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

export const isValidPlacement = (grid, row, col, num) => {
  for (let x = 0; x < 9; x++) if (grid[row][x] === num) return false;
  for (let x = 0; x < 9; x++) if (grid[x][col] === num) return false;
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[boxRow + i][boxCol + j] === num) return false;
    }
  }
  return true;
};

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export const createPuzzle = (solution, difficulty) => {
  const puzzle = JSON.parse(JSON.stringify(solution));
  const cellsToRemove = { easy: 30, medium: 45, hard: 55 }[difficulty] || 45;
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }
  return puzzle;
};

export const initializeGame = (difficulty = 'medium') => {
  const solution = generateSudoku();
  const puzzle = createPuzzle(solution, difficulty);
  return {
    puzzle,
    solution,
    userInput: JSON.parse(JSON.stringify(puzzle)),
    selectedCell: null,
    mistakes: 0,
    maxMistakes: 3,
    startTime: Date.now()
  };
};

export const validateMove = (gameState, row, col, value) => {
  return gameState.puzzle[row][col] === 0 && value >= 1 && value <= 9;
};

export const executeMove = (gameState, row, col, value) => {
  const newUserInput = JSON.parse(JSON.stringify(gameState.userInput));
  newUserInput[row][col] = value;
  let newMistakes = gameState.mistakes;
  if (value !== gameState.solution[row][col]) {
    newMistakes++;
  }
  return {
    ...gameState,
    userInput: newUserInput,
    mistakes: newMistakes
  };
};

export const checkGameStatus = (gameState) => {
  if (gameState.mistakes >= gameState.maxMistakes) return { status: 'lost', winner: null };
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (gameState.userInput[row][col] !== gameState.solution[row][col]) {
        return { status: 'ongoing', winner: null };
      }
    }
  }
  return { status: 'won', winner: 'player' };
};

export const calculateScore = (gameState) => {
  const timeTaken = Math.floor((Date.now() - gameState.startTime) / 1000);
  const timeBonus = Math.max(0, 1000 - timeTaken);
  const mistakePenalty = gameState.mistakes * 100;
  return Math.max(0, timeBonus - mistakePenalty);
};
