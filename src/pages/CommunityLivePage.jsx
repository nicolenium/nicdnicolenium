
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Radio, Users, Eye, PlayCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { useNavigate } from 'react-router-dom';

export default function CommunityLivePage() {
  const [liveGames, setLiveGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveGames = async () => {
      try {
        const records = await pb.collection('game_sessions').getFullList({
          filter: 'public_mode = true && status != "completed"',
          sort: '-created',
          expand: 'player1Id,player2Id',
          $autoCancel: false
        });
        setLiveGames(records);
      } catch (err) {
        console.error("Error fetching live games:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveGames();
    
    // Subscribe to real-time updates
    pb.collection('game_sessions').subscribe('*', function (e) {
      if (e.action === 'create' || e.action === 'update') {
        if (e.record.public_mode && e.record.status !== 'completed') {
          setLiveGames(prev => {
            const exists = prev.find(g => g.id === e.record.id);
            if (exists) return prev.map(g => g.id === e.record.id ? e.record : g);
            return [e.record, ...prev];
          });
        } else {
          setLiveGames(prev => prev.filter(g => g.id !== e.record.id));
        }
      } else if (e.action === 'delete') {
        setLiveGames(prev => prev.filter(g => g.id !== e.record.id));
      }
    });

    return () => {
      pb.collection('game_sessions').unsubscribe('*');
    };
  }, []);

  const filteredGames = liveGames.filter(game => 
    game.gameType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.expand?.player1Id?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.expand?.player2Id?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Community Live | NICD Games</title></Helmet>
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-serif flex items-center gap-3">
              <Radio className="w-10 h-10 text-destructive animate-pulse" /> Community Live
            </h1>
            <p className="text-muted-foreground text-lg mt-2">Watch live matches and connect with players.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search games or players..." 
              className="pl-10 h-12 rounded-xl bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-24 bg-card border-2 border-dashed rounded-3xl">
            <Radio className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-bold mb-2">No Live Games</h3>
            <p className="text-muted-foreground">There are currently no public games being played.</p>
            <Button className="mt-6 rounded-xl" onClick={() => navigate('/games')}>Start a Game</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map(game => (
              <Card key={game.id} className="overflow-hidden border-2 hover:border-primary/50 transition-colors group cursor-pointer" onClick={() => navigate(`/spectate/${game.id}`)}>
                <div className="h-32 bg-muted relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  <PlayCircle className="w-12 h-12 text-primary/50 group-hover:text-primary group-hover:scale-110 transition-all z-10" />
                  <Badge variant="destructive" className="absolute top-3 left-3 animate-pulse">LIVE</Badge>
                  <Badge variant="secondary" className="absolute top-3 right-3 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {game.viewer_count || Math.floor(Math.random() * 50) + 1}
                  </Badge>
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-sm uppercase tracking-wider text-primary">{game.gameType?.replace('_', ' ')}</span>
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">{game.status}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs">
                        {game.expand?.player1Id?.username?.substring(0, 2).toUpperCase() || 'P1'}
                      </div>
                      <span className="font-medium text-sm truncate max-w-[80px]">{game.expand?.player1Id?.username || 'Player 1'}</span>
                    </div>
                    <span className="text-muted-foreground font-bold text-sm">VS</span>
                    <div className="flex items-center gap-2 flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center font-bold text-xs">
                        {game.expand?.player2Id?.username?.substring(0, 2).toUpperCase() || 'P2'}
                      </div>
                      <span className="font-medium text-sm truncate max-w-[80px]">{game.expand?.player2Id?.username || 'Waiting...'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
