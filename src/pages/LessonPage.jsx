
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import CheckersBoard from '@/components/CheckersBoard.jsx';
import { createInitialBoard } from '@/utils/CheckersGameLogic.js';

const LessonPage = () => {
  const [step, setStep] = useState(0);
  
  const steps = [
    { title: 'The Board', content: 'In 8x8 Checkers, we use an 8x8 board. Only the dark squares are used.' },
    { title: 'The Men', content: 'Pieces move diagonally forward. Try moving a piece to see how it works.' },
    { title: 'Capturing', content: 'Capturing is mandatory. You jump over an opponent\'s piece to an empty square behind it.' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Interactive Lesson - NICD</title></Helmet>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
          <div className="flex-[1.5] bg-card p-8 rounded-2xl border border-border shadow-sm flex flex-col">
            <div className="mb-6 flex items-center gap-3">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold tracking-wider uppercase">Step {step + 1} of {steps.length}</span>
              <h2 className="text-2xl font-bold">{steps[step].title}</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed flex-1">
              {steps[step].content}
            </p>
            <div className="mt-8 flex justify-between items-center pt-6 border-t border-border/50">
              <Button variant="outline" disabled={step === 0} onClick={() => setStep(s => s - 1)}>Previous</Button>
              {step < steps.length - 1 ? (
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setStep(s => s + 1)}>
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Complete Lesson
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="pointer-events-none opacity-80">
              <CheckersBoard boardState={createInitialBoard()} selectedSquare={null} validMoves={new Map()} onSquareClick={() => {}} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default LessonPage;
