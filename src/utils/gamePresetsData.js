
export const getStandardRules = (gameName) => {
  const genericMechanics = "Players take turns performing actions according to the game's core logic.";
  const genericWin = "The player with the highest score or who completes the objective first wins.";
  
  const presets = {
    "Chess": {
      description: "Classic strategic board game of complete information.",
      mechanics: "Players alternate moving 16 pieces of 6 types. Pieces move according to specific patterns.",
      winningConditions: "Checkmate the opponent's king, or opponent resigns/runs out of time.",
      specialRules: "Castling, En Passant, Pawn Promotion."
    },
    "Checkers 8x8": {
      description: "Traditional 8x8 draughts played with 12 pieces per player.",
      mechanics: "Diagonal forward moves. Captures are mandatory by jumping over opponent pieces.",
      winningConditions: "Capture all opponent pieces or block them from making a legal move.",
      specialRules: "Pieces reaching the opposite end become Kings (can move backwards)."
    },
    "Checkers 10x10": {
      description: "International draughts played on a 10x10 board.",
      mechanics: "20 pieces per player. Flying kings and backward captures are allowed.",
      winningConditions: "Capture or block all opponent pieces.",
      specialRules: "Maximum capture rule applies. Flying kings move any distance diagonally."
    },
    "Ludo": {
      description: "Classic dice-and-token race board game.",
      mechanics: "Roll a die to navigate 4 tokens around the board to the home area.",
      winningConditions: "Be the first player to move all 4 tokens to the center home space.",
      specialRules: "Rolling a 6 grants an extra turn. Landing on opponent's token sends it back to start."
    },
    "Tic Tac Toe": {
      description: "Simple 3x3 grid abstract strategy game.",
      mechanics: "Players take turns placing X or O on an empty square.",
      winningConditions: "Align 3 marks horizontally, vertically, or diagonally.",
      specialRules: "If the board fills with no alignment, the game is a draw."
    },
    "Dominoes": {
      description: "Tile-based game using 28 rectangular tiles.",
      mechanics: "Match pip counts on the open ends of the domino layout.",
      winningConditions: "Be the first to play all your tiles, or have the lowest pip count if blocked.",
      specialRules: "Drawing from the boneyard if no playable tile is held."
    },
    "Math Challenge": {
      description: "Fast-paced arithmetic puzzle competition.",
      mechanics: "Solve sequentially generated math problems under time pressure.",
      winningConditions: "Highest score at the end of the time limit.",
      specialRules: "Consecutive correct answers build a score multiplier."
    },
    "Pronunciation Master": {
      description: "AI-driven language pronunciation evaluator.",
      mechanics: "Speak given phrases into the microphone for phonetic scoring.",
      winningConditions: "Achieve the highest average pronunciation accuracy score.",
      specialRules: "Retries allowed based on difficulty settings."
    },
    "Language Learning": {
      description: "Vocabulary and grammar matching exercises.",
      mechanics: "Match translations, conjugate verbs, and build sentences.",
      winningConditions: "Complete the module with the highest accuracy.",
      specialRules: "Hint system deducts minor points when used."
    },
    "Memory Challenge": {
      description: "Classic pattern matching and recall game.",
      mechanics: "Flip pairs of cards to find matching symbols or concepts.",
      winningConditions: "Clear the board in the fewest moves or fastest time.",
      specialRules: "Combo bonuses for back-to-back matches."
    },
    "Speed Quiz": {
      description: "Rapid-fire general knowledge trivia.",
      mechanics: "Answer multiple-choice questions with only seconds per question.",
      winningConditions: "Highest correct answer count.",
      specialRules: "Unanswered questions count as negative points."
    },
    "Knowledge Quizzes": {
      description: "Deep-dive trivia on specific academic subjects.",
      mechanics: "Answer varied-format questions (multiple choice, fill-in).",
      winningConditions: "Achieve highest overall score.",
      specialRules: "Questions scale in difficulty based on previous answers."
    },
    "Geography Quiz": {
      description: "Map-based and capital-identification trivia.",
      mechanics: "Identify locations on a map or match countries to capitals.",
      winningConditions: "Highest accuracy score.",
      specialRules: "Proximity scoring for map clicks."
    },
    "History Quiz": {
      description: "Timeline and event-based historical trivia.",
      mechanics: "Order events chronologically or identify historical figures.",
      winningConditions: "Highest total points.",
      specialRules: "Bonus points for exact year matching."
    },
    "Science Challenge": {
      description: "Physics, biology, and chemistry knowledge test.",
      mechanics: "Solve scientific conceptual questions.",
      winningConditions: "Highest score within the allotted time.",
      specialRules: "Includes visual diagram interpretation questions."
    },
    "Math Puzzle": {
      description: "Logical number placement puzzles (e.g., Sudoku-style).",
      mechanics: "Fill grids with numbers satisfying specific mathematical constraints.",
      winningConditions: "Complete the grid correctly in the shortest time.",
      specialRules: "Mistake penalty adds time to the clock."
    },
    "Logic Puzzle": {
      description: "Deductive reasoning grid puzzles.",
      mechanics: "Use clues to eliminate impossibilities and find the exact scenario.",
      winningConditions: "Successfully solve the puzzle with zero errors.",
      specialRules: "Hints available but disable perfect-score achievements."
    },
    "Spelling Bee": {
      description: "Audio-based word spelling competition.",
      mechanics: "Listen to the word pronunciation and type the correct spelling.",
      winningConditions: "Longest streak of correctly spelled words.",
      specialRules: "Requesting definition or origin reduces points earned."
    },
    "Vocabulary Builder": {
      description: "Advanced word definition and synonym matching.",
      mechanics: "Match complex words to definitions or context sentences.",
      winningConditions: "Highest accuracy and completion speed.",
      specialRules: "Adaptive difficulty based on age/grade level setting."
    },
    "Trivia Master": {
      description: "Comprehensive multi-category trivia tournament.",
      mechanics: "Progress through rounds of escalating difficulty across all topics.",
      winningConditions: "Survive all rounds and accumulate the most points.",
      specialRules: "Use 'lifelines' strictly limited to 3 per game."
    },
    "Brain Teaser": {
      description: "Lateral thinking and abstract problem solving.",
      mechanics: "Solve non-standard riddles and visual paradoxes.",
      winningConditions: "Find the solution with the fewest incorrect attempts.",
      specialRules: "Time limits are generous, focusing on accuracy."
    }
  };

  const defaultPreset = {
    description: "Standard competitive game mode.",
    mechanics: genericMechanics,
    winningConditions: genericWin,
    specialRules: "None."
  };

  return presets[gameName] || defaultPreset;
};

export const gamePresetsData = [
  "Chess", "Checkers 8x8", "Checkers 10x10", "Ludo", "Tic Tac Toe", "Dominoes", 
  "Math Challenge", "Pronunciation Master", "Language Learning", "Memory Challenge", 
  "Speed Quiz", "Knowledge Quizzes", "Geography Quiz", "History Quiz", "Science Challenge", 
  "Math Puzzle", "Logic Puzzle", "Spelling Bee", "Vocabulary Builder", "Trivia Master", "Brain Teaser"
].map(gameName => ({
  gameName,
  presets: [
    {
      presetName: "Standard Rules",
      rules: getStandardRules(gameName)
    },
    {
      presetName: "Blitz / Fast Paced",
      rules: {
        description: "Accelerated version of the standard game.",
        mechanics: "Same mechanics as standard, but decisions must be made rapidly.",
        winningConditions: "Standard win conditions or opponent runs out of time.",
        specialRules: "Strict time limits. Timeouts result in immediate loss."
      }
    },
    {
      presetName: "Tournament Mode",
      rules: {
        description: "Strict rule set meant for official tournaments.",
        mechanics: "Standard mechanics with rigid enforcement.",
        winningConditions: "Standard win conditions.",
        specialRules: "Touch-move rule (if applicable), no undos, strict behavior guidelines."
      }
    }
  ]
}));
