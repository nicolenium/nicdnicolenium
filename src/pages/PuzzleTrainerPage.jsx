
import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Target } from 'lucide-react';
import CheckersBoard from '@/components/CheckersBoard.jsx';
import { createInitialBoard } from '@/utils/CheckersGameLogic.js';

const PuzzleTrainerPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Puzzle Trainer - NICD</title></Helmet>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 flex justify-center">
             <div className="w-full max-w-lg">
                <CheckersBoard boardState={createInitialBoard()} selectedSquare={null} validMoves={new Map()} onSquareClick={() => {}} />
             </div>
          </div>

          <div className="w-full lg:w-96 space-y-6">
            <Card className="bg-card border-border">
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black text-foreground">Tactics Trainer</h2>
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-500 font-bold rounded-md">Rating 1450</span>
                </div>
                
                <div className="p-4 bg-muted rounded-xl flex items-start gap-3 border border-border/50">
                  <Target className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <p className="font-bold text-foreground">White to move and win</p>
                    <p className="text-sm text-muted-foreground mt-1">Find the forced combination.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 border-border hover:border-primary"><Lightbulb className="w-4 h-4 mr-2" /> Hint</Button>
                  <Button variant="outline" className="flex-1 border-border hover:border-destructive hover:text-destructive">Skip</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 text-muted-foreground uppercase tracking-wider text-sm">Session Progress</h3>
                <div className="flex gap-2">
                  <div className="h-2 flex-1 rounded-full bg-green-500"></div>
                  <div className="h-2 flex-1 rounded-full bg-green-500"></div>
                  <div className="h-2 flex-1 rounded-full bg-red-500"></div>
                  <div className="h-2 flex-1 rounded-full bg-muted"></div>
                  <div className="h-2 flex-1 rounded-full bg-muted"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default PuzzleTrainerPage;
