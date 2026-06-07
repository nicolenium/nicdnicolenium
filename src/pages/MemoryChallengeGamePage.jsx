
import React from 'react';
import { UnifiedGameLayout } from '@/components/UnifiedGameLayout.jsx';
import { Helmet } from 'react-helmet';

export default function MemoryChallengeGamePage() {
  return (
    <>
      <Helmet><title>Memory Challenge | NICOLENIUM</title></Helmet>
      <UnifiedGameLayout title="Memory Challenge" turnText="Playing">
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-card rounded-3xl border-2 border-border shadow-xl p-8 text-center">
          <h2 className="text-4xl font-black text-primary mb-4">Memory Challenge</h2>
          <p className="text-xl text-muted-foreground font-medium max-w-md">
            Test your memory skills. Match the pairs to win!
          </p>
          <div className="mt-8 grid grid-cols-4 gap-4 w-full max-w-lg">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="aspect-square bg-primary/10 rounded-xl border-2 border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer flex items-center justify-center">
                <span className="text-2xl opacity-50">?</span>
              </div>
            ))}
          </div>
        </div>
      </UnifiedGameLayout>
    </>
  );
}
