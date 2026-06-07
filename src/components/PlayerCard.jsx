
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Swords, Loader2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const PlayerCard = ({ player, currentUser, gameType = 'checkers' }) => {
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  const handleJoinGame = async () => {
    if (!currentUser) {
      toast.error('You must be logged in to join a game.');
      return;
    }
    
    setIsJoining(true);
    try {
      const session = await pb.collection('game_sessions').create({
        player1Id: currentUser.id,
        player2Id: player.userId,
        gameType: gameType,
        status: 'waiting',
        mode: 'human_vs_human'
      }, { $autoCancel: false });
      
      toast.success(`Game created with ${player.username}!`);
      navigate(`/${gameType}`, { state: { sessionId: session.id, mode: 'human_vs_human' } });
    } catch (error) {
      console.error('Error joining game:', error);
      toast.error('Failed to join game. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'in-game': return 'bg-blue-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="w-14 h-14 border-2 border-background shadow-sm">
            {player.avatar ? (
              <AvatarImage src={pb.files.getUrl(player, player.avatar)} alt={player.username} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                {player.username?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-background ${getStatusColor(player.status)}`}></span>
        </div>
        
        <div className="flex flex-col">
          <span className="font-bold text-foreground text-lg leading-tight">{player.username}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rating: {player.rating || 1200}</span>
            <span className="w-1 h-1 rounded-full bg-border"></span>
            <span className="text-xs font-medium text-muted-foreground capitalize">{player.status}</span>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleJoinGame} 
        disabled={isJoining || player.status === 'in-game' || player.userId === currentUser?.id}
        className="interactive-scale shadow-sm"
      >
        {isJoining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Swords className="w-4 h-4 mr-2" />}
        Join
      </Button>
    </div>
  );
};

export default PlayerCard;
