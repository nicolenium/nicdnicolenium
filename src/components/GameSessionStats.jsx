
import React from 'react';
import { Calendar, Swords, Gauge } from 'lucide-react';

const GameSessionStats = ({ gameType, difficulty, gameDate }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-card border border-border rounded-xl shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Swords className="w-4 h-4 text-accent" />
        <span className="uppercase tracking-wider">{gameType}</span>
      </div>
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Gauge className="w-4 h-4 text-secondary" />
        <span className="uppercase tracking-wider">{difficulty}</span>
      </div>
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Calendar className="w-4 h-4" />
        <span>{gameDate}</span>
      </div>
    </div>
  );
};

export default GameSessionStats;
