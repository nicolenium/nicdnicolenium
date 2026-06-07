
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Bot, Users, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Label } from '@/components/ui/label.jsx';
import MatchmakingModal from '@/components/MatchmakingModal.jsx';
import GamePosterCard from '@/components/GamePosterCard.jsx';

export const UnifiedSetupPage = ({ title, gameRoute, gameId }) => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('Medium');
  const [timeControl, setTimeControl] = useState('10min');
  const [privacy, setPrivacy] = useState('Public');
  const [matchmakingOpen, setMatchmakingOpen] = useState(false);

  const handlePlayAI = () => {
    navigate(gameRoute, {
      state: { mode: 'HUMAN_VS_AI', difficulty, timeControl, opponent: 'AI Opponent' }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>{title} Setup | NICD Games</title></Helmet>
      <Header />
      
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-12">
        <Button variant="ghost" className="mb-8 rounded-full -ml-4 font-bold" onClick={() => navigate('/games')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Hub
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <GamePosterCard 
              title={title} 
              gameType={gameId} 
              onClick={() => {}} 
            />
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black font-serif mb-4">{title}</h1>
              <p className="text-muted-foreground text-lg">Configure your match settings before entering the arena.</p>
            </div>

            <Card className="bg-card border-border shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Difficulty Level</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="h-14 rounded-xl text-lg bg-muted/50 border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy (Beginner)</SelectItem>
                      <SelectItem value="Medium">Medium (Intermediate)</SelectItem>
                      <SelectItem value="Hard">Hard (Advanced)</SelectItem>
                      <SelectItem value="Expert">Expert (Master)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Time Control</Label>
                  <Select value={timeControl} onValueChange={setTimeControl}>
                    <SelectTrigger className="h-14 rounded-xl text-lg bg-muted/50 border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_limit">No Limit</SelectItem>
                      <SelectItem value="3min">3 Minutes</SelectItem>
                      <SelectItem value="5min">5 Minutes</SelectItem>
                      <SelectItem value="10min">10 Minutes</SelectItem>
                      <SelectItem value="30min">30 Minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Lobby Privacy</Label>
                  <Select value={privacy} onValueChange={setPrivacy}>
                    <SelectTrigger className="h-14 rounded-xl text-lg bg-muted/50 border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Public">Public Matchmaking</SelectItem>
                      <SelectItem value="Friends">Friends Only</SelectItem>
                      <SelectItem value="Private">Private Invite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button onClick={() => setMatchmakingOpen(true)} variant="outline" className="h-16 text-lg rounded-2xl border-2 hover:bg-muted font-bold">
                    <Users className="w-5 h-5 mr-2" /> Find Opponent
                  </Button>
                  <Button onClick={handlePlayAI} className="h-16 text-lg rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl font-bold hover:scale-[1.02] transition-transform">
                    <Bot className="w-5 h-5 mr-2" /> Play vs AI
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
      <MatchmakingModal 
        open={matchmakingOpen} 
        onOpenChange={setMatchmakingOpen} 
        gameId={gameId} 
        setupData={{ difficulty, timeControl, privacy }} 
      />
    </div>
  );
};
