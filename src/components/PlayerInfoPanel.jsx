
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flame, Target } from 'lucide-react';
import { cn } from '@/lib/utils.js';

const PlayerCard = ({ player, isCurrentTurn, isTop }) => {
  if (!player) return null;

  return (
    <div className={cn(
      "flex flex-col p-4 rounded-xl border transition-all duration-300",
      isCurrentTurn ? "bg-card border-primary shadow-glow-primary" : "bg-card/50 border-border opacity-80",
      isTop ? "mb-4" : "mt-4"
    )}>
      <div className="flex items-center gap-4 mb-3">
        <div className="relative">
          <Avatar className="w-14 h-14 border-2 border-background shadow-sm rounded-xl">
            <AvatarImage src={player.avatar} alt={player.name} className="object-cover" />
            <AvatarFallback className="bg-muted text-muted-foreground rounded-xl font-bold text-lg">
              {player.name?.substring(0, 2).toUpperCase() || 'P'}
            </AvatarFallback>
          </Avatar>
          <div className={cn(
            "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card",
            player.isOnline ? "bg-success" : "bg-muted-foreground"
          )} title={player.isOnline ? "Online" : "Offline"} />
        </div>
        
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-base font-bold text-foreground truncate">{player.name}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/30 text-xs px-1.5 py-0 rounded-md font-mono">
              {player.rating || 1200} ELO
            </Badge>
            {player.title && (
              <Badge variant="outline" className="text-[10px] px-1 py-0 border-primary/50 text-primary rounded-md">
                {player.title}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50">
        <div className="flex flex-col items-center justify-center bg-background/50 rounded-lg py-1.5">
          <Trophy className="w-3.5 h-3.5 text-primary mb-1" />
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Win Rate</span>
          <span className="text-xs font-bold text-foreground">{player.winRate || '0'}%</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-background/50 rounded-lg py-1.5">
          <Flame className="w-3.5 h-3.5 text-destructive mb-1" />
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Streak</span>
          <span className="text-xs font-bold text-foreground">{player.streak || 0}</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-background/50 rounded-lg py-1.5">
          <Target className="w-3.5 h-3.5 text-secondary mb-1" />
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Games</span>
          <span className="text-xs font-bold text-foreground">{player.gamesPlayed || 0}</span>
        </div>
      </div>
    </div>
  );
};

const PlayerInfoPanel = ({ player1, player2, currentTurn }) => {
  return (
    <div className="tournament-panel">
      <div className="tournament-panel-header">
        <span className="tournament-panel-title">Match Info</span>
      </div>
      <div className="p-4 flex flex-col h-full justify-between bg-background/30">
        <PlayerCard player={player2} isCurrentTurn={currentTurn === 2} isTop={true} />
        
        <div className="flex items-center justify-center py-2">
          <div className="h-px bg-border flex-1" />
          <span className="px-3 text-xs font-black text-muted-foreground uppercase tracking-widest">VS</span>
          <div className="h-px bg-border flex-1" />
        </div>

        <PlayerCard player={player1} isCurrentTurn={currentTurn === 1} isTop={false} />
      </div>
    </div>
  );
};

export default PlayerInfoPanel;
