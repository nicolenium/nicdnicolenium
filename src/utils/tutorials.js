
export const tutorials = {
  // BOARD GAMES
  'chess': {
    title: "Master Chess",
    objective: "Checkmate the opponent's king, meaning the king is under attack and has no legal moves to escape.",
    rules: [
      "Pawns move forward one square (two on their first move) and capture diagonally.",
      "Knights move in an L-shape and can jump over other pieces.",
      "Bishops move diagonally, Rooks horizontally/vertically, and Queens any direction.",
      "Castling allows you to move your king and rook simultaneously for safety.",
      "En Passant is a special pawn capture rule."
    ],
    winCondition: "Achieve Checkmate or force the opponent to resign.",
    tips: [
      "Control the center of the board early in the game.",
      "Develop your minor pieces (knights and bishops) before bringing out the queen.",
      "Ensure king safety by castling early."
    ],
    example: "If a knight is on f3, it can move to d4, e5, g5, h4, etc., provided the square is empty or has an enemy piece."
  },
  'checkers_8x8': {
    title: "Classic Checkers",
    objective: "Capture all of your opponent's pieces or block them so they have no legal moves.",
    rules: [
      "Pieces only move diagonally forward on dark squares.",
      "Capturing opponent pieces is mandatory if a jump is available.",
      "If multiple jumps are possible, you must take one of the jumping paths.",
      "When a piece reaches the opposite end of the board, it is promoted to a King.",
      "Kings can move and jump diagonally both forward and backward."
    ],
    winCondition: "Leave the opponent with no pieces or no legal moves.",
    tips: [
      "Keep your back row intact as long as possible to prevent opponent Kings.",
      "Move pieces in pairs or groups to avoid leaving them vulnerable.",
      "Control the center to limit your opponent's mobility."
    ],
    example: "If your piece is adjacent to an opponent's piece and the space behind it is empty, you must jump over and capture it."
  },
  'checkers_10x10': {
    title: "Pro Checkers 10x10",
    objective: "Capture all opponent pieces or block them completely on a larger 10x10 grid.",
    rules: [
      "Played on a 10x10 board with 20 pieces per player.",
      "Pieces move diagonally forward, but can capture both forward and backward.",
      "Capturing is mandatory. If multiple capture paths exist, you must choose the one that captures the maximum number of pieces (International Rules).",
      "Kings (crowned pieces) can move any distance along a diagonal (flying kings)."
    ],
    winCondition: "Opponent has no pieces left or no valid moves available.",
    tips: [
      "In 10x10, long-range planning is crucial. Watch out for multi-jump combinations.",
      "Prioritize getting a flying king, as it commands immense power across long diagonals."
    ],
    example: "A flying king can jump an opponent piece from several squares away, provided the path is clear."
  },
  'ludo': {
    title: "Classic Ludo",
    objective: "Be the first player to move all four of your pieces around the board and into the center Home area.",
    rules: [
      "You must roll a 6 to move a piece out of your starting base.",
      "Rolling a 6 grants you an additional bonus roll.",
      "Pieces move clockwise around the track based on dice rolls.",
      "If you land on an opponent's piece (outside of safe zones), it is sent back to their base.",
      "Starred squares are Safe Zones where pieces cannot be captured."
    ],
    winCondition: "Successfully navigate all four tokens into your color's Home triangle.",
    tips: [
      "Don't rely on just one piece; try to spread them out.",
      "Use safe zones strategically to protect your pieces.",
      "If you roll a 6, prioritize bringing a new piece onto the board."
    ],
    example: "If you roll a 4 and an opponent's piece is 4 squares ahead, you will land on them and send them back to base!"
  },
  'tictactoe': {
    title: "Tic Tac Toe",
    objective: "Place three of your marks (X or O) in a horizontal, vertical, or diagonal row.",
    rules: [
      "Players take turns placing their mark on an empty 3x3 grid.",
      "You cannot play on a square that is already occupied.",
      "The game ends when a player gets 3 in a row or the board is full (draw)."
    ],
    winCondition: "Connect three marks in a continuous line.",
    tips: [
      "The center square is the most strategically valuable position.",
      "Try to set up a 'fork' where you have two unblocked paths to win simultaneously.",
      "Always block your opponent if they have two marks in a row."
    ],
    example: "Placing an X in the top-left, middle-center, and bottom-right squares wins diagonally."
  },
  'dominoes': {
    title: "Dominoes Pro",
    objective: "Be the first player to play all your tiles, or have the lowest score if the game becomes blocked.",
    rules: [
      "Players take turns matching one end of a tile from their hand to the open ends on the board.",
      "If you cannot make a match, you must draw from the boneyard until you find a playable tile.",
      "If the boneyard is empty and you cannot play, you must pass.",
      "Doubles are placed perpendicular to the line."
    ],
    winCondition: "Play all your dominoes first. If blocked, the player with the lowest total pip count in hand wins.",
    tips: [
      "Try to get rid of your highest-value tiles early to minimize potential penalty points.",
      "Pay attention to what your opponent draws; it tells you what numbers they lack.",
      "Play tiles that leave ends you have matches for in your hand."
    ],
    example: "If the board ends are 4 and 6, you must play a tile that has a 4 or a 6 on it."
  },

  // EDUCATIONAL GAMES
  'math_challenge': {
    title: "Math Challenge",
    objective: "Solve mathematical equations correctly and quickly to maximize your score.",
    rules: [
      "Read the equation presented on screen.",
      "Type or select the correct answer before time runs out.",
      "Correct answers award points; incorrect answers yield no points.",
      "The difficulty scales up, introducing harder arithmetic."
    ],
    winCondition: "Reach the target score or achieve the highest score within the time limit.",
    tips: [
      "Focus on accuracy over pure speed to avoid careless mistakes.",
      "Use mental math shortcuts for multiplication and division."
    ],
    example: "If the prompt is 'What is 12 x 8?', entering '96' will award you points."
  },
  'pronunciation_master': {
    title: "Pronunciation Master",
    objective: "Speak words or phrases clearly into the microphone to achieve high pronunciation accuracy.",
    rules: [
      "Listen to the native audio example if needed.",
      "Click the microphone button and read the word clearly.",
      "The AI evaluates your pitch, intonation, and clarity.",
      "Scores above 85% are considered passing."
    ],
    winCondition: "Score high enough across all words to pass the lesson.",
    tips: [
      "Speak clearly in a quiet environment.",
      "Pay attention to the phonetic guide and mouth placement hints provided."
    ],
    example: "For the word 'Rhythm', wait for the mic to activate, say it clearly, and receive a score out of 100."
  },
  'languages_learning': {
    title: "Language Academy",
    objective: "Expand your vocabulary and grammar by translating words and completing exercises.",
    rules: [
      "Review the flashcards to memorize translations.",
      "In Practice mode, type the correct translation for the given word.",
      "You must complete all exercises to finish the course module."
    ],
    winCondition: "Successfully answer all practice questions to complete the lesson.",
    tips: [
      "Use the flip feature to memorize difficult words.",
      "Pay attention to gendered nouns and special characters."
    ],
    example: "If asked to translate 'Hello' into Spanish, type 'Hola'."
  },
  'memory_challenge': {
    title: "Memory Challenge",
    objective: "Find all matching pairs of cards in the fewest moves possible.",
    rules: [
      "Click a card to reveal its symbol.",
      "Click a second card to try and find a match.",
      "If they match, they remain face up. If not, they flip back over.",
      "Memorize the positions of cards as they are revealed."
    ],
    winCondition: "Match all pairs on the board.",
    tips: [
      "Work methodically. Try scanning top to bottom.",
      "Don't click randomly; try to remember previous failures."
    ],
    example: "Flip a 'Star' card, remember its location, and later when you find another 'Star', match them."
  },
  'speed_quiz': {
    title: "Speed Quiz",
    objective: "Answer rapid-fire questions as fast as possible to build a high score.",
    rules: [
      "You have a very limited time to answer each question.",
      "Select the correct multiple-choice option.",
      "Speed is prioritized; hesitate and you might run out of time."
    ],
    winCondition: "Survive the gauntlet of questions with the highest score.",
    tips: [
      "Trust your gut instinct.",
      "Quickly eliminate obviously wrong answers."
    ],
    example: "Select 'Paris' immediately when asked for the capital of France to maintain momentum."
  },

  // QUIZ GAMES (Generic Quiz Template users)
  'knowledge_quizzes': {
    title: "Knowledge Quizzes",
    objective: "Test your general knowledge across various random categories.",
    rules: ["Read the question and select the correct answer from the four choices.", "Each correct answer awards 10 points."],
    winCondition: "Complete the quiz with a high score.",
    tips: ["Take your time to read the options carefully."],
    example: "Answering a mix of pop culture, science, and history questions."
  },
  'geography_quiz': {
    title: "Geography Quiz",
    objective: "Test your knowledge of world maps, capitals, rivers, and mountains.",
    rules: ["Select the correct geographical fact for the given prompt."],
    winCondition: "Complete the quiz with the highest accuracy.",
    tips: ["Visualize the world map when answering border or location questions."],
    example: "Identifying the longest river in South America."
  },
  'history_quiz': {
    title: "History Quiz",
    objective: "Answer questions about historical events, dates, and prominent figures.",
    rules: ["Choose the correct historical fact or date."],
    winCondition: "Complete all questions correctly.",
    tips: ["Contextualize events by remembering the general era or century."],
    example: "Selecting 1969 as the year of the moon landing."
  },
  'science_challenge': {
    title: "Science Challenge",
    objective: "Answer questions covering biology, chemistry, physics, and astronomy.",
    rules: ["Pick the scientifically accurate answer."],
    winCondition: "Finish the quiz with a passing score.",
    tips: ["Remember basic scientific formulas and laws."],
    example: "Identifying H2O as water."
  },
  'math_puzzle': {
    title: "Math Puzzle",
    objective: "Solve complex mathematical sequences and equations.",
    rules: ["Analyze the pattern or equation and provide the correct numerical answer."],
    winCondition: "Solve all puzzles before time runs out.",
    tips: ["Look for sequences: addition, multiplication, or prime numbers."],
    example: "Finding the next number in 2, 4, 8, 16..."
  },
  'logic_puzzle': {
    title: "Logic Puzzle",
    objective: "Use deductive reasoning to find the correct answer.",
    rules: ["Read the logical premise and determine the only possible true statement."],
    winCondition: "Successfully deduce the answers to all scenarios.",
    tips: ["Process of elimination is your best tool here."],
    example: "Solving a classic 'If A is true, then B is false' scenario."
  },
  'spelling_bee': {
    title: "Spelling Bee",
    objective: "Select the correctly spelled word from the options.",
    rules: ["Identify the correct spelling of challenging words."],
    winCondition: "Complete the spelling challenge flawlessly.",
    tips: ["Sound out the word in your head and look for common prefix/suffix rules."],
    example: "Choosing 'Accommodation' over 'Accomodation'."
  },
  'vocabulary_builder': {
    title: "Vocabulary Builder",
    objective: "Match advanced words with their correct definitions or synonyms.",
    rules: ["Select the definition that best fits the given vocabulary word."],
    winCondition: "Expand your lexicon by scoring high.",
    tips: ["Look for root words and familiar prefixes."],
    example: "Knowing that 'Ubiquitous' means 'Present everywhere'."
  },
  'trivia_master': {
    title: "Trivia Master",
    objective: "Answer highly obscure and challenging random facts.",
    rules: ["Select the correct answer from multiple choices in a time-pressured environment."],
    winCondition: "Achieve the highest score.",
    tips: ["Eliminate the two least likely answers immediately."],
    example: "Knowing the name of the actor who played the 4th Doctor Who."
  },
  'brain_teaser': {
    title: "Brain Teaser",
    objective: "Solve riddles and lateral thinking puzzles.",
    rules: ["Think outside the box to answer trick questions."],
    winCondition: "Complete the teasers successfully.",
    tips: ["Don't take the question too literally; look for wordplay."],
    example: "Answering 'What has keys but can't open locks?' (A piano)."
  }
};
