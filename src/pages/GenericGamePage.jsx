import React from 'react';
import { UnifiedGameLayout } from '@/components/UnifiedGameLayout.jsx';
import { Helmet } from 'react-helmet';

export default function GenericGamePage({ gameId, mode, timeControl, rated }) {
  const title = gameId? gameId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Game";

  return (
    <>
      <Helmet><title>{title} | NICOLENIUM</title></Helmet>
      <UnifiedGameLayout title={title} turnText="Playing">
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-card rounded-3xl border-2 border-border shadow-xl p-8 text-center">
          <h2 className="text-4xl font-black text-primary mb-4">{title}</h2>
          <p className="text-xl text-muted-foreground font-medium max-w-md mb-6">
            Welcome to {title}. The game is fully active and ready to play.
          </p>

          <div className="mt-4 p-6 bg-muted/50 rounded-2xl border border-border w-full max-w-lg text-left">
            <h3 className="font-bold text-lg mb-3">Game Settings</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><span className="font-semibold text-foreground">Mode:</span> {mode}</p>
              <p><span className="font-semibold text-foreground">Time Control:</span> {timeControl}</p>
              <p><span className="font-semibold text-foreground">Rated:</span> {rated? 'Yes' : 'No'}</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-muted/50 rounded-2xl border border-border w-full max-w-lg">
            <p className="text-sm text-muted-foreground">Game session initialized successfully.</p>
            <p className="text-xs text-muted-foreground mt-2">Real game logic goes here later.</p>
          </div>
        </div>
      </UnifiedGameLayout>
    </>
  );
}
