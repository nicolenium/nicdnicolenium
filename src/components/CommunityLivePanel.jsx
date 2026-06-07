
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Radio, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import pb from '@/lib/pocketbaseClient.js';

export default function CommunityLivePanel({ onClose }) {
  const [liveGames, setLiveGames] = useState([]);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const records = await pb.collection('game_sessions').getList(1, 5, {
          filter: 'status = "in-progress"',
          sort: '-created',
          $autoCancel: false
        });
        setLiveGames(records.items);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLive();
  }, []);

  return (
    <div className="flex flex-col h-full bg-card border-l border-border shadow-2xl w-full sm:w-80 absolute right-0 top-0 bottom-0 z-40 animate-in slide-in-from-right-8 overflow-y-auto">
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30 sticky top-0 z-10 shrink-0">
        <h3 className="font-bold text-lg tracking-tight flex items-center gap-2">
          <Radio className="w-5 h-5 text-destructive animate-pulse" />
          Community Live
        </h3>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="p-4 space-y-4 flex-1">
        {liveGames.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 text-sm font-medium">
            No live games playing right now. Check back soon!
          </div>
        ) : (
          liveGames.map(game => (
            <Card key={game.id} className="bg-muted/50 border-border hover:border-primary/50 transition-colors cursor-pointer shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="outline" className="text-xs font-bold uppercase tracking-wider">{game.gameType?.replace('_', ' ')}</Badge>
                  <span className="text-xs font-bold text-destructive flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {Math.floor(Math.random() * 50) + 1}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="truncate max-w-[100px] text-foreground">{game.player1Id?.substring(0,6) || 'Player 1'}</span>
                  <span className="text-muted-foreground text-xs font-black uppercase tracking-widest mx-2">vs</span>
                  <span className="truncate max-w-[100px] text-foreground">{game.player2Id?.substring(0,6) || 'Player 2'}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
