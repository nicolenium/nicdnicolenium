
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

export default function HostGamePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [gameType, setGameType] = useState('chess');
  const [timeControl, setTimeControl] = useState('rapid_10min');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);

  const handleCreateGame = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to host a game.");
      return;
    }
    setLoading(true);
    try {
      const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const lobby = await pb.collection('game_lobbies').create({
        gameCode,
        hostId: currentUser.id,
        gameType,
        timeControl,
        difficulty,
        status: 'waiting'
      }, { $autoCancel: false });
      
      toast.success("Game created successfully!");
      navigate(`/game-room?code=${gameCode}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create game.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Host Game | NICD</title></Helmet>
      <Header />
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-12">
        <Card className="bg-card border-primary/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-primary text-center">Host a Game</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Game Type</label>
              <Select value={gameType} onValueChange={setGameType}>
                <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="chess">Chess</SelectItem>
                  <SelectItem value="checkers_8x8">Checkers 8x8</SelectItem>
                  <SelectItem value="checkers_10x10">Checkers 10x10</SelectItem>
                  <SelectItem value="ludo">Ludo</SelectItem>
                  <SelectItem value="tictactoe">Tic Tac Toe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Time Control</label>
              <Select value={timeControl} onValueChange={setTimeControl}>
                <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bullet_1min">Bullet (1 min)</SelectItem>
                  <SelectItem value="blitz_3min">Blitz (3 min)</SelectItem>
                  <SelectItem value="rapid_10min">Rapid (10 min)</SelectItem>
                  <SelectItem value="classical_30min">Classical (30 min)</SelectItem>
                  <SelectItem value="casual_unlimited">Casual (Unlimited)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Difficulty (if AI fills in)</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleCreateGame} disabled={loading} className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground">
              {loading ? "Creating..." : "Create Game"}
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
