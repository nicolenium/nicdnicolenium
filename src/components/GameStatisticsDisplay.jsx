
import React from 'react';
import { Activity, Crosshair, Swords, Timer } from 'lucide-react';

const StatBox = ({ icon: Icon, label, value, colorClass }) => (
  <div className="flex flex-col items-center justify-center p-3 bg-background/50 rounded-xl border border-border/50">
    <Icon className={`w-5 h-5 mb-1.5 ${colorClass}`} />
    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{label}</span>
    <span className="text-lg font-black text-foreground tabular-nums leading-none">{value}</span>
  </div>
);

const GameStatisticsDisplay = ({ 
  status = "In Progress", 
  moveCount = 0, 
  captured1 = 0, 
  captured2 = 0, 
  duration = "00:00" 
}) => {
  return (
    <div className="tournament-panel mt-4">
      <div className="tournament-panel-header">
        <span className="tournament-panel-title flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Match Statistics
        </span>
        <span className="text-xs font-bold text-primary animate-pulse">{status}</span>
      </div>
      
      <div className="p-4 grid grid-cols-2 gap-3 bg-background/30">
        <StatBox 
          icon={Swords} 
          label="Total Moves" 
          value={moveCount} 
          colorClass="text-secondary" 
        />
        <StatBox 
          icon={Timer} 
          label="Duration" 
          value={duration} 
          colorClass="text-primary" 
        />
        <StatBox 
          icon={Crosshair} 
          label="P1 Captures" 
          value={captured1} 
          colorClass="text-foreground" 
        />
        <StatBox 
          icon={Crosshair} 
          label="P2 Captures" 
          value={captured2} 
          colorClass="text-destructive" 
        />
      </div>
    </div>
  );
};

export default GameStatisticsDisplay;
