
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Activity, Target, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import LocationPrivacySettings from '@/components/LocationPrivacySettings.jsx';

const TournamentDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) return;
      try {
        const records = await pb.collection('tournament_leaderboard').getFullList({
          filter: `userId="${currentUser.id}"`,
          expand: 'tournamentId',
          sort: '-created',
          $autoCancel: false
        });
        setStats(records);
      } catch (error) {
        console.error('Error fetching tournament stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [currentUser]);

  const totalWins = stats.reduce((acc, curr) => acc + (curr.wins || 0), 0);
  const totalMatches = stats.reduce((acc, curr) => acc + (curr.wins||0) + (curr.losses||0) + (curr.draws||0), 0);
  const winRate = totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Tournament Dashboard | NICD PRODUCTIONS</title></Helmet>
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-24 max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-black mb-8 tracking-tight">Your Tournament Center</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-xl text-secondary"><Trophy className="w-8 h-8" /></div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Tournaments</p>
                <p className="text-3xl font-black">{stats.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary"><Target className="w-8 h-8" /></div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Win Rate</p>
                <p className="text-3xl font-black">{winRate}%</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-xl text-accent"><Activity className="w-8 h-8" /></div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Matches</p>
                <p className="text-3xl font-black">{totalMatches}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold">Recent Participations</h2>
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
            ) : stats.length === 0 ? (
              <div className="text-center p-12 border border-border rounded-xl bg-muted/30">
                <p className="text-muted-foreground mb-4">You haven't joined any tournaments yet.</p>
                <Button asChild className="interactive-scale"><Link to="/tournaments">Find Tournaments</Link></Button>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.map(stat => (
                  <div key={stat.id} className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{stat.expand?.tournamentId?.name || 'Tournament'}</h3>
                      <p className="text-sm text-muted-foreground">Score: <span className="font-bold text-foreground">{stat.score}</span> • W/D/L: {stat.wins}-{stat.draws}-{stat.losses}</p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="interactive-scale"><Link to="/tournaments">View <ArrowRight className="w-4 h-4 ml-1"/></Link></Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-lg">Location Settings</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">Control how your location appears on public leaderboards.</p>
                <LocationPrivacySettings />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TournamentDashboard;
