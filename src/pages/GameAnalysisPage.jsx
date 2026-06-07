
import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Cpu } from 'lucide-react';
import CheckersBoard from '@/components/CheckersBoard.jsx';
import { createInitialBoard } from '@/utils/CheckersGameLogic.js';

const GameAnalysisPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Game Analysis - NICD</title></Helmet>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 flex flex-col items-center">
             <div className="w-full max-w-lg mb-6">
                <CheckersBoard boardState={createInitialBoard()} selectedSquare={null} validMoves={new Map()} onSquareClick={() => {}} />
             </div>
             <div className="flex gap-4 bg-card p-3 rounded-full border border-border shadow-sm">
               <button className="p-2 hover:bg-muted rounded-full transition-colors"><SkipBack className="w-5 h-5" /></button>
               <button className="p-2 hover:bg-muted rounded-full transition-colors"><Play className="w-5 h-5" /></button>
               <button className="p-2 hover:bg-muted rounded-full transition-colors"><Pause className="w-5 h-5" /></button>
               <button className="p-2 hover:bg-muted rounded-full transition-colors"><SkipForward className="w-5 h-5" /></button>
             </div>
          </div>

          <div className="w-full lg:w-96 space-y-6">
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-0">
                <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2"><Cpu className="w-4 h-4 text-primary" /> AI Evaluation</h3>
                  <span className="font-mono font-bold text-green-500">+1.2</span>
                </div>
                <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex justify-between font-mono text-sm mb-1">
                      <span className="font-bold text-foreground">14. 32-28?</span>
                      <span className="text-red-500">Blunder</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Drops evaluation from +1.2 to -0.5. Best move was 33-29 protecting the center.</p>
                  </div>
                  <div className="p-3 hover:bg-muted/50 transition-colors rounded-lg">
                    <div className="flex justify-between font-mono text-sm mb-1">
                      <span className="font-bold text-foreground">15. 18x27</span>
                      <span className="text-muted-foreground">Book</span>
                    </div>
                  </div>
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
export default GameAnalysisPage;
