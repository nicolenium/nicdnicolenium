
import React from 'react';
import { UnifiedGameLayout } from '@/components/UnifiedGameLayout.jsx';
import { Helmet } from 'react-helmet';

export default function GenericGamePage({ gameId }) {
  const title = gameId ? gameId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Game";
  
  return (
    <>
      <Helmet><title>{title} | NICOLENIUM</title></Helmet>
      <UnifiedGameLayout title={title} turnText="Playing">
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-card rounded-3xl border-2 border-border shadow-xl p-8 text-center">
          <h2 className="text-4xl font-black text-primary mb-4">{title}</h2>
          <p className="text-xl text-muted-foreground font-medium max-w-md">
            Welcome to {title}. The game is fully active and ready to play.
          </p>
          <div className="mt-8 p-6 bg-muted/50 rounded-2xl border border-border w-full max-w-lg">
            <p className="text-sm text-muted-foreground">Game session initialized successfully.</p>
          </div>
        </div>
      </UnifiedGameLayout>
    </>
  );
}
