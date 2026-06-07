
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Target, BookMarked, ChevronLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const GAMES = [
  { id: 'chess', name: 'Chess' },
  { id: 'checkers_10x10', name: 'Checkers 10x10' },
  { id: 'checkers_8x8', name: 'Checkers 8x8' },
  { id: 'ludo', name: 'Ludo' },
  { id: 'tiktaktok', name: 'TikTakTok' },
  { id: 'dominoes', name: 'Dominoes' },
  { id: 'math', name: 'Math Challenge' },
  { id: 'quiz', name: 'Knowledge Quizzes' },
  { id: 'pronunciation', name: 'Pronunciation Master' },
  { id: 'language', name: 'Languages Learning' }
];

const GAME_STRATEGIES = {
  chess: [
    { id: 'cs1', title: 'Control the Center', content: 'The center squares (d4, e4, d5, e5) are the most important on the board. Controlling them gives your pieces maximum mobility and restricts your opponent.', difficulty: 'beginner' },
    { id: 'cs2', title: 'Develop Pieces Early', content: 'Move your knights and bishops out before moving your queen. Do not move the same piece twice in the opening unless necessary.', difficulty: 'beginner' },
    { id: 'cs3', title: 'King Safety (Castling)', content: 'Castle early to tuck your king safely behind a wall of pawns and bring your rook into the game.', difficulty: 'intermediate' },
    { id: 'cs4', title: 'Pawn Structure', content: 'Avoid doubled pawns, isolated pawns, and backward pawns. A strong pawn structure provides long-term advantages in the endgame.', difficulty: 'advanced' }
  ],
  checkers_10x10: [
    { id: 'ck10_1', title: 'Maintain the Back Row', content: 'Keep your back row intact as long as possible to prevent the opponent from getting a King.', difficulty: 'beginner' },
    { id: 'ck10_2', title: 'Control the Center', content: 'Pieces in the center have more mobility and control than pieces on the edges.', difficulty: 'intermediate' },
    { id: 'ck10_3', title: 'The Majority Rule', content: 'In 10x10, you MUST take the path that captures the most pieces. Use this rule to force your opponent into traps where they capture 1 piece but you capture 3.', difficulty: 'advanced' }
  ],
  checkers_8x8: [
    { id: 'ck8_1', title: 'Move in Groups', content: 'Keep your pieces close together. A piece supported by others cannot be easily captured.', difficulty: 'beginner' },
    { id: 'ck8_2', title: 'Sacrifice for Position', content: 'Sometimes giving up one piece to capture two, or to gain a King, is the winning strategy.', difficulty: 'intermediate' },
    { id: 'ck8_3', title: 'The Opposition', content: 'In the endgame, having "the opposition" means you force the enemy piece to move out of your way. Calculate moves to ensure you have the opposition.', difficulty: 'advanced' }
  ],
  ludo: [
    { id: 'l1', title: 'Spread Your Tokens', content: 'Don\'t focus on moving just one token to the finish. Having multiple tokens on the board gives you more options for different dice rolls.', difficulty: 'beginner' },
    { id: 'l2', title: 'Blockade Strategy', content: 'Form blocks by placing two of your tokens on the same square. This prevents opponents from passing and forces them to waste high rolls.', difficulty: 'intermediate' },
    { id: 'l3', title: 'Calculated Risks', content: 'Keep tokens on safe squares (stars) when opponents are near. Only move them when you roll a number that guarantees safety or captures an enemy.', difficulty: 'advanced' }
  ],
  tiktaktok: [
    { id: 't1', title: 'Take the Center', content: 'Always take the center square if it is available. It is involved in 4 winning lines, more than any other square.', difficulty: 'beginner' },
    { id: 't2', title: 'Corner Strategy', content: 'If the center is taken, take a corner. Corners are involved in 3 winning lines.', difficulty: 'intermediate' },
    { id: 't3', title: 'Creating Forks', content: 'A fork is a situation where you have two winning moves. Place your marks to create two intersecting lines of two.', difficulty: 'advanced' }
  ],
  dominoes: [
    { id: 'd1', title: 'Play Heavy Tiles First', content: 'Play your highest value tiles (like 6-6, 6-5) early. If the game gets blocked, you want the lowest possible score in your hand.', difficulty: 'beginner' },
    { id: 'd2', title: 'Control the Board Ends', content: 'Try to make both ends of the board a number you have many of. This ensures you can always play and forces the opponent to draw.', difficulty: 'intermediate' },
    { id: 'd3', title: 'Card Counting', content: 'There are exactly 7 tiles of each number (0-6). Keep track of how many 5s or 6s have been played to know what your opponent might be holding.', difficulty: 'advanced' }
  ],
  math: [
    { id: 'm1', title: 'Estimation', content: 'For large numbers, estimate the answer first to quickly eliminate wrong options in multiple-choice formats.', difficulty: 'beginner' },
    { id: 'm2', title: 'Mental Math Tricks', content: 'Learn tricks like multiplying by 5 (multiply by 10, divide by 2) or squaring numbers ending in 5.', difficulty: 'intermediate' }
  ],
  quiz: [
    { id: 'q1', title: 'Process of Elimination', content: 'If you don\'t know the answer, eliminate the obviously wrong choices first to increase your guessing odds.', difficulty: 'beginner' },
    { id: 'q2', title: 'Read Carefully', content: 'Watch out for words like "NOT", "EXCEPT", or "ALWAYS" in the question text.', difficulty: 'intermediate' }
  ],
  pronunciation: [
    { id: 'p1', title: 'Listen First', content: 'Always listen to the native speaker audio multiple times before attempting to speak.', difficulty: 'beginner' },
    { id: 'p2', title: 'Shadowing', content: 'Speak at the exact same time as the audio to match the rhythm, stress, and intonation perfectly.', difficulty: 'advanced' }
  ],
  language: [
    { id: 'la1', title: 'Daily Consistency', content: '15 minutes every day is far more effective than 2 hours once a week. Build a daily streak.', difficulty: 'beginner' },
    { id: 'la2', title: 'Contextual Learning', content: 'Don\'t just memorize isolated words. Learn phrases and sentences to understand grammar naturally.', difficulty: 'intermediate' }
  ]
};

export default function StrategyGuidePage() {
  const [activeGame, setActiveGame] = useState('chess');

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'beginner': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'advanced': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Strategy Guides | NICD NICOLENIUM</title></Helmet>
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <Button asChild variant="ghost" className="mb-4 -ml-4 rounded-full">
              <Link to="/how-to-play"><ChevronLeft className="w-4 h-4 mr-2" /> Back to Rules</Link>
            </Button>
            <h1 className="text-4xl md:text-5xl font-black font-serif mb-4 flex items-center gap-3">
              <Target className="w-10 h-10 text-primary" /> Strategy Guides
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Elevate your gameplay with advanced tactics, theories, and mastery tips for all 10 games.
            </p>
          </div>
        </div>

        <Tabs value={activeGame} onValueChange={setActiveGame} className="w-full">
          <TabsList className="w-full flex flex-wrap h-auto bg-muted/50 p-2 rounded-2xl mb-8 justify-start gap-2">
            {GAMES.map(game => (
              <TabsTrigger 
                key={game.id} 
                value={game.id}
                className="rounded-xl px-4 py-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                {game.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 md:p-10 shadow-lg min-h-[400px]">
              <h2 className="text-2xl font-bold mb-6 font-serif">Tactics & Techniques</h2>
              <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={GAME_STRATEGIES[activeGame]?.[0]?.id}>
                {GAME_STRATEGIES[activeGame]?.map((strategy) => (
                  <AccordionItem key={strategy.id} value={strategy.id} className="border border-border rounded-2xl bg-background overflow-hidden px-2">
                    <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/50 rounded-xl transition-colors font-bold text-lg flex justify-between pr-4">
                      <span className="flex items-center gap-3">
                        {strategy.title}
                        <Badge variant="outline" className={`ml-2 uppercase text-[10px] tracking-wider ${getDifficultyColor(strategy.difficulty)}`}>
                          {strategy.difficulty}
                        </Badge>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-6 pt-2 text-muted-foreground leading-relaxed prose prose-invert max-w-none">
                      <p>{strategy.content}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="space-y-6">
              <div className="bg-card border border-border rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 font-serif">
                  <BookMarked className="w-5 h-5 text-primary" /> Pro Tips
                </h3>
                <ul className="space-y-4">
                  <li className="p-4 bg-muted/50 rounded-xl border border-border">
                    <p className="font-bold text-foreground">Practice Daily</p>
                    <p className="text-sm text-muted-foreground">Consistency is key to mastering any game.</p>
                  </li>
                  <li className="p-4 bg-muted/50 rounded-xl border border-border">
                    <p className="font-bold text-foreground">Analyze Mistakes</p>
                    <p className="text-sm text-muted-foreground">Review your lost games to understand what went wrong.</p>
                  </li>
                  <li className="p-4 bg-muted/50 rounded-xl border border-border">
                    <p className="font-bold text-foreground">Play Stronger Opponents</p>
                    <p className="text-sm text-muted-foreground">You learn more from losing to a master than winning against a beginner.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
