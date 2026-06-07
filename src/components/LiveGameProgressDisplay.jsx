
import React from 'react';
import { Activity, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const LiveGameProgressDisplay = ({ session }) => {
  if (!session) return null;

  // Mock progress visualization
  const p1Score = session.score || 0;
  const p2Score = session.opponentScore || 0;
  const total = Math.max(1, p1Score + p2Score);
  const p1Pct = (p1Score / total) * 100;

  return (
    <Card className="bg-card border border-border rounded-2xl overflow-hidden shadow-md">
      <div className="bg-muted/50 p-4 border-b flex justify-between items-center">
        <span className="font-bold uppercase tracking-widest text-xs flex items-center gap-2 text-destructive">
          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" /> Live Match
        </span>
        <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" /> {session.duration || 0}m elapsed
        </span>
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-center">
            <p className="font-black text-xl">{session.expand?.player1Id?.username || 'Player 1'}</p>
            <p className="text-4xl font-black text-primary mt-2">{p1Score}</p>
          </div>
          <div className="text-muted-foreground font-black text-2xl px-4">VS</div>
          <div className="text-center">
            <p className="font-black text-xl">{session.expand?.player2Id?.username || 'Player 2'}</p>
            <p className="text-4xl font-black text-secondary mt-2">{p2Score}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase">
            <span>Advantage</span>
          </div>
          <Progress value={p1Pct} className="h-3 bg-secondary" indicatorColor="bg-primary" />
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveGameProgressDisplay;
