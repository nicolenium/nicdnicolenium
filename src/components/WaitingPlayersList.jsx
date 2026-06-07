
import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Swords, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const WaitingPlayersList = ({ gameType, onChallengeSent }) => {
  const { currentUser } = useAuth();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [challengingId, setChallengingId] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const records = await pb.collection('waiting_players').getList(1, 50, {
          filter: `status="online"`,
          sort: '-created',
          $autoCancel: false
        });
        setPlayers(records.items.filter(p => p.userId !== currentUser?.id));
      } catch (error) {
        console.error('Error fetching waiting players:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();

    const subscribe = async () => {
      try {
        await pb.collection('waiting_players').subscribe('*', (e) => {
          if (e.action === 'create' && e.record.userId !== currentUser?.id) {
            setPlayers(prev => [e.record, ...prev]);
          } else if (e.action === 'update') {
            setPlayers(prev => prev.map(p => p.id === e.record.id ? e.record : p));
          } else if (e.action === 'delete') {
            setPlayers(prev => prev.filter(p => p.id !== e.record.id));
          }
        });
      } catch (err) {
        console.error('Subscription error:', err);
      }
    };

    subscribe();
    return () => {
      pb.collection('waiting_players').unsubscribe('*').catch(() => {});
    };
  }, [currentUser]);

  const handleChallenge = async (player) => {
    if (!currentUser) {
      toast.error('You must be logged in to challenge players.');
      return;
    }

    setChallengingId(player.id);
    try {
      // Create a game session in 'waiting' state which acts as a request
      await pb.collection('game_sessions').create({
        player1Id: currentUser.id,
        player2Id: player.userId,
        gameType: gameType,
        status: 'waiting',
        mode: 'human_vs_human'
      }, { $autoCancel: false });
      
      toast.success(`Challenge sent to ${player.username}! Waiting for response.`);
      if (onChallengeSent) onChallengeSent();
    } catch (error) {
      console.error('Error sending challenge:', error);
      toast.error('Failed to send challenge.');
    } finally {
      setChallengingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3 py-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center justify-between p-3 border border-border rounded-xl">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
        <Swords className="w-8 h-8 mb-3 opacity-20" />
        <p className="font-medium text-sm">No players currently waiting.</p>
        <p className="text-xs mt-1">Try inviting a friend using a link!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
      {players.map(player => (
        <div key={player.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-10 h-10 border border-border">
                {player.avatar ? (
                  <AvatarImage src={pb.files.getUrl(player, player.avatar)} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {player.username?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-card shadow-sm"></span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-foreground">{player.username}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider bg-primary/10 px-1.5 py-0.5 rounded">
                  {player.rating || 1200} ELO
                </span>
              </div>
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={() => handleChallenge(player)}
            disabled={challengingId === player.id}
            className="interactive-scale h-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold shadow-sm"
          >
            {challengingId === player.id ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <Swords className="w-3 h-3 mr-1.5" />}
            Challenge
          </Button>
        </div>
      ))}
    </div>
  );
};

export default WaitingPlayersList;
