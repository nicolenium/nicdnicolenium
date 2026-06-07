
export const QuizAIEngine = {
  simulateAIOpponent: (difficulty, timeElapsedSec, totalTimeSec, totalQuestions) => {
    // Determine target accuracy and speed based on difficulty
    let accuracy = 0.5;
    let speedMod = 0.5;
    
    switch(difficulty) {
      case 'easy': accuracy = 0.4; speedMod = 0.3; break;
      case 'medium': accuracy = 0.6; speedMod = 0.5; break;
      case 'hard': accuracy = 0.8; speedMod = 0.7; break;
      case 'expert': accuracy = 0.95; speedMod = 0.9; break;
      case 'impossible': accuracy = 1.0; speedMod = 1.0; break;
    }

    // Calculate how many questions the AI would have answered by now
    const progressRatio = (timeElapsedSec / totalTimeSec) * speedMod;
    const questionsAnswered = Math.floor(progressRatio * totalQuestions);
    
    // Calculate score (assuming 10 pts per correct answer)
    const correctAnswers = Math.floor(questionsAnswered * accuracy);
    const score = correctAnswers * 10;
    
    return {
      questionsAnswered,
      score,
      isFinished: questionsAnswered >= totalQuestions
    };
  }
};
