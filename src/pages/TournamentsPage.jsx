
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, Users, Plus, ShieldCheck, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const TournamentsPage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = currentUser?.collectionName === 'admin_users';

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const records = await pb.collection('tournaments').getList(1, 20, {
          sort: '-created',
          $autoCancel: false
        });
        setTournaments(records.items);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Tournaments | NICD</title></Helmet>
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 flex items-center gap-3">
              <Trophy className="w-10 h-10 text-primary" /> Tournaments
            </h1>
            <p className="text-muted-foreground text-lg">Compete in official NICD events and climb the global rankings.</p>
          </div>
          
          {isAdmin && (
            <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20">
              <Link to="/tournaments/organize"><Plus className="w-5 h-5 mr-2" /> Create Tournament</Link>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="card-premium animate-pulse h-64" />
            ))}
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-3xl text-muted-foreground">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <h3 className="text-2xl font-bold mb-2">No Active Tournaments</h3>
            <p>Check back later for upcoming events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map(t => (
              <Card key={t.id} className="card-premium flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="uppercase tracking-wider font-bold">{t.gameType.replace('_', ' ')}</Badge>
                    <Badge className={t.status === 'active' ? 'bg-destructive text-destructive-foreground' : 'bg-secondary text-secondary-foreground'}>
                      {t.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold leading-tight">{t.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" /> Starts: {new Date(t.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2" /> Players: {t.currentPlayers || 0} / {t.maxPlayers}
                    </div>
                    {t.prizePool > 0 && (
                      <div className="flex items-center text-sm font-bold text-primary">
                        <Trophy className="w-4 h-4 mr-2" /> Prize Pool: ${t.prizePool}
                      </div>
                    )}
                  </div>
                  <Button asChild className="w-full rounded-full font-bold" variant={t.status === 'active' ? 'default' : 'outline'}>
                    <Link to={`/tournaments/${t.id}`}>
                      {t.status === 'active' ? 'Join Now' : 'View Details'}
                      {!isAuthenticated && <Lock className="w-3.5 h-3.5 ml-2 opacity-50" />}
                    </Link>
                  </Button>
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

export default TournamentsPage;
