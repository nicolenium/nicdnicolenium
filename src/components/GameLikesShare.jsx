
import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Share2, Copy, Facebook, Twitter } from 'lucide-react';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const GameLikesShare = ({ gameId }) => {
  const { currentUser } = useAuth();
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeRecordId, setLikeRecordId] = useState(null);

  useEffect(() => {
    if (!gameId || gameId.startsWith('guest')) return;

    const checkLikes = async () => {
      try {
        const session = await pb.collection('game_sessions').getOne(gameId, { $autoCancel: false });
        setLikes(session.likes_count || 0);

        if (currentUser) {
          const userLikes = await pb.collection('game_likes').getFullList({
            filter: `game_id = "${gameId}" && user_id = "${currentUser.id}"`,
            $autoCancel: false
          });
          if (userLikes.length > 0) {
            setHasLiked(true);
            setLikeRecordId(userLikes[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkLikes();
  }, [gameId, currentUser]);

  const toggleLike = async () => {
    if (!currentUser || !gameId || gameId.startsWith('guest')) return;

    try {
      if (hasLiked && likeRecordId) {
        await pb.collection('game_likes').delete(likeRecordId, { $autoCancel: false });
        await pb.collection('game_sessions').update(gameId, { likes_count: Math.max(0, likes - 1) }, { $autoCancel: false });
        setHasLiked(false);
        setLikes(l => l - 1);
        setLikeRecordId(null);
      } else {
        const record = await pb.collection('game_likes').create({
          game_id: gameId, user_id: currentUser.id
        }, { $autoCancel: false });
        await pb.collection('game_sessions').update(gameId, { likes_count: likes + 1 }, { $autoCancel: false });
        setHasLiked(true);
        setLikes(l => l + 1);
        setLikeRecordId(record.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/live`);
    toast.success('Link copied to clipboard!');
  };

  if (!gameId || gameId.startsWith('guest')) return null;

  return (
    <Card className="p-3 bg-card border-border flex items-center justify-between shadow-sm">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleLike} 
        className={`gap-2 ${hasLiked ? 'text-red-500 hover:text-red-600 hover:bg-red-500/10' : 'text-muted-foreground hover:text-foreground'}`}
      >
        <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
        <span className="font-semibold">{likes}</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
            <Share2 className="w-4 h-4" /> Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={copyLink} className="gap-2 cursor-pointer"><Copy className="w-4 h-4"/> Copy Link</DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check out this live game!&url=${window.location.origin}/live`, '_blank')} className="gap-2 cursor-pointer"><Twitter className="w-4 h-4"/> Twitter</DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/live`, '_blank')} className="gap-2 cursor-pointer"><Facebook className="w-4 h-4"/> Facebook</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
};

export default GameLikesShare;
