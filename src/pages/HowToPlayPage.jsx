
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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

const GAME_RULES = {
  chess: [
    { id: 'c1', title: 'Basic Rules', content: 'Chess is a two-player strategy board game played on a checkered board with 64 squares arranged in an 8×8 grid. The objective is to checkmate the opponent\'s king.' },
    { id: 'c2', title: 'Piece Movements', content: 'King: 1 square any direction. Queen: Any number of squares diagonally, horizontally, or vertically. Rook: Any number of squares horizontally or vertically. Bishop: Any number of squares diagonally. Knight: L-shape (2 squares one direction, 1 square perpendicular). Pawn: 1 square forward (2 on first move), captures diagonally.' },
    { id: 'c3', title: 'Special Moves', content: 'Castling: King moves 2 squares towards a rook, rook jumps over king. En Passant: Pawn captures an adjacent enemy pawn that just moved 2 squares. Promotion: Pawn reaching the opposite end becomes any piece (usually a Queen).' }
  ],
  checkers_10x10: [
    { id: 'ck10_1', title: 'Basic Rules', content: 'Played on a 10x10 board with 20 pieces per player. Pieces move diagonally forward. Capturing is mandatory.' },
    { id: 'ck10_2', title: 'Piece Movements', content: 'Men move one square diagonally forward. Kings (crowned pieces) can move any number of squares diagonally (flying kings).' },
    { id: 'ck10_3', title: 'Capturing Rules', content: 'Capturing is mandatory. If multiple capture paths exist, you must choose the path that captures the maximum number of pieces (majority rule). Kings can capture from a distance and land anywhere behind the captured piece.' }
  ],
  checkers_8x8: [
    { id: 'ck8_1', title: 'Basic Rules', content: 'Played on an 8x8 board with 12 pieces per player. Pieces move diagonally forward. Capturing is mandatory.' },
    { id: 'ck8_2', title: 'Piece Movements', content: 'Men move one square diagonally forward. Kings can move one square diagonally in any direction (forward or backward).' },
    { id: 'ck8_3', title: 'Capturing Rules', content: 'Capturing is mandatory. You must jump over an opponent\'s piece to an empty square immediately behind it. Multiple jumps are allowed and mandatory if available.' }
  ],
  ludo: [
    { id: 'l1', title: 'Basic Rules', content: 'Ludo is a strategy board game for 2 to 4 players. Players race their four tokens from start to finish according to the rolls of a single die.' },
    { id: 'l2', title: 'Dice Mechanics', content: 'A roll of 6 is required to move a token out of the starting area. Rolling a 6 grants an extra turn. If you roll three 6s in a row, your turn ends.' },
    { id: 'l3', title: 'Capturing & Safe Zones', content: 'If a token lands on a square occupied by an opponent\'s token, the opponent\'s token is sent back to the start. Colored squares and star squares are safe zones where tokens cannot be captured.' }
  ],
  tiktaktok: [
    { id: 't1', title: 'Basic Rules', content: 'TikTakTok (Tic-Tac-Toe) is a game for two players, X and O, who take turns marking the spaces in a 3×3 grid.' },
    { id: 't2', title: 'Winning Conditions', content: 'The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row wins the game.' },
    { id: 't3', title: 'Draw Conditions', content: 'If all 9 squares are filled and neither player has 3 in a row, the game is a draw (cat\'s game).' }
  ],
  dominoes: [
    { id: 'd1', title: 'Basic Rules', content: 'Played with 28 tiles. Each player draws 7 tiles. The remaining tiles form the boneyard. The objective is to be the first to play all your tiles.' },
    { id: 'd2', title: 'Tile Placement', content: 'Players must match one end of a tile from their hand to an open end of the domino layout on the board. Doubles are usually played crossways.' },
    { id: 'd3', title: 'Drawing & Scoring', content: 'If a player cannot make a move, they must draw from the boneyard until they can. The winner scores points equal to the total pip count of the tiles remaining in the opponent\'s hand.' }
  ],
  math: [
    { id: 'm1', title: 'Game Format', content: 'Math Challenge presents you with endless mathematical equations. Solve them as quickly and accurately as possible.' },
    { id: 'm2', title: 'Problem Types', content: 'Choose between Addition, Subtraction, Multiplication, Division, or Mixed operations. Difficulty levels determine the size of the numbers.' },
    { id: 'm3', title: 'Scoring', content: 'Earn points for every correct answer. Speed and accuracy contribute to your final rating and leaderboard position.' }
  ],
  quiz: [
    { id: 'q1', title: 'Quiz Format', content: 'Knowledge Quizzes test your trivia skills across various categories. Answer multiple-choice questions before the timer runs out.' },
    { id: 'q2', title: 'Categories', content: 'Categories include General Knowledge, Science, History, Geography, and more. Select your preferred category and difficulty before starting.' },
    { id: 'q3', title: 'Scoring System', content: 'Points are awarded for correct answers. Faster answers yield higher scores. Consecutive correct answers build a multiplier streak.' }
  ],
  pronunciation: [
    { id: 'p1', title: 'How it Works', content: 'Pronunciation Master uses advanced voice recognition to evaluate your spoken language skills. Read the displayed phrases aloud into your microphone.' },
    { id: 'p2', title: 'Audio Guidance', content: 'Listen to the native speaker audio example before attempting the phrase yourself. Pay attention to intonation and stress.' },
    { id: 'p3', title: 'Scoring', content: 'The system analyzes your vowels, consonants, and overall fluency, providing a percentage score and highlighting areas for improvement.' }
  ],
  language: [
    { id: 'la1', title: 'Learning Methods', content: 'Languages Learning offers vocabulary building, grammar exercises, and listening comprehension tasks in an endless, gamified format.' },
    { id: 'la2', title: 'Progression', content: 'Start at A1 (Beginner) and progress through C2 (Mastery). Earn XP, maintain daily streaks, and unlock new language modules.' },
    { id: 'la3', title: 'Interactive Tasks', content: 'Tasks include translating words, matching pairs, constructing sentences, and identifying spoken phrases.' }
  ]
};

export default function HowToPlayPage() {
  const [activeGame, setActiveGame] = useState('chess');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>How to Play | NICD NICOLENIUM</title></Helmet>
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-serif mb-4 flex items-center gap-3">
              <BookOpen className="w-10 h-10 text-primary" /> How to Play
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Master the rules, learn the mechanics, and discover winning conditions for all 10 premium games.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full font-bold">
            <Link to="/strategy-guides">Advanced Strategies <ChevronRight className="w-4 h-4 ml-2" /></Link>
          </Button>
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

          <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-lg min-h-[400px]">
            <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={GAME_RULES[activeGame]?.[0]?.id}>
              {GAME_RULES[activeGame]?.map((rule) => (
                <AccordionItem key={rule.id} value={rule.id} className="border border-border rounded-2xl bg-background overflow-hidden px-2">
                  <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/50 rounded-xl transition-colors font-bold text-lg">
                    {rule.title}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-6 pt-2 text-muted-foreground leading-relaxed prose prose-invert max-w-none">
                    <p>{rule.content}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
