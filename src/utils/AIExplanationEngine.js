
export const AIExplanationEngine = {
  getEvaluationCategory: (evalScore, maxScore = 100) => {
    const normalized = evalScore / maxScore;
    if (normalized > 0.6) return 'winning';
    if (normalized > 0.1) return 'good';
    if (normalized > -0.1) return 'neutral';
    return 'bad';
  },

  calculateWinProbability: (evalScore, scale = 400) => {
    const prob = 1 / (1 + Math.exp(-evalScore / scale));
    return (prob * 100).toFixed(1);
  },

  getConfidenceScore: (depth, maxDepth = 10) => {
    return Math.min(100, Math.round((depth / maxDepth) * 100 + (Math.random() * 5)));
  },

  generateChessReasoning: (move, score, isOpening) => {
    if (isOpening && move) {
      if (move.from.r === 6 && move.from.c === 4 && move.to.r === 4 && move.to.c === 4) {
        return "King's Pawn Opening (e4). Immediately fights for center control and opens lines for the Queen and Bishop.";
      }
      if (move.from.r === 6 && move.from.c === 3 && move.to.r === 4 && move.to.c === 3) {
        return "Queen's Pawn Opening (d4). Strong central control, solidifies the position.";
      }
    }
    if (score > 800) return "This move creates an overwhelming material or positional advantage. Victory is near.";
    if (score > 300) return "Strong tactical sequence. Capitalizes on an opponent's weakness or wins material.";
    if (score > 100) return "Solid positional move. Improves piece activity, controls key squares, or enhances King safety.";
    if (score > -50) return "Prophylactic or developing move. Maintains tension in a balanced position.";
    return "A defensive necessity to prevent immediate material loss or checkmate threats.";
  },

  generateTicTacToeReasoning: (board, move, availableSpaces) => {
    if (availableSpaces === 9) return "Center opening. Statistically the strongest starting move, controlling maximum lines.";
    if (availableSpaces === 8) {
      if (move === 4) return "Taking the center to deny the opponent their strongest positional advantage.";
      return "Taking a corner to create dual-threat possibilities later.";
    }
    return "Calculated via Minimax. Blocks an opponent's winning line or creates an unblockable dual threat.";
  },

  generateCheckersReasoning: (move, score) => {
    if (move && move.isCapture) return "Forced capture sequence. Eliminating opponent pieces is mandatory and advantageous.";
    if (score > 50) return "Advancing towards the king row while maintaining a solid defensive backline.";
    return "Positional maneuvering. Controlling the center of the board to restrict opponent mobility.";
  },

  generateConnectFourReasoning: (col, score) => {
    if (score > 100) return "Connect Four! This drop completes the winning line.";
    if (score > 50) return "Critical block. Denies the opponent an immediate winning line.";
    if (col === 3) return "Center control. The middle column participates in the most possible winning lines.";
    return "Building vertical/horizontal threats while avoiding giving the opponent a stepping stone.";
  },

  formatAnalysis: (gameType, moveDetails) => {
    const { move, score, depth = 5, customScale = 100, isOpening = false, board = null, availableSpaces = 0 } = moveDetails;
    
    let reasoning = "Strategic move based on current board evaluation.";
    if (gameType === 'chess') reasoning = AIExplanationEngine.generateChessReasoning(move, score, isOpening);
    if (gameType === 'tictactoe') reasoning = AIExplanationEngine.generateTicTacToeReasoning(board, move, availableSpaces);
    if (gameType === 'checkers') reasoning = AIExplanationEngine.generateCheckersReasoning(move, score);
    if (gameType === 'connectfour') reasoning = AIExplanationEngine.generateConnectFourReasoning(move, score);

    const evaluation = AIExplanationEngine.getEvaluationCategory(score, customScale);
    const winProb = AIExplanationEngine.calculateWinProbability(score, customScale * 4);
    const confidence = AIExplanationEngine.getConfidenceScore(depth, 10);

    return {
      evaluation,
      winProbability: parseFloat(winProb),
      confidence,
      reasoning,
      evalScore: score,
      alternatives: [
        { text: "Positional setup", scoreDiff: -15 },
        { text: "Defensive structure", scoreDiff: -30 }
      ]
    };
  }
};
