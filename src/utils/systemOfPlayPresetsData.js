
export const systemOfPlayPresetsData = [
  {
    gameName: "Chess",
    variants: [
      { variantName: "Standard FIDE", rules: "Standard FIDE rules apply including en passant, castling, and pawn promotion.", regulations: "Strict touch-move rule, complete silence, arbiter presence required.", matchFormat: "Classical time control (90m + 30s increment), Best of 1." },
      { variantName: "Rapid", rules: "Standard chess rules apply.", regulations: "Rapid chess regulations, limited arbiter intervention.", matchFormat: "15m + 10s increment, Best of 3." },
      { variantName: "Blitz", rules: "Standard chess rules apply.", regulations: "Illegal move loses instantly.", matchFormat: "3m + 2s increment, Best of 5." },
      { variantName: "Bullet", rules: "Standard chess rules apply.", regulations: "Premoves allowed, illegal move loses instantly.", matchFormat: "1m + 0s increment, Best of 10." }
    ]
  },
  {
    gameName: "Checkers 8x8",
    variants: [
      { variantName: "English Draughts", rules: "Men move forward only. Kings move forward/backward diagonally. Captures mandatory.", regulations: "No blowing (huffing). Time limits strictly enforced.", matchFormat: "Standard round-robin. 10m per player." },
      { variantName: "American", rules: "Standard American rules. Forced captures.", regulations: "Tournament strict play.", matchFormat: "Best of 3 matches." },
      { variantName: "Pool", rules: "Pool checkers rules. Flying kings allowed.", regulations: "Casual communication allowed.", matchFormat: "Single elimination." }
    ]
  },
  {
    gameName: "Checkers 10x10",
    variants: [
      { variantName: "International", rules: "10x10 board. Flying kings. Backward captures allowed for men. Maximum capture mandatory.", regulations: "Official FMJD regulations apply.", matchFormat: "Classical format, 1h 20m + 1min increment." },
      { variantName: "Polish", rules: "Similar to International. Specific regional opening rules apply.", regulations: "Regional tournament rules.", matchFormat: "Best of 3." },
      { variantName: "Russian", rules: "Played on 8x8 usually but adapted here for 10x10. King promotion rules differ.", regulations: "Clock required. Touch-move rule.", matchFormat: "Rapid format. 15m per player." }
    ]
  },
  {
    gameName: "Ludo",
    variants: [
      { variantName: "Standard", rules: "Roll 6 to start. Captures send opponents to base. Cannot jump blocks.", regulations: "Max 15s per turn. No verbal abuse.", matchFormat: "Single match, first to 4 tokens home wins." },
      { variantName: "Pachisi", rules: "Traditional rules. Cowrie shells simulated. Team play allowed.", regulations: "Historical rules enforced.", matchFormat: "Team format (2v2)." },
      { variantName: "Competitive", rules: "No safe zones except home base. Aggressive captures.", regulations: "Strict turn timers. Disconnection counts as forfeit.", matchFormat: "Ranked ladder match." }
    ]
  },
  {
    gameName: "Tic Tac Toe",
    variants: [
      { variantName: "Standard 3x3", rules: "Place 3 in a row to win.", regulations: "5 second turn timer.", matchFormat: "Best of 5." },
      { variantName: "Advanced 5x5", rules: "5x5 grid. Place 4 in a row to win.", regulations: "10 second turn timer.", matchFormat: "Best of 3." },
      { variantName: "Ultimate", rules: "9x9 nested grids. Winning a small grid claims that square.", regulations: "Tournament mode rules. 30s per turn.", matchFormat: "Single elimination match." }
    ]
  },
  {
    gameName: "Dominoes",
    variants: [
      { variantName: "Block", rules: "Double-six set. No drawing from boneyard.", regulations: "Play passes if blocked.", matchFormat: "First to 100 points." },
      { variantName: "Draw", rules: "Must draw from boneyard if unable to play.", regulations: "Standard tournament regulations.", matchFormat: "First to 150 points." },
      { variantName: "Mexican Train", rules: "Players can play on their own train or the Mexican train.", regulations: "Double-twelve set used. Markers required.", matchFormat: "Lowest score after 13 rounds wins." }
    ]
  },
  {
    gameName: "Math Challenge",
    variants: [
      { variantName: "Elementary", rules: "Addition and subtraction up to 100.", regulations: "No calculators. 30s per question.", matchFormat: "20 questions total." },
      { variantName: "Middle School", rules: "Multiplication, division, fractions, and basic algebra.", regulations: "Scratch paper allowed. 45s per question.", matchFormat: "30 questions total." },
      { variantName: "Advanced", rules: "Calculus, complex algebra, and trigonometry.", regulations: "Scientific calculator allowed. 3m per question.", matchFormat: "15 questions total." }
    ]
  },
  {
    gameName: "Pronunciation Master",
    variants: [
      { variantName: "American", rules: "General American English phonemes.", regulations: "Clear microphone required. AI scoring strictly aligned to GA.", matchFormat: "50 phrases sequence." },
      { variantName: "British", rules: "Received Pronunciation (RP) phonemes.", regulations: "AI scoring aligned to RP standard.", matchFormat: "50 phrases sequence." },
      { variantName: "Multilingual", rules: "Mix of Spanish, French, and German phrases.", regulations: "Score based on native accent proximity.", matchFormat: "10 phrases per language." }
    ]
  },
  {
    gameName: "Language Learning",
    variants: [
      { variantName: "Beginner A1-A2", rules: "Basic vocabulary and present tense grammar.", regulations: "Unlimited hints with minor score penalty.", matchFormat: "10 modules, 80% passing grade." },
      { variantName: "Intermediate B1-B2", rules: "Complex sentences, past/future tenses.", regulations: "No hints allowed. Timed responses.", matchFormat: "15 modules, 85% passing grade." },
      { variantName: "Advanced C1-C2", rules: "Idioms, nuanced expressions, and literature analysis.", regulations: "Strict timer. Peer review enabled.", matchFormat: "20 modules, 90% passing grade." }
    ]
  },
  {
    gameName: "Memory Challenge",
    variants: [
      { variantName: "Easy 4x4", rules: "Match pairs on a 4x4 grid.", regulations: "No time limit. No move limit.", matchFormat: "Single board clear." },
      { variantName: "Medium 6x6", rules: "Match pairs on a 6x6 grid. Similar looking icons included.", regulations: "60 second time limit.", matchFormat: "Best of 3 boards." },
      { variantName: "Hard 8x8", rules: "Match triplets on an 8x8 grid.", regulations: "3 minute limit. 5 second peek at start.", matchFormat: "Score attack mode." }
    ]
  },
  {
    gameName: "Speed Quiz",
    variants: [
      { variantName: "General Knowledge", rules: "Random topics.", regulations: "10s per question. No pausing.", matchFormat: "50 question rapid-fire." },
      { variantName: "Category-Based", rules: "Questions restricted to user-selected category.", regulations: "15s per question.", matchFormat: "20 question sets." },
      { variantName: "Difficulty-Based", rules: "Adaptive difficulty scaling up.", regulations: "Time decreases as difficulty increases.", matchFormat: "Survival mode (3 strikes)." }
    ]
  },
  {
    gameName: "Knowledge Quizzes",
    variants: [
      { variantName: "General", rules: "Broad range of topics.", regulations: "Open book allowed (casual).", matchFormat: "Untimed, 20 questions." },
      { variantName: "Specialized", rules: "Deep dive into specific niche topics.", regulations: "No outside resources.", matchFormat: "30m time limit, 50 questions." },
      { variantName: "Expert", rules: "University-level depth.", regulations: "Proctored environment simulated.", matchFormat: "60m time limit, 100 questions." }
    ]
  },
  {
    gameName: "Geography Quiz",
    variants: [
      { variantName: "World", rules: "Identify countries, capitals, and flags globally.", regulations: "No map assistance.", matchFormat: "Score based on accuracy and speed." },
      { variantName: "Regional", rules: "Focus on a specific continent (e.g., Europe, Africa).", regulations: "Strict spelling required for capitals.", matchFormat: "100% completion required." },
      { variantName: "Advanced", rules: "Identify physical geography (rivers, mountains, regions).", regulations: "Map click accuracy required (within 50 miles).", matchFormat: "20 map plotting tasks." }
    ]
  },
  {
    gameName: "History Quiz",
    variants: [
      { variantName: "World", rules: "Major global events timeline.", regulations: "Multiple choice.", matchFormat: "30 questions." },
      { variantName: "Regional", rules: "Deep dive into specific nation's history.", regulations: "Fill-in-the-blank dates.", matchFormat: "20 questions." },
      { variantName: "Ancient", rules: "Antiquity to 500 AD.", regulations: "Source document analysis included.", matchFormat: "25 questions." }
    ]
  },
  {
    gameName: "Science Challenge",
    variants: [
      { variantName: "General", rules: "Basic biology, chemistry, and physics.", regulations: "Middle-school level strictness.", matchFormat: "Best of 20." },
      { variantName: "Physics & Chemistry", rules: "Formulas, periodic table, and mechanics.", regulations: "Calculator allowed.", matchFormat: "45m test format." },
      { variantName: "Biology", rules: "Anatomy, genetics, and ecology.", regulations: "Diagram labeling required.", matchFormat: "30m test format." }
    ]
  },
  {
    gameName: "Math Puzzle",
    variants: [
      { variantName: "Arithmetic", rules: "Basic operators to reach target numbers.", regulations: "Timer counts up. Penalties for reset.", matchFormat: "Clear 5 puzzles." },
      { variantName: "Logic", rules: "Sudoku-style placement constraints.", regulations: "No auto-pencil marks.", matchFormat: "Single hard puzzle." },
      { variantName: "Advanced", rules: "KenKen or Kakuro style.", regulations: "Strict validation.", matchFormat: "Best time wins." }
    ]
  },
  {
    gameName: "Logic Puzzle",
    variants: [
      { variantName: "Beginner", rules: "Simple 3x3 grid deduction.", regulations: "Hints enabled.", matchFormat: "Complete in under 5m." },
      { variantName: "Intermediate", rules: "Standard 4x4 grid with complex clues.", regulations: "No hints.", matchFormat: "Complete in under 15m." },
      { variantName: "Expert", rules: "5x5 multidimensional deduction.", regulations: "Mistakes cause instant fail.", matchFormat: "Survival mode." }
    ]
  },
  {
    gameName: "Spelling Bee",
    variants: [
      { variantName: "Elementary", rules: "Common daily words.", regulations: "Audio repeats allowed 3 times.", matchFormat: "15 words." },
      { variantName: "Intermediate", rules: "Complex vocabulary and silent letters.", regulations: "Definition and origin available on request.", matchFormat: "25 words." },
      { variantName: "Advanced", rules: "Obscure and highly complex words.", regulations: "Only 1 audio repeat allowed.", matchFormat: "Sudden death (1 strike)." }
    ]
  },
  {
    gameName: "Vocabulary Builder",
    variants: [
      { variantName: "Basic 1000", rules: "Most common 1000 English words.", regulations: "Multiple choice definitions.", matchFormat: "Sets of 50." },
      { variantName: "Intermediate 5000", rules: "SAT-level vocabulary.", regulations: "Context-based usage required.", matchFormat: "Sets of 100." },
      { variantName: "Advanced 10000+", rules: "GRE and academic level.", regulations: "Synonym and antonym matching.", matchFormat: "Time attack." }
    ]
  },
  {
    gameName: "Trivia Master",
    variants: [
      { variantName: "Pop Culture", rules: "Movies, music, internet trends.", regulations: "Casual scoring.", matchFormat: "3 rounds of 10." },
      { variantName: "Sports", rules: "Global sports history and rules.", regulations: "Strict 10s timer.", matchFormat: "Half-time and full-time rounds." },
      { variantName: "Mixed", rules: "All categories randomized.", regulations: "3 lifelines available.", matchFormat: "Millionaire-style ladder." }
    ]
  },
  {
    gameName: "Brain Teaser",
    variants: [
      { variantName: "Visual", rules: "Pattern recognition and spatial reasoning.", regulations: "No outside tools.", matchFormat: "10 image sets." },
      { variantName: "Lateral Thinking", rules: "Riddles and wordplay.", regulations: "Text input parser validation.", matchFormat: "5 riddles." },
      { variantName: "Mathematical", rules: "Sequence and probability teasers.", regulations: "Calculators allowed.", matchFormat: "15m time limit." }
    ]
  }
];
