
export const generateQuestion = (config) => {
  const { min, max, operations } = config;
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
  let num2 = Math.floor(Math.random() * (max - min + 1)) + min;
  
  if (operation === '/') {
    num2 = Math.floor(Math.random() * 10) + 1;
    num1 = num2 * (Math.floor(Math.random() * (max/10)) + 1);
  }
  
  let answer;
  switch (operation) {
    case '+': answer = num1 + num2; break;
    case '-': answer = num1 - num2; break;
    case '*': answer = num1 * num2; break;
    case '/': answer = num1 / num2; break;
    default: answer = 0;
  }
  
  return { num1, num2, operation, answer, userAnswer: null };
};

export const initializeGame = (difficulty = 'medium', operationsOverride = null) => {
  const ranges = {
    easy: { min: 1, max: 10, operations: ['+', '-'] },
    medium: { min: 1, max: 50, operations: ['+', '-', '*'] },
    hard: { min: 1, max: 100, operations: ['+', '-', '*', '/'] }
  };
  
  const config = { ...ranges[difficulty] } || { ...ranges.medium };
  if (operationsOverride && operationsOverride.length > 0) {
    config.operations = operationsOverride;
  }
  
  return {
    currentQuestion: generateQuestion(config),
    score: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    streak: 0,
    config,
    startTime: Date.now()
  };
};

export const validateMove = (gameState, answer) => {
  return !isNaN(answer) && answer !== '';
};

export const executeMove = (gameState, userAnswer) => {
  const isCorrect = parseInt(userAnswer) === gameState.currentQuestion.answer;
  
  let newScore = gameState.score;
  let newStreak = gameState.streak;
  
  if (isCorrect) {
    newScore += 10 + (newStreak * 2);
    newStreak++;
  } else {
    newScore = Math.max(0, newScore - 5);
    newStreak = 0;
  }
  
  return {
    ...gameState,
    currentQuestion: generateQuestion(gameState.config),
    score: newScore,
    questionsAnswered: gameState.questionsAnswered + 1,
    correctAnswers: gameState.correctAnswers + (isCorrect ? 1 : 0),
    streak: newStreak
  };
};

export const checkGameStatus = (gameState) => {
  return { status: 'ongoing', winner: null };
};

export const calculateScore = (gameState) => {
  const accuracy = gameState.questionsAnswered > 0
    ? (gameState.correctAnswers / gameState.questionsAnswered) * 100
    : 0;
  
  const timeBonus = Math.max(0, 500 - Math.floor((Date.now() - gameState.startTime) / 1000));
  
  return Math.floor(gameState.score + (accuracy * 2) + timeBonus);
};
