
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const GameComments = ({ sessionId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef(null);

  const fetchComments = async () => {
    if (!sessionId) return;
    try {
      const records = await pb.collection('game_comments').getFullList({
        filter: `game_id="${sessionId}"`,
        sort: 'created',
        expand: 'user_id',
        $autoCancel: false
      });
      setComments(records);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();

    if (sessionId) {
      pb.collection('game_comments').subscribe('*', (e) => {
        if (e.record.game_id === sessionId) {
          fetchComments(); // Refresh to get expansions easily
        }
      });
    }
    return () => pb.collection('game_comments').unsubscribe('*');
  }, [sessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !pb.authStore.isValid) return;

    try {
      await pb.collection('game_comments').create({
        game_id: sessionId,
        user_id: pb.authStore.model.id,
        comment_text: newComment.trim()
      }, { $autoCancel: false });
      setNewComment('');
    } catch (e) {
      toast.error("Failed to post comment");
    }
  };

  const handleDelete = async (id) => {
    try {
      await pb.collection('game_comments').delete(id, { $autoCancel: false });
    } catch (e) {
      toast.error("Failed to delete comment");
    }
  };

  if (!sessionId) return null;

  return (
    <Card className="bg-card border-border shadow-sm flex flex-col h-[500px]">
      <CardHeader className="py-4 border-b border-border">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" /> 
          Live Chat ({comments.length})
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-muted/50 rounded-lg"></div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground mt-10">Be the first to comment!</p>
          ) : (
            comments.map(comment => {
              const isOwner = pb.authStore.model?.id === comment.user_id;
              const authorName = comment.expand?.user_id?.username || 'Unknown User';
              
              return (
                <div key={comment.id} className="group relative bg-muted/20 p-3 rounded-lg border border-border/50">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-xs text-foreground">{authorName}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90">{comment.comment_text}</p>
                  
                  {isOwner && (
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Delete comment"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 border-t border-border bg-muted/10">
          {!pb.authStore.isValid ? (
            <p className="text-center text-xs text-muted-foreground py-2">Log in to participate in chat.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Say something..."
                className="min-h-[40px] h-[40px] resize-none py-2 text-sm bg-background text-foreground"
                maxLength={200}
              />
              <Button type="submit" size="icon" disabled={!newComment.trim()} className="shrink-0 h-[40px] w-[40px]">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameComments;
