
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Clock, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const MOCK_TOURNAMENTS = [
  { id: 1, name: "Global Checkers Championship", timeControl: "Rapid", players: 128, maxPlayers: 256, status: "Registering", fee: "Free" },
  { id: 2, name: "Weekend Blitz Arena", timeControl: "Blitz", players: 45, maxPlayers: 64, status: "Registering", fee: "50 Coins" },
  { id: 3, name: "Grandmaster Invitational", timeControl: "Classical", players: 16, maxPlayers: 16, status: "Full", fee: "Invite Only" },
  { id: 4, name: "Daily Bullet Brawl", timeControl: "Bullet", players: 89, maxPlayers: 100, status: "Registering", fee: "Free" },
];

const TournamentAccessPanel = () => {
  const [filter, setFilter] = useState('All');

  const handleRegister = (t) => {
    if (t.status === 'Full') {
      toast.error("Tournament is full.");
      return;
    }
    toast.success(`Registered for ${t.name}!`);
  };

  const filtered = filter === 'All' ? MOCK_TOURNAMENTS : MOCK_TOURNAMENTS.filter(t => t.timeControl === filter);

  return (
    <div className="tournament-panel flex-1 min-h-[300px]">
      <div className="tournament-panel-header">
        <span className="tournament-panel-title flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" />
          Live Tournaments
        </span>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary hover:text-primary/80">
          Leaderboard <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>

      <div className="p-3 border-b border-border bg-background/50 flex gap-2 overflow-x-auto no-scrollbar">
        {['All', 'Bullet', 'Blitz', 'Rapid', 'Classical'].map(f => (
          <Badge 
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setFilter(f)}
          >
            {f}
          </Badge>
        ))}
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="flex flex-col gap-3">
          {filtered.map(t => (
            <div key={t.id} className="bg-card border border-border/50 rounded-xl p-3 hover:border-primary/50 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{t.name}</h4>
                <Badge variant={t.status === 'Full' ? 'secondary' : 'default'} className="text-[10px] px-1.5 py-0 h-4">
                  {t.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {t.timeControl}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {t.players}/{t.maxPlayers}</span>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-medium text-foreground">{t.fee}</span>
                <Button 
                  size="sm" 
                  className="h-7 text-xs px-3 rounded-lg" 
                  variant={t.status === 'Full' ? 'secondary' : 'default'}
                  disabled={t.status === 'Full'}
                  onClick={() => handleRegister(t)}
                >
                  {t.status === 'Full' ? 'Closed' : 'Register'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TournamentAccessPanel;
