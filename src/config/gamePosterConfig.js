
import { 
  Crown, Grid3X3, Dices, X, LayoutGrid, CircleDot, Zap, Brain, BrainCircuit, 
  Type, Search, FormInput, Hash, Calculator, Circle, Globe, FlaskConical, 
  Calculator as MathIcon, Landmark, Map, BookOpen, Trophy, Puzzle, BookA, 
  Spade, Club, Heart, Diamond, Ticket, Gift, Layers, Lightbulb
} from 'lucide-react';

export const GAME_POSTERS = [
  // TIER 1 - MOST POPULAR (1-10)
  { 
    id: 'chess', name: 'Master Chess', title: 'Master Chess', 
    description: 'The ultimate game of strategy and intellect. Command your army, protect your king, and outmaneuver your opponent.', 
    rules: 'Move pieces according to their specific patterns. Checkmate the opponent\'s king to win. White moves first.',
    image: 'https://images.unsplash.com/photo-1543756070-dd3109556b0e', 
    iconName: 'Crown', icon: Crown, category: 'Board Games', difficulty: 'Hard', modes: ['single_player', 'multiplayer', 'tournament'], path: '/chess', players: '1-2', time: '10-60m', 
    popularityRank: 1, tier: 1, rating: 4.9 
  },
  { 
    id: 'checkers-10x10', name: 'Pro Checkers 10x10', title: 'Pro Checkers 10x10', 
    description: 'International draughts played on a 10x10 board with complex sequences.', 
    rules: 'Pieces can capture backwards. Kings can move any distance along diagonals (flying kings).',
    image: 'https://images.unsplash.com/photo-1543756070-dd3109556b0e', 
    iconName: 'Grid3X3', icon: Grid3X3, category: 'Board Games', difficulty: 'Hard', modes: ['single_player', 'multiplayer', 'tournament'], path: '/checkers-10x10', players: '1-2', time: '15-45m', 
    popularityRank: 2, tier: 1, rating: 4.8 
  },
  { 
    id: 'ludo', name: 'Classic Ludo', title: 'Classic Ludo', 
    description: 'A fun, competitive family board game. Race your four tokens from start to finish.', 
    rules: 'Roll a 6 to move a token out of base. Move tokens clockwise. Land on an opponent to send them back.',
    image: 'https://images.unsplash.com/photo-1688984966950-080aa5e3998c', 
    iconName: 'Dices', icon: Dices, category: 'Board Games', difficulty: 'Easy', modes: ['single_player', 'multiplayer'], path: '/ludo', players: '1-4', time: '15-40m', 
    popularityRank: 3, tier: 1, rating: 4.7 
  },
  { 
    id: 'dominoes', name: 'Dominoes Pro', title: 'Dominoes Pro', 
    description: 'Match tiles with the same number of pips and block your opponents.', 
    rules: 'Match the number of pips on one end of a tile to an open end on the board.',
    image: 'https://images.unsplash.com/photo-1662748562746-076cb42b0186', 
    iconName: 'LayoutGrid', icon: LayoutGrid, category: 'Board Games', difficulty: 'Medium', modes: ['single_player', 'multiplayer'], path: '/dominoes', players: '1-4', time: '10-25m', 
    popularityRank: 4, tier: 1, rating: 4.6 
  },
  { 
    id: 'checkers-8x8', name: 'Checkers 8x8', title: 'Checkers 8x8', 
    description: 'Classic 8x8 checkers game. Jump over opponent pieces to capture them.', 
    rules: 'Move diagonally forward. Jump over opponent pieces to capture. Reach the last row to crown a King.',
    image: 'https://images.unsplash.com/photo-1543756070-dd3109556b0e', 
    iconName: 'Grid3X3', icon: Grid3X3, category: 'Board Games', difficulty: 'Medium', modes: ['single_player', 'multiplayer', 'tournament'], path: '/checkers-8x8', players: '1-2', time: '10-30m', 
    popularityRank: 5, tier: 1, rating: 4.7 
  },
  { 
    id: 'general-knowledge-quiz', name: 'General Knowledge Quiz', title: 'General Knowledge', 
    description: 'A comprehensive test of your knowledge on everyday topics with 500+ questions.', 
    rules: 'Answer multiple-choice questions. Score 80% to unlock next tier.',
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Globe', icon: Globe, category: 'Quiz Games', difficulty: 'Medium', modes: ['single_player'], path: '/knowledge-quizzes', players: '1', time: '5-10m', 
    popularityRank: 6, tier: 1, rating: 4.8 
  },
  { 
    id: 'geography-quiz', name: 'Geography Quiz', title: 'Geography Quiz', 
    description: 'Identify countries, capitals, flags, and landmarks from a massive database.', 
    rules: 'Select the correct geographical location or flag.',
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Map', icon: Map, category: 'Quiz Games', difficulty: 'Medium', modes: ['single_player'], path: '/geography-quiz', players: '1', time: '5-10m', 
    popularityRank: 7, tier: 1, rating: 4.6 
  },
  { 
    id: 'history-quiz', name: 'History Quiz', title: 'History Quiz', 
    description: 'Journey through time and test your knowledge of historical events.', 
    rules: 'Identify historical facts, dates, and figures.',
    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Landmark', icon: Landmark, category: 'Quiz Games', difficulty: 'Medium', modes: ['single_player'], path: '/history-quiz', players: '1', time: '5-10m', 
    popularityRank: 8, tier: 1, rating: 4.7 
  },
  { 
    id: 'science-quiz', name: 'Science Quiz', title: 'Science Quiz', 
    description: 'Explore the wonders of physics, chemistry, biology, and astronomy.', 
    rules: 'Answer scientific questions correctly. Hints reduce potential points.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800', 
    iconName: 'FlaskConical', icon: FlaskConical, category: 'Quiz Games', difficulty: 'Hard', modes: ['single_player'], path: '/science-challenge', players: '1', time: '5-10m', 
    popularityRank: 9, tier: 1, rating: 4.5 
  },
  { 
    id: 'math-quiz', name: 'Math Quiz', title: 'Math Quiz', 
    description: 'Solve equations, identify patterns, and crack mathematical puzzles.', 
    rules: 'Calculate the correct answer under time pressure.',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800', 
    iconName: 'MathIcon', icon: MathIcon, category: 'Quiz Games', difficulty: 'Hard', modes: ['single_player'], path: '/math-puzzle', players: '1', time: '5-10m', 
    popularityRank: 10, tier: 1, rating: 4.6 
  },

  // TIER 2 - POPULAR (11-20)
  { 
    id: 'sudoku', name: 'Sudoku Puzzle', title: 'Sudoku Puzzle', 
    description: 'The classic number placement puzzle with multiple difficulty levels.', 
    rules: 'Fill 9x9 grid with digits 1-9 without repeating in row, col, or 3x3.',
    image: 'https://images.unsplash.com/photo-1653576529022-422ee92bf4f1?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Hash', icon: Hash, category: 'Puzzle Games', difficulty: 'Hard', modes: ['single_player'], path: '/sudoku', players: '1', time: '10-30m', 
    popularityRank: 11, tier: 2, rating: 4.5 
  },
  { 
    id: 'crossword', name: 'Crossword Puzzle', title: 'Crossword Puzzle', 
    description: 'Classic crossword puzzles with daily challenges.', 
    rules: 'Use clues to fill in intersecting words.',
    image: 'https://images.unsplash.com/photo-1457598873543-d65b6134b1d9?auto=format&fit=crop&q=80&w=800', 
    iconName: 'FormInput', icon: FormInput, category: 'Puzzle Games', difficulty: 'Hard', modes: ['single_player'], path: '/crossword', players: '1', time: '10-30m', 
    popularityRank: 12, tier: 2, rating: 4.4 
  },
  { 
    id: 'jigsaw', name: 'Jigsaw Puzzle', title: 'Jigsaw Puzzle', 
    description: 'Relaxing jigsaw puzzles with beautiful imagery.', 
    rules: 'Connect interlocking pieces to reveal the complete picture.',
    image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Puzzle', icon: Puzzle, category: 'Puzzle Games', difficulty: 'Medium', modes: ['single_player'], path: '/jigsaw', players: '1', time: '15-45m', 
    popularityRank: 13, tier: 2, rating: 4.3 
  },
  { 
    id: 'memory-match', name: 'Memory Match', title: 'Memory Match', 
    description: 'Card matching game for memory and concentration.', 
    rules: 'Turn over cards to find matching pairs.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Layers', icon: Layers, category: 'Puzzle Games', difficulty: 'Medium', modes: ['single_player'], path: '/memory-challenge', players: '1', time: '5-15m', 
    popularityRank: 14, tier: 2, rating: 4.4 
  },
  { 
    id: 'word-search', name: 'Word Search', title: 'Word Search', 
    description: 'Find hidden words in the grid before time runs out.', 
    rules: 'Swipe across letters to highlight hidden words.',
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Search', icon: Search, category: 'Puzzle Games', difficulty: 'Easy', modes: ['single_player'], path: '/word-search', players: '1', time: '5-10m', 
    popularityRank: 15, tier: 2, rating: 4.2 
  },
  { 
    id: 'tiktaktok', name: 'Tic Tac Toe', title: 'Tic Tac Toe', 
    description: 'The classic game of crosses and noughts with unbeatable AI.', 
    rules: 'Place your mark in an empty square. Get three of your marks in a row to win.',
    image: 'https://images.unsplash.com/photo-1699039506677-61d9b15dfa60', 
    iconName: 'X', icon: X, category: 'Board Games', difficulty: 'Easy', modes: ['single_player', 'multiplayer'], path: '/tiktaktok', players: '1-2', time: '1-5m', 
    popularityRank: 16, tier: 2, rating: 4.1 
  },
  { 
    id: 'connect-four', name: 'Connect Four', title: 'Connect Four', 
    description: 'Drop your colored discs into the grid and try to connect four in a row.', 
    rules: 'Players take turns dropping one disc into a column. First to form a line of four wins.',
    image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f563?auto=format&fit=crop&q=80&w=800', 
    iconName: 'CircleDot', icon: CircleDot, category: 'Board Games', difficulty: 'Medium', modes: ['single_player', 'multiplayer'], path: '/connect-four', players: '1-2', time: '5-15m', 
    popularityRank: 17, tier: 2, rating: 4.3 
  },
  { 
    id: 'reversi', name: 'Reversi / Othello', title: 'Reversi', 
    description: 'A strategy board game involving play by two parties on an 8×8 uncheckered board.', 
    rules: 'Place a piece to outflank your opponent\'s pieces, flipping them to your color.',
    image: 'https://images.unsplash.com/photo-1585038021831-8afd9f9ab27f?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Circle', icon: Circle, category: 'Board Games', difficulty: 'Hard', modes: ['single_player', 'multiplayer'], path: '/reversi', players: '1-2', time: '10-20m', 
    popularityRank: 18, tier: 2, rating: 4.2 
  },
  { 
    id: 'go', name: 'Go', title: 'Go', 
    description: 'Ancient abstract strategy board game for two players.', 
    rules: 'Surround more territory than the opponent.',
    image: 'https://images.unsplash.com/photo-1585038021831-8afd9f9ab27f?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Grid3X3', icon: Grid3X3, category: 'Board Games', difficulty: 'Expert', modes: ['single_player', 'multiplayer'], path: '/go', players: '1-2', time: '30-90m', 
    popularityRank: 19, tier: 2, rating: 4.4 
  },
  { 
    id: 'shogi', name: 'Shogi', title: 'Shogi', 
    description: 'Japanese chess with unique drop mechanics.', 
    rules: 'Checkmate the opponent\'s king. Captured pieces can be dropped back onto the board.',
    image: 'https://images.unsplash.com/photo-1585038021831-8afd9f9ab27f?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Crown', icon: Crown, category: 'Board Games', difficulty: 'Expert', modes: ['single_player', 'multiplayer'], path: '/shogi', players: '1-2', time: '30-60m', 
    popularityRank: 20, tier: 2, rating: 4.3 
  },

  // TIER 3 - MODERATELY POPULAR (21-30)
  { 
    id: 'spelling-bee', name: 'Spelling Bee', title: 'Spelling Bee', 
    description: 'Test your spelling skills with increasingly difficult words.', 
    rules: 'Listen to the word and type the correct spelling.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Type', icon: Type, category: 'Educational Games', difficulty: 'Medium', modes: ['single_player'], path: '/spelling-bee', players: '1', time: '5-15m', 
    popularityRank: 21, tier: 3, rating: 4.1 
  },
  { 
    id: 'vocabulary-builder', name: 'Vocabulary Builder', title: 'Vocabulary Builder', 
    description: 'Expand your vocabulary with definitions and synonyms.', 
    rules: 'Match words to their correct definitions.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800', 
    iconName: 'BookA', icon: BookA, category: 'Educational Games', difficulty: 'Medium', modes: ['single_player'], path: '/vocabulary-builder', players: '1', time: '10-20m', 
    popularityRank: 22, tier: 3, rating: 4.2 
  },
  { 
    id: 'math-challenges', name: 'Math Challenges', title: 'Math Challenges', 
    description: 'Advanced mathematical problems and logic puzzles.', 
    rules: 'Solve complex equations within the time limit.',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Calculator', icon: Calculator, category: 'Educational Games', difficulty: 'Hard', modes: ['single_player'], path: '/math-challenges', players: '1', time: '10-30m', 
    popularityRank: 23, tier: 3, rating: 4.3 
  },
  { 
    id: 'logic-puzzle', name: 'Logic Puzzles', title: 'Logic Puzzles', 
    description: 'Test deductive reasoning with logic grids.', 
    rules: 'Use clues to mark true or false relationships.',
    image: 'https://images.unsplash.com/photo-1618005192384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Puzzle', icon: Puzzle, category: 'Educational Games', difficulty: 'Expert', modes: ['single_player'], path: '/logic-puzzle', players: '1', time: '15-30m', 
    popularityRank: 24, tier: 3, rating: 4.4 
  },
  { 
    id: 'pattern-recognition', name: 'Pattern Recognition', title: 'Pattern Recognition', 
    description: 'Identify visual and logical sequences.', 
    rules: 'Select the next item in the sequence.',
    image: 'https://images.unsplash.com/photo-1618005192384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', 
    iconName: 'BrainCircuit', icon: BrainCircuit, category: 'Educational Games', difficulty: 'Medium', modes: ['single_player'], path: '/pattern-recognition', players: '1', time: '5-15m', 
    popularityRank: 25, tier: 3, rating: 4.1 
  },
  { 
    id: 'hangman', name: 'Hangman', title: 'Hangman', 
    description: 'Guess the hidden word before the drawing is completed.', 
    rules: 'Guess letters. Incorrect guesses add parts to the drawing.',
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Type', icon: Type, category: 'Puzzle Games', difficulty: 'Medium', modes: ['single_player'], path: '/hangman', players: '1', time: '2-5m', 
    popularityRank: 26, tier: 3, rating: 4.0 
  },
  { 
    id: '20-questions', name: '20 Questions', title: '20 Questions', 
    description: 'Think of an object, and the AI will try to guess it.', 
    rules: 'Answer Yes/No to the AI\'s questions.',
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Brain', icon: Brain, category: 'Puzzle Games', difficulty: 'Easy', modes: ['single_player'], path: '/20-questions', players: '1', time: '5-10m', 
    popularityRank: 27, tier: 3, rating: 4.2 
  },
  { 
    id: 'trivia-master', name: 'Trivia Master', title: 'Trivia Master', 
    description: 'Become the ultimate trivia champion with advanced questions.', 
    rules: 'Answer correctly to build streaks. Three wrong answers ends game.',
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Trophy', icon: Trophy, category: 'Quiz Games', difficulty: 'Hard', modes: ['single_player', 'multiplayer'], path: '/trivia-master', players: '1-4', time: '10-20m', 
    popularityRank: 28, tier: 3, rating: 4.5 
  },
  { 
    id: 'brain-teaser', name: 'Brain Teaser', title: 'Brain Teaser', 
    description: 'Tricky puzzles designed to challenge assumptions.', 
    rules: 'Think outside the box to find non-obvious solutions.',
    image: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Lightbulb', icon: Lightbulb, category: 'Puzzle Games', difficulty: 'Medium', modes: ['single_player'], path: '/brain-teaser', players: '1', time: '5-10m', 
    popularityRank: 29, tier: 3, rating: 4.3 
  },
  { 
    id: 'reaction-time', name: 'Reaction Time', title: 'Reaction Time', 
    description: 'Test your reflexes in this fast-paced action game.', 
    rules: 'Click as soon as the color changes.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Zap', icon: Zap, category: 'Action Games', difficulty: 'Medium', modes: ['single_player'], path: '/reaction-time', players: '1', time: '1-2m', 
    popularityRank: 30, tier: 3, rating: 4.0 
  },

  // TIER 4 - EDUCATIONAL CARD/NUMBER GAMES (31-33)
  { 
    id: 'solitaire', name: 'Card Solitaire', title: 'Solitaire', 
    description: 'Classic Klondike solitaire card game.', 
    rules: 'Build four foundations in ascending suit sequence from Ace to King.',
    image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Spade', icon: Spade, category: 'Card Games', difficulty: 'Medium', modes: ['single_player'], path: '/solitaire', players: '1', time: '10-20m', 
    popularityRank: 31, tier: 4, rating: 4.2 
  },
  { 
    id: 'rummy', name: 'Rummy', title: 'Rummy', 
    description: 'Match cards of the same rank or sequence.', 
    rules: 'Form melds consisting of sets or runs.',
    image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Heart', icon: Heart, category: 'Card Games', difficulty: 'Medium', modes: ['single_player', 'multiplayer'], path: '/rummy', players: '2-4', time: '15-30m', 
    popularityRank: 32, tier: 4, rating: 3.9 
  },
  { 
    id: 'bingo', name: 'Bingo', title: 'Bingo', 
    description: 'Educational number matching game for all ages.', 
    rules: 'Match drawn numbers to your card. First to complete a pattern wins.',
    image: 'https://images.unsplash.com/photo-1517495306984-f84210f9daa8?auto=format&fit=crop&q=80&w=800', 
    iconName: 'Grid3X3', icon: Grid3X3, category: 'Educational Games', difficulty: 'Easy', modes: ['single_player', 'multiplayer'], path: '/bingo', players: '1-100', time: '5-15m', 
    popularityRank: 33, tier: 4, rating: 3.7 
  }
];

export const ALL_GAMES = GAME_POSTERS;

export const getGamePoster = (gameId) => {
  if (!gameId) return 'https://images.unsplash.com/photo-1614315584058-3bfa462c8c65?auto=format&fit=crop&q=80&w=800';
  const normalized = gameId.toLowerCase().replace(/_/g, '-');
  const game = GAME_POSTERS.find(g => g.id === normalized || g.id.replace(/-/g, '_') === normalized);
  return game?.image || 'https://images.unsplash.com/photo-1614315584058-3bfa462c8c65?auto=format&fit=crop&q=80&w=800';
};
