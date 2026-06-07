
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Users, Activity, MessageSquare, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient.js';

export default function CommunityPage() {
  const [liveGames, setLiveGames] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const live = await pb.collection('community_live_games').getList(1, 5, { filter: 'status="in_progress"', $autoCancel: false });
        setLiveGames(live.items);
        
        const recent = await pb.collection('game_sessions').getList(1, 10, { filter: 'status="completed"', sort: '-updated', $autoCancel: false });
        setRecentMatches(recent.items);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Community | NICD</title></Helmet>
      <Header />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-primary uppercase tracking-tight mb-4">Community Hub</h1>
          <p className="text-muted-foreground text-lg">Connect, watch, and chat with players worldwide.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent"><Activity className="w-5 h-5" /> Live Games</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {liveGames.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No live games at the moment.</p>
                ) : (
                  liveGames.map(game => (
                    <div key={game.id} className="flex justify-between items-center p-4 rounded-xl bg-muted/30 border border-border/50">
                      <div>
                        <p className="font-bold text-foreground">{game.player1Name || 'Player 1'} vs {game.player2Name || 'Player 2'}</p>
                        <p className="text-xs text-muted-foreground uppercase">{game.gameType}</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-accent text-accent hover:bg-accent/10">Spectate</Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground"><Trophy className="w-5 h-5 text-secondary" /> Recent Matches</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentMatches.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No recent matches found.</p>
                ) : (
                  recentMatches.map(match => (
                    <div key={match.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/20 border border-border/30">
                      <span className="text-sm font-medium text-foreground uppercase">{match.gameType}</span>
                      <span className="text-sm font-bold text-primary">Score: {match.score || 0}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-card border-border shadow-lg h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground"><MessageSquare className="w-5 h-5 text-primary" /> Global Chat</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end bg-muted/10 rounded-b-xl p-4">
                <div className="text-center text-muted-foreground text-sm mb-4">Chat feature coming soon.</div>
                <div className="flex gap-2">
                  <input type="text" disabled placeholder="Type a message..." className="flex-1 bg-background border border-border rounded-lg px-3 text-sm opacity-50 cursor-not-allowed" />
                  <Button disabled size="sm" className="bg-primary text-primary-foreground opacity-50">Send</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
