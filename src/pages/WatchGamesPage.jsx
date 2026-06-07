
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Radio, Users, ShieldCheck, Gamepad2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { useNavigate } from 'react-router-dom';

const WatchGamesPage = () => {
  const [liveGames, setLiveGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveGames = async () => {
      try {
        const records = await pb.collection('game_sessions').getList(1, 20, {
          filter: 'status = "in_progress" && game_mode = "public"',
          sort: '-created',
          $autoCancel: false
        });
        setLiveGames(records.items);
      } catch (error) {
        console.error('Failed to fetch live games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveGames();
  }, []);

  return (
    <div className="flex-1 container max-w-7xl mx-auto px-4 py-12">
      <Helmet><title>Watch Live Games | NICD Games</title></Helmet>
      
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
          <Radio className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight">Watch Live Games</h1>
          <p className="text-muted-foreground text-lg mt-1">Spectate public matches happening right now.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : liveGames.length === 0 ? (
        <div className="text-center py-24 bg-card/50 border rounded-3xl">
          <Gamepad2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">No live games right now</h3>
          <p className="text-muted-foreground mb-6">Check back later or start a game yourself!</p>
          <Button onClick={() => navigate('/games')}>Play a Game</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveGames.map(game => (
            <Card key={game.id} className="card-premium overflow-hidden group hover:border-primary/50 transition-colors">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-black capitalize flex items-center gap-2">
                      {game.gameType || 'Game'}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Spectating enabled
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    LIVE
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6 text-sm font-medium">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" /> {game.spectator_count || 0} watching
                  </div>
                  <div className="text-muted-foreground truncate max-w-[150px]">
                    Players: {game.player1Id?.substring(0,6)} vs {game.player2Id?.substring(0,6) || 'AI'}
                  </div>
                </div>
                <Button 
                  className="w-full h-12 font-bold" 
                  onClick={() => navigate(`/spectate/${game.id}`)}
                >
                  <Play className="w-4 h-4 mr-2" /> Spectate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchGamesPage;
