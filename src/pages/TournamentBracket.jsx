
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy } from 'lucide-react';

const TournamentBracket = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder fetch logic
    setLoading(false);
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Tournament Bracket - NICD PRODUCTIONS</title></Helmet>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <Button asChild variant="ghost" className="mb-4 text-muted-foreground hover:text-primary">
            <Link to="/tournaments"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Tournaments</Link>
          </Button>
          
          <Card className="border-primary/20 bg-card shadow-glow">
            <CardHeader className="border-b border-border/50 pb-6">
              <CardTitle className="text-3xl text-primary flex items-center gap-3">
                <Trophy className="w-8 h-8" /> Tournament Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="p-12 border-2 border-dashed border-primary/30 bg-muted/20 rounded-xl text-center flex flex-col items-center justify-center min-h-[300px]">
                <Avatar className="w-16 h-16 mb-4 border-2 border-primary/50">
                  <AvatarFallback className="bg-primary/10 text-primary">?</AvatarFallback>
                </Avatar>
                <p className="text-lg font-bold text-foreground mb-2">Bracket Visualization</p>
                <p className="text-sm text-muted-foreground">Tournament ID: {id}<br/>Matches will appear here with player avatars.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TournamentBracket;
