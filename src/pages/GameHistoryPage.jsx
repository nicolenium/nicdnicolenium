
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Trophy, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';

const GameHistoryPage = () => {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      if (!pb.authStore.isValid) {
        setIsLoading(false);
        return;
      }
      try {
        const records = await pb.collection('game_sessions').getList(1, 50, {
          filter: `player1Id="${pb.authStore.model.id}" || player2Id="${pb.authStore.model.id}"`,
          sort: '-created',
          expand: 'player1Id,player2Id',
          $autoCancel: false
        });
        setGames(records.items);
      } catch (e) {
        console.error("Failed to fetch game history:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGames();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Game History | NICD</title></Helmet>
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary/10 rounded-xl">
            <History className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground">Your Game History</h1>
            <p className="text-muted-foreground">Review your past matches and performance.</p>
          </div>
        </div>

        {!pb.authStore.isValid ? (
          <Card className="bg-card text-center p-12">
            <p className="text-muted-foreground mb-4">You must be logged in to view history.</p>
            <Link to="/login" className="text-primary font-bold hover:underline">Log In</Link>
          </Card>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted/50 rounded-xl animate-pulse"></div>)}
          </div>
        ) : games.length === 0 ? (
          <Card className="bg-card text-center p-16 border-dashed border-2">
            <PlayCircle className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Games Yet</h3>
            <p className="text-muted-foreground mb-6">You haven't played any recorded matches.</p>
            <Link to="/checkers" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold">Play Now</Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {games.map(game => (
              <Card key={game.id} className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6 flex-1 w-full">
                    <div className="text-center w-24 shrink-0">
                      <p className="text-xs text-muted-foreground mb-1"><Calendar className="w-3 h-3 inline mr-1"/>{new Date(game.created).toLocaleDateString()}</p>
                      <Badge variant="outline" className="capitalize">{game.gameType || 'Checkers'}</Badge>
                    </div>
                    
                    <div className="flex-1 flex justify-between items-center bg-muted/20 rounded-xl p-4 border border-border/50">
                      <div className="font-bold w-1/3 truncate text-right">{game.expand?.player1Id?.username || 'Player 1'}</div>
                      <div className="w-1/3 text-center px-4 font-black text-muted-foreground text-sm tracking-widest">VS</div>
                      <div className="font-bold w-1/3 truncate text-left">{game.expand?.player2Id?.username || 'Player 2'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-xs font-bold text-muted-foreground uppercase">Result</p>
                      <p className={`font-bold ${game.status === 'completed' ? 'text-primary' : 'text-muted-foreground'}`}>
                        {game.status}
                      </p>
                    </div>
                    <Link to={`/checkers?replay=${game.id}`} className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors" aria-label="View Game">
                      <PlayCircle className="w-5 h-5" />
                    </Link>
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
};

// Quick missing import fix for icon
import { History } from 'lucide-react';

export default GameHistoryPage;
