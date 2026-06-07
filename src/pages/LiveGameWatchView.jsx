
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Radio, Users, Share2, ArrowLeft, Download, Send, PlayCircle, PauseCircle } from 'lucide-react';
import { toast } from 'sonner';

const LiveGameWatchView = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSession();
    fetchComments();
    incrementViewer();

    // Subscriptions for real-time updates
    pb.collection('game_sessions').subscribe(id, function (e) {
      setSession(e.record);
    }).catch(() => {});

    pb.collection('game_comments').subscribe('*', function (e) {
      if (e.record.game_id === id && e.action === 'create') {
        fetchComments();
      }
    }).catch(() => {});

    return () => {
      decrementViewer();
      pb.collection('game_sessions').unsubscribe(id);
      pb.collection('game_comments').unsubscribe('*');
    };
  }, [id]);

  const fetchSession = async () => {
    try {
      const record = await pb.collection('game_sessions').getOne(id, {
        expand: 'userId',
        $autoCancel: false
      });
      setSession(record);
    } catch (err) {
      toast.error('Game session not found or ended.');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const records = await pb.collection('game_comments').getFullList({
        filter: `game_id = "${id}"`,
        sort: 'created',
        $autoCancel: false
      });
      setComments(records);
    } catch (err) {
      console.error(err);
    }
  };

  const incrementViewer = async () => {
    try {
      const current = await pb.collection('game_sessions').getOne(id, { $autoCancel: false });
      await pb.collection('game_sessions').update(id, { viewer_count: (current.viewer_count || 0) + 1 }, { $autoCancel: false });
    } catch (e) {}
  };

  const decrementViewer = async () => {
    try {
      const current = await pb.collection('game_sessions').getOne(id, { $autoCancel: false });
      if (current.viewer_count > 0) {
        await pb.collection('game_sessions').update(id, { viewer_count: current.viewer_count - 1 }, { $autoCancel: false });
      }
    } catch (e) {}
  };

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // Fallback ID if not logged in just for UI demonstration (requires auth normally)
    const userId = pb.authStore.model?.id || 'anonymous_spectator';
    
    if (userId === 'anonymous_spectator') {
      toast.error("Please log in to chat");
      return;
    }

    try {
      await pb.collection('game_comments').create({
        game_id: id,
        user_id: userId,
        comment_text: newComment
      }, { $autoCancel: false });
      setNewComment('');
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full border-4 border-brand-primary border-t-transparent h-12 w-12" /></div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-3xl font-bold mb-4">Stream Offline</h1>
        <Button asChild><Link to="/live-games">Back to Directory</Link></Button>
      </div>
    );
  }

  const gameTypeFormatted = session.gameType?.replace(/_/g, ' ') || 'Game';

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <Helmet><title>Watching {gameTypeFormatted} - NICD Live</title></Helmet>
      
      {/* Watch Header */}
      <header className="h-16 shrink-0 bg-card border-b border-border/50 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="hover:bg-accent/50">
            <Link to="/live-games"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div className="hidden sm:block h-6 w-px bg-border/50" />
          <div className="flex items-center gap-2">
            <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1.5 animate-pulse">
              LIVE
            </span>
            <h1 className="font-bold text-lg capitalize">{gameTypeFormatted} Match</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-accent/20 text-accent-foreground px-3 py-1.5 rounded-full text-sm font-bold">
            <Users className="w-4 h-4 text-brand-primary" /> {session.viewer_count || 0}
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex border-border"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
        </div>
      </header>

      {/* Main Watch Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Game/Video Area */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-black relative">
          <div className="flex-1 flex items-center justify-center p-4">
            {/* Mock Board / Stream Container */}
            <div className="w-full max-w-[90vh] aspect-square lg:aspect-video bg-card/20 rounded-2xl border border-white/10 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
              <Radio className="w-24 h-24 text-white/20 mb-6" />
              <p className="text-white/50 text-xl font-bold tracking-widest uppercase mb-2">Live Spectator View</p>
              <p className="text-white/30 text-sm">Rendering live state for {gameTypeFormatted}...</p>
              
              {/* Optional Camera Feed PiP Mock */}
              {session.camera_enabled && (
                <div className="absolute bottom-4 right-4 w-48 aspect-video bg-zinc-900 rounded-lg border border-white/20 overflow-hidden shadow-xl">
                  <div className="absolute inset-0 flex items-center justify-center"><Users className="w-8 h-8 text-white/20" /></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Below Stream Controls & Info */}
          <div className="shrink-0 p-6 bg-card border-t border-border/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border-2 border-brand-primary">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-brand-primary/20 text-brand-primary font-bold">P1</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg">{session.expand?.userId?.username || 'Player 1'}</h3>
                  <p className="text-sm text-muted-foreground">Playing {gameTypeFormatted} • {session.difficulty || 'Casual'} Mode</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="secondary" className="flex-1 sm:flex-none"><Download className="w-4 h-4 mr-2" /> Save PGN</Button>
                <Button className="flex-1 sm:flex-none bg-brand-primary hover:bg-brand-primary/90 text-primary-foreground"><PlayCircle className="w-4 h-4 mr-2" /> Follow Match</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Chat & Stats) */}
        <div className="w-full lg:w-80 lg:border-l border-border/50 bg-card flex flex-col shrink-0 h-[40vh] lg:h-auto">
          <CardHeader className="py-4 border-b border-border/50 shrink-0">
            <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wide">
              Live Chat
            </CardTitle>
          </CardHeader>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-10 italic">No messages yet. Say hello!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="text-sm">
                    <span className="font-bold text-brand-primary mr-2">User_{comment.user_id.substring(0,4)}:</span>
                    <span className="text-foreground/90">{comment.comment_text}</span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-border/50 shrink-0 bg-background/50">
            <form onSubmit={handleSendComment} className="flex gap-2">
              <Input 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Send a message..." 
                className="bg-card text-sm h-9"
              />
              <Button type="submit" size="icon" className="h-9 w-9 bg-brand-primary shrink-0"><Send className="w-4 h-4" /></Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveGameWatchView;
