
import { 
  Swords, 
  CircleDot, 
  Calculator, 
  HelpCircle, 
  Hash, 
  Brain, 
  FileText, 
  Target, 
  GraduationCap, 
  Grid3X3, 
  Circle 
} from 'lucide-react';

export const useGameTypeIcon = () => {
  const getGameTypeInfo = (gameType) => {
    const types = {
      'chess': { icon: Swords, color: 'text-blue-500', bg: 'bg-blue-500/10' },
      'checkers': { icon: CircleDot, color: 'text-red-500', bg: 'bg-red-500/10' },
      'math_game': { icon: Calculator, color: 'text-purple-500', bg: 'bg-purple-500/10' },
      'quizzes': { icon: HelpCircle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
      'tic_tac_toe': { icon: Hash, color: 'text-green-500', bg: 'bg-green-500/10' },
      'memory_match': { icon: Brain, color: 'text-pink-500', bg: 'bg-pink-500/10' },
      'word_search': { icon: FileText, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
      'hangman': { icon: Target, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
      'trivia': { icon: GraduationCap, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
      'sudoku': { icon: Grid3X3, color: 'text-teal-500', bg: 'bg-teal-500/10' },
      'connect_four': { icon: Circle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    };

    return types[gameType?.toLowerCase()] || { icon: Swords, color: 'text-primary', bg: 'bg-primary/10' };
  };

  return { getGameTypeInfo };
};
