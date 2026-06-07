
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Clock, PlayCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';

const TournamentMatchesPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { isAdminAuthenticated } = useAdminAuth();
  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();

    pb.collection('tournament_matches').subscribe('*', function (e) {
      if (e.record.tournamentId === id) {
        fetchData();
      }
    });

    return () => pb.collection('tournament_matches').unsubscribe('*');
  }, [id]);

  const fetchData = async () => {
    try {
      const tData = await pb.collection('tournaments').getOne(id, { $autoCancel: false });
      setTournament(tData);

      const mData = await pb.collection('tournament_matches').getFullList({
        filter: `tournamentId="${id}"`,
        sort: 'round,matchTime',
        $autoCancel: false
      });
      setMatches(mData);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter(m => filter === 'all' || m.status === filter);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'in_progress': return <Badge className="bg-red-500 animate-[live-pulse_2s_infinite]">Live</Badge>;
      case 'completed': return <Badge className="bg-emerald-500">Completed</Badge>;
      default: return <Badge variant="secondary" className="bg-blue-500 text-white">Scheduled</Badge>;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading matches...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Matches | {tournament?.name}</title></Helmet>
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Button variant="ghost" asChild className="-ml-4 mb-2">
              <Link to={`/tournaments/${id}`}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
            </Button>
            <h1 className="text-3xl font-bold">{tournament?.name} Matches</h1>
          </div>
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="w-full mb-8">
          <TabsList>
            <TabsTrigger value="all">All Matches</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="in_progress">Live Now</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredMatches.length === 0 ? (
          <div className="py-16 text-center bg-muted/20 rounded-2xl border">
            <p className="text-muted-foreground">No matches found for this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map(match => {
              const isParticipant = currentUser && (match.player1Id === currentUser.id || match.player2Id === currentUser.id);
              return (
                <Card key={match.id} className={`overflow-hidden border-t-4 ${match.status === 'in_progress' ? 'border-t-red-500' : match.status === 'completed' ? 'border-t-emerald-500' : 'border-t-blue-500'}`}>
                  <CardHeader className="pb-3 border-b bg-muted/10">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Round {match.round}</span>
                      {getStatusBadge(match.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4">
                      <div className={`flex justify-between items-center p-3 rounded-lg ${match.winnerId === match.player1Id ? 'bg-primary/10 font-bold' : 'bg-muted/30'}`}>
                        <span>Player: {match.player1Id.substring(0,6)}...</span>
                        <span className="text-lg">{match.score1 ?? '-'}</span>
                      </div>
                      <div className={`flex justify-between items-center p-3 rounded-lg ${match.winnerId === match.player2Id ? 'bg-primary/10 font-bold' : 'bg-muted/30'}`}>
                        <span>Player: {match.player2Id ? match.player2Id.substring(0,6) + '...' : 'TBD'}</span>
                        <span className="text-lg">{match.score2 ?? '-'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t flex justify-between items-center">
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {match.matchTime ? new Date(match.matchTime).toLocaleString() : 'TBA'}
                      </span>
                      
                      {(isParticipant || isAdminAuthenticated) && match.status === 'scheduled' && (
                        <Button size="sm"><PlayCircle className="w-4 h-4 mr-2" /> Join</Button>
                      )}
                      {isAdminAuthenticated && match.status !== 'completed' && (
                        <Button variant="outline" size="sm">Edit Score</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TournamentMatchesPage;
