
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { gameRegistry } from '@/utils/GameRegistry.js';

/**
 * Abstract Base Component for all games.
 * Provides standard layout, metadata injection, and lifecycle hooks.
 */
export default function GameBase({ gameId, children, title, onMount, onUnmount }) {
  const gameMeta = gameRegistry.getGame(gameId);
  const displayTitle = title || gameMeta?.name || 'Game';

  useEffect(() => {
    if (onMount) onMount();
    return () => {
      if (onUnmount) onUnmount();
    };
  }, [onMount, onUnmount]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Helmet>
        <title>{`${displayTitle} | NICD NICOLENIUM`}</title>
      </Helmet>
      <main className="flex-1 flex flex-col relative">
        {children}
      </main>
    </div>
  );
}
