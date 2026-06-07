
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const LikeButton = ({ sessionId }) => {
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeRecordId, setLikeRecordId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    const checkLikeStatus = async () => {
      try {
        // Get total likes for this game
        const gameSession = await pb.collection('game_sessions').getOne(sessionId, { $autoCancel: false });
        setLikesCount(gameSession.likes_count || 0);

        // Check if current user liked it
        if (pb.authStore.isValid) {
          const userLikes = await pb.collection('game_likes').getFullList({
            filter: `game_id="${sessionId}" && user_id="${pb.authStore.model.id}"`,
            $autoCancel: false
          });
          if (userLikes.length > 0) {
            setIsLiked(true);
            setLikeRecordId(userLikes[0].id);
          }
        }
      } catch (e) {
        console.error("Error checking like status", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkLikeStatus();

    // Subscribe to the game session to get live like count updates
    const unsubscribe = pb.collection('game_sessions').subscribe(sessionId, (e) => {
      if (e.action === 'update') {
        setLikesCount(e.record.likes_count || 0);
      }
    });

    return () => pb.collection('game_sessions').unsubscribe(sessionId);
  }, [sessionId]);

  const toggleLike = async () => {
    if (!pb.authStore.isValid) {
      toast.error("Please log in to like games.");
      return;
    }
    
    setIsLoading(true);
    try {
      if (isLiked && likeRecordId) {
        await pb.collection('game_likes').delete(likeRecordId, { $autoCancel: false });
        setIsLiked(false);
        setLikeRecordId(null);
        // Optimistic UI update (server hook will handle the real count)
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        const record = await pb.collection('game_likes').create({
          game_id: sessionId,
          user_id: pb.authStore.model.id
        }, { $autoCancel: false });
        setIsLiked(true);
        setLikeRecordId(record.id);
        // Optimistic UI update
        setLikesCount(prev => prev + 1);
      }
    } catch (e) {
      toast.error("Failed to update like status.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant={isLiked ? "default" : "outline"} 
      size="sm" 
      onClick={toggleLike}
      disabled={isLoading || !sessionId}
      className={`gap-2 transition-all ${isLiked ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:text-primary hover:border-primary/50'}`}
    >
      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
      <span>{likesCount}</span>
    </Button>
  );
};

export default LikeButton;
