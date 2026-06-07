
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Trophy, Play, Settings, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const MyTournamentsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [hosted, setHosted] = useState([]);
  const [participating, setParticipating] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Hosted
      const hostedData = await pb.collection('tournaments').getFullList({
        filter: `hostId = "${currentUser.id}" && status != "completed"`,
        sort: '-created',
        $autoCancel: false
      });
      setHosted(hostedData);

      // Fetch Participating
      const partData = await pb.collection('tournament_participants').getFullList({
        filter: `userId = "${currentUser.id}"`,
        expand: 'tournamentId',
        $autoCancel: false
      });
      
      const activePart = partData.filter(p => p.expand?.tournamentId?.status !== 'completed');
      const compPart = partData.filter(p => p.expand?.tournamentId?.status === 'completed');
      
      setParticipating(activePart.map(p => p.expand.tournamentId));
      setCompleted(compPart.map(p => p.expand.tournamentId));

      // Fetch Stats
      try {
        const userStats = await pb.collection('user_tournament_stats').getFirstListItem(`userId="${currentUser.id}"`, { $autoCancel: false });
        setStats(userStats);
      } catch (e) {
        // Stats might not exist yet
        setStats({ totalTournamentsHosted: hostedData.length, totalTournamentsJoined: partData.length, totalWins: 0, winRate: 0 });
      }

    } catch (error) {
      console.error('Error fetching my tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const TournamentList = ({ tournaments, type }) => {
    if (tournaments.length === 0) {
      return (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground">No tournaments found</h3>
          <p className="text-muted-foreground mb-4">You don't have any {type} tournaments yet.</p>
          {type === 'hosted' && (
            <Button onClick={() => navigate('/tournaments/create')}>Create One Now</Button>
          )}
          {type === 'participating' && (
            <Button onClick={() => navigate('/tournaments')}>Find Tournaments</Button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tournaments.map(t => (
          <Card key={t.id} className="bg-card border-border flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {t.status}
                </span>
                <span className="text-xs text-muted-foreground capitalize">{t.gameType}</span>
              </div>
              <CardTitle className="text-xl text-foreground line-clamp-1">{t.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(t.startDate).toLocaleDateString()}
              </div>
              <div className="flex gap-2 mt-4">
                <Button className="flex-1" variant="secondary" onClick={() => navigate(`/tournaments/${t.id}`)}>
                  <Eye className="w-4 h-4 mr-2" /> View
                </Button>
                {type === 'hosted' && t.status === 'upcoming' && (
                  <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Play className="w-4 h-4 mr-2" /> Start
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <Helmet><title>My Tournaments - NICD PRODUCTIONS</title></Helmet>
      
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">My Tournaments</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Hosted', value: stats?.totalTournamentsHosted || 0 },
            { label: 'Joined', value: stats?.totalTournamentsJoined || 0 },
            { label: 'Wins', value: stats?.totalWins || 0 },
            { label: 'Win Rate', value: `${stats?.winRate || 0}%` }
          ].map((stat, i) => (
            <Card key={i} className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{loading ? <Skeleton className="h-8 w-16 mx-auto" /> : stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="participating" className="w-full">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8 bg-muted">
            <TabsTrigger value="participating">Playing</TabsTrigger>
            <TabsTrigger value="hosted">Hosting</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1,2,3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
              </div>
            ) : (
              <>
                <TabsContent value="participating" className="mt-0">
                  <TournamentList tournaments={participating} type="participating" />
                </TabsContent>
                <TabsContent value="hosted" className="mt-0">
                  <TournamentList tournaments={hosted} type="hosted" />
                </TabsContent>
                <TabsContent value="completed" className="mt-0">
                  <TournamentList tournaments={completed} type="completed" />
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MyTournamentsPage;
