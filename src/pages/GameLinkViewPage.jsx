
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import { Eye, Users, Clock, Trophy, ArrowLeft, Play, SkipBack, SkipForward } from 'lucide-react';
import CheckersBoard10x10 from '@/components/CheckersBoard10x10.jsx';
import { toast } from 'sonner';

const GameLinkViewPage = () => {
  const { gameType, gameId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [replayStep, setReplayStep] = useState(-1);

  useEffect(() => {
    let unsubscribe;
    
    const fetchSession = async () => {
      try {
        setLoading(true);
        const records = await pb.collection('game_sessions').getFullList({
          filter: `gameId = "${gameId}"`,
          $autoCancel: false
        });
        
        if (records.length > 0) {
          const record = records[0];
          setSession(record);
          setReplayStep(record.moveHistory?.length || 0);
          
          await pb.collection('game_sessions').update(record.id, {
            viewCount: (record.viewCount || 0) + 1
          }, { $autoCancel: false });

          if (record.status === 'in-progress') {
            unsubscribe = await pb.collection('game_sessions').subscribe(record.id, (e) => {
              setSession(e.record);
              setReplayStep(e.record.moveHistory?.length || 0);
            });
          }
        } else {
          setError("Game session not found.");
        }
      } catch (err) {
        console.error("Error fetching game session:", err);
        setError("Failed to load game session.");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    return () => {
      if (unsubscribe) {
        pb.collection('game_sessions').unsubscribe(session?.id);
      }
    };
  }, [gameId]);

  if (loading) {
    return (
      <div className="flex flex-col bg-background p-4 py-12">
        <main className="flex-1 container max-w-5xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 aspect-square">
              <Skeleton className="w-full h-full rounded-2xl" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex flex-col bg-background p-4 py-24 text-center">
        <main className="flex-1 container max-w-3xl mx-auto">
          <div className="bg-muted/50 p-12 rounded-3xl border-2 border-dashed">
            <h2 className="text-3xl font-black font-serif mb-4">Game Not Found</h2>
            <p className="text-muted-foreground mb-8">{error || "The link might be invalid or the game has been removed."}</p>
            <Button onClick={() => navigate('/games')} size="lg" className="rounded-xl">
              Browse Games
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const isLive = session.status === 'in-progress';
  const isCheckers = gameType === 'checkers';

  return (
    <div className="flex flex-col bg-background">
      <Helmet><title>Watch {gameType} Match | NICD Games</title></Helmet>

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-4 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-black font-serif capitalize">{gameType} Match</h1>
              {isLive ? (
                <span className="px-3 py-1 bg-destructive/10 text-destructive text-xs font-bold rounded-full uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" /> Live
                </span>
              ) : (
                <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-bold rounded-full uppercase tracking-widest">
                  Completed
                </span>
              )}
            </div>
            <p className="text-muted-foreground flex items-center gap-4 text-sm font-medium">
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {session.mode?.replace(/_/g, ' ') || 'Unknown'}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {session.timeControl || 'Standard'}</span>
              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {session.viewCount || 0} views</span>
            </p>
          </div>
          
          {session.result && (
            <div className="bg-primary/10 text-primary px-6 py-3 rounded-2xl border border-primary/20 flex items-center gap-3">
              <Trophy className="w-6 h-6" />
              <div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">Result</div>
                <div className="font-black">{session.result.replace(/_/g, ' ').toUpperCase()}</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 flex flex-col items-center">
            <div className="w-full max-w-[70vh] aspect-square relative">
              {isCheckers ? (
                <CheckersBoard10x10 
                  board={session.boardState10x10 || []} 
                  interactive={false}
                  currentPlayer={parseInt(session.currentPlayer || '1')}
                />
              ) : (
                <div className="w-full h-full bg-muted rounded-2xl border-4 border-dashed flex items-center justify-center text-muted-foreground font-medium">
                  Board visualization not available for {gameType}
                </div>
              )}
            </div>

            {!isLive && (
              <div className="w-full max-w-[70vh] mt-6 bg-card border rounded-2xl p-4 flex items-center justify-center gap-4 shadow-sm">
                <Button variant="outline" size="icon" className="rounded-full" disabled={replayStep <= 0} onClick={() => setReplayStep(s => Math.max(0, s - 1))}>
                  <SkipBack className="w-4 h-4" />
                </Button>
                <div className="font-mono font-bold text-sm w-24 text-center">
                  Move {replayStep} / {session.moveHistory?.length || 0}
                </div>
                <Button variant="outline" size="icon" className="rounded-full" disabled={replayStep >= (session.moveHistory?.length || 0)} onClick={() => setReplayStep(s => Math.min(session.moveHistory?.length || 0, s + 1))}>
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-2 shadow-sm rounded-2xl overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-primary to-secondary" />
              <CardHeader className="pb-3 bg-muted/30">
                <CardTitle className="text-lg font-black font-serif">Match Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl">
                  <span className="text-sm font-bold">Player 1 (White)</span>
                  <span className="text-sm font-medium">{session.player1Id === 'guest' ? 'Guest' : 'Player 1'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl">
                  <span className="text-sm font-bold">Player 2 (Black)</span>
                  <span className="text-sm font-medium">{session.player2Id === 'ai' || session.player2Id === 'computer' ? `AI (${session.difficulty || 'Medium'})` : 'Player 2'}</span>
                </div>
                <Button className="w-full rounded-xl mt-2" onClick={() => navigate(`/games/${gameType}/setup`)}>
                  <Play className="w-4 h-4 mr-2 fill-current" /> Play This Game
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-sm rounded-2xl flex flex-col h-[400px]">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg font-black font-serif">Move History</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-0">
                {(!session.moveHistory || session.moveHistory.length === 0) ? (
                  <div className="p-8 text-center text-muted-foreground text-sm font-medium">No moves recorded yet.</div>
                ) : (
                  <div className="divide-y">
                    {session.moveHistory.map((move, idx) => (
                      <div key={idx} className={`p-3 px-4 text-sm font-mono flex gap-4 ${idx === replayStep - 1 ? 'bg-primary/10 text-primary font-bold' : ''}`}>
                        <span className="text-muted-foreground w-6">{idx + 1}.</span>
                        <span>{move}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
};

export default GameLinkViewPage;
