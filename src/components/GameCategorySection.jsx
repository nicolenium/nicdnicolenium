
import React from 'react';
import GameCard from './GameCard.jsx';

export default function GameCategorySection({ title, description, games }) {
  return (
    <section className="py-16">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-black tracking-tight mb-3 text-foreground">{title}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">{description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, idx) => (
            <GameCard key={idx} {...game} />
          ))}
        </div>
      </div>
    </section>
  );
}
