
import React from 'react';
import { UnifiedGameLayout } from '@/components/UnifiedGameLayout.jsx';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';

export default function QuizGamesGamePage() {
  return (
    <>
      <Helmet><title>Knowledge Quizzes | NICOLENIUM</title></Helmet>
      <UnifiedGameLayout title="Knowledge Quizzes" turnText="Question 1/10">
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-card rounded-3xl border-2 border-border shadow-xl p-8 text-center max-w-3xl mx-auto">
          <div className="w-full flex justify-between text-sm font-bold text-muted-foreground mb-8">
            <span>Score: 0</span>
            <span>Time: 30s</span>
          </div>
          
          <h2 className="text-3xl font-black text-foreground mb-8 leading-tight">
            What is the capital of Australia?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {['Sydney', 'Melbourne', 'Canberra', 'Perth'].map((option, i) => (
              <Button key={i} variant="outline" className="h-16 text-lg font-bold rounded-xl border-2 hover:border-primary hover:bg-primary/5 transition-all">
                {option}
              </Button>
            ))}
          </div>
        </div>
      </UnifiedGameLayout>
    </>
  );
}
