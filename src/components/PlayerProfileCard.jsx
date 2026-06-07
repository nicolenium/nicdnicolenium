
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Button } from '@/components/ui/button.jsx';
import { UserPlus, UserCheck, Clock, Trophy, Swords } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const PlayerProfileCard = ({ player, compact = false }) => {
  const { currentUser } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState('none'); // none, pending, connected
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser || !player || currentUser.id === player.id) return;

    const checkConnection = async () => {
      try {
        const records = await pb.collection('player_connections').getFullList({
          filter: `(userId="${currentUser.id}" && connectedUserId="${player.id}") || (userId="${player.id}" && connectedUserId="${currentUser.id}")`,
          $autoCancel: false
        });

        if (records.length > 0) {
          setConnectionStatus(records[0].status);
        }
      } catch (err) {
        console.error("Error checking connection:", err);
      }
    };

    checkConnection();
  }, [currentUser, player]);

  const handleConnect = async () => {
    if (!currentUser) {
      toast.error("Please log in to connect with players.");
      return;
    }

    setLoading(true);
    try {
      await pb.collection('player_connections').create({
        userId: currentUser.id,
        connectedUserId: player.id,
        status: 'pending'
      }, { $autoCancel: false });
      
      setConnectionStatus('pending');
      toast.success(`Connection request sent to ${player.username || 'Player'}`);
    } catch (err) {
      console.error("Error sending request:", err);
      toast.error("Failed to send request.");
    } finally {
      setLoading(false);
    }
  };

  if (!player) return null;

  const initials = (player.username || player.name || 'P').substring(0, 2).toUpperCase();
  const avatarUrl = player.avatar ? pb.files.getUrl(player, player.avatar) : null;

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-card border p-2 rounded-xl shadow-sm">
        <Avatar className="w-10 h-10 rounded-xl border-2 border-primary/20">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">{player.username || player.name || 'Unknown Player'}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Trophy className="w-3 h-3 text-yellow-500" /> Rating: {player.rating || 1200}
          </p>
        </div>
        {currentUser && currentUser.id !== player.id && (
          <Button 
            size="icon" 
            variant={connectionStatus === 'connected' ? 'secondary' : 'outline'} 
            className="w-8 h-8 rounded-lg shrink-0"
            onClick={handleConnect}
            disabled={loading || connectionStatus !== 'none'}
          >
            {connectionStatus === 'connected' ? <UserCheck className="w-4 h-4 text-green-500" /> : 
             connectionStatus === 'pending' ? <Clock className="w-4 h-4 text-yellow-500" /> : 
             <UserPlus className="w-4 h-4" />}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="overflow-hidden border-2 shadow-md">
      <div className="h-16 bg-gradient-to-r from-primary/20 to-secondary/20 w-full" />
      <CardContent className="p-5 pt-0 relative">
        <Avatar className="w-20 h-20 rounded-2xl border-4 border-card shadow-lg absolute -top-10 bg-muted">
          <AvatarImage src={avatarUrl} className="object-cover" />
          <AvatarFallback className="rounded-2xl text-2xl font-black">{initials}</AvatarFallback>
        </Avatar>
        
        <div className="mt-12">
          <h3 className="text-xl font-black font-serif">{player.username || player.name || 'Unknown Player'}</h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Trophy className="w-4 h-4 text-yellow-500" /> {player.rating || 1200} ELO</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Swords className="w-4 h-4" /> {player.gamesPlayed || 0} Games</span>
          </div>
          
          {currentUser && currentUser.id !== player.id && (
            <Button 
              className="w-full mt-4 rounded-xl font-bold" 
              variant={connectionStatus === 'connected' ? 'secondary' : 'default'}
              onClick={handleConnect}
              disabled={loading || connectionStatus !== 'none'}
            >
              {connectionStatus === 'connected' ? <><UserCheck className="w-4 h-4 mr-2 text-green-500" /> Connected</> : 
               connectionStatus === 'pending' ? <><Clock className="w-4 h-4 mr-2" /> Request Pending</> : 
               <><UserPlus className="w-4 h-4 mr-2" /> Connect</>}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerProfileCard;
