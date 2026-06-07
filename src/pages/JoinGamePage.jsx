
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

export default function JoinGamePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [gameCode, setGameCode] = useState('');
  const [availableGames, setAvailableGames] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailableGames();
  }, []);

  const fetchAvailableGames = async () => {
    try {
      const records = await pb.collection('game_lobbies').getList(1, 10, {
        filter: 'status = "waiting"',
        sort: '-created',
        $autoCancel: false
      });
      setAvailableGames(records.items);
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoinByCode = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to join.");
      return;
    }
    if (!gameCode.trim()) return;
    
    setLoading(true);
    try {
      const lobby = await pb.collection('game_lobbies').getFirstListItem(`gameCode="${gameCode.toUpperCase()}"`, { $autoCancel: false });
      if (lobby.status !== 'waiting') {
        toast.error("Game is no longer available.");
        return;
      }
      
      await pb.collection('game_lobbies').update(lobby.id, {
        opponentId: currentUser.id
      }, { $autoCancel: false });
      
      navigate(`/game-room?code=${lobby.gameCode}`);
    } catch (error) {
      toast.error("Invalid game code or game not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLobby = async (lobby) => {
    if (!currentUser) {
      toast.error("You must be logged in to join.");
      return;
    }
    try {
      await pb.collection('game_lobbies').update(lobby.id, {
        opponentId: currentUser.id
      }, { $autoCancel: false });
      navigate(`/game-room?code=${lobby.gameCode}`);
    } catch (error) {
      toast.error("Failed to join game.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Join Game | NICD</title></Helmet>
      <Header />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-card border-primary/30 shadow-lg h-fit">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-primary">Join by Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                placeholder="Enter 6-character code" 
                value={gameCode} 
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="text-center text-2xl font-mono tracking-widest h-14 uppercase bg-background text-foreground"
              />
              <Button onClick={handleJoinByCode} disabled={loading || gameCode.length < 6} className="w-full h-12 font-bold bg-primary text-primary-foreground">
                {loading ? "Joining..." : "Join Game"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-foreground">Available Games</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableGames.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No open games found. Try hosting one!</p>
              ) : (
                availableGames.map(game => (
                  <div key={game.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border border-border/50">
                    <div>
                      <p className="font-bold text-sm text-foreground uppercase">{game.gameType.replace('_', ' ')}</p>
                      <p className="text-xs text-muted-foreground">{game.timeControl.replace('_', ' ')}</p>
                    </div>
                    <Button size="sm" onClick={() => handleJoinLobby(game)} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      Join
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
