
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Trophy, Clock, Play, ArrowLeft, History, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const MatchDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const data = await pb.collection('tournament_matches').getOne(id, {
          expand: 'tournamentId',
          $autoCancel: false
        });
        setMatch(data);
      } catch (error) {
        console.error('Error fetching match:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-background p-8 flex justify-center"><Skeleton className="h-96 w-full max-w-3xl rounded-2xl" /></div>;
  }

  if (!match) return <div className="p-8 text-center text-foreground">Match not found</div>;

  const isParticipant = currentUser?.id === match.player1Id || currentUser?.id === match.player2Id;
  const canPlay = isParticipant && (match.status === 'scheduled' || match.status === 'in_progress');

  return (
    <div className="min-h-screen bg-background py-12">
      <Helmet><title>Match Details - NICD PRODUCTIONS</title></Helmet>
      
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-muted-foreground hover:text-foreground -ml-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <Card className="bg-card border-border shadow-2xl overflow-hidden">
          <div className="bg-muted/30 p-6 border-b border-border text-center">
            <Badge variant="outline" className="mb-4 bg-background text-muted-foreground border-border">
              Round {match.round} • {match.expand?.tournamentId?.name}
            </Badge>
            
            <div className="flex items-center justify-center gap-8 md:gap-16 my-8">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-secondary flex items-center justify-center text-2xl font-bold text-secondary-foreground shadow-lg mb-4">
                  {match.player1Name.substring(0, 2).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-foreground">{match.player1Name}</h3>
                <span className="text-3xl font-black text-primary mt-2">{match.score1 || 0}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">VS</span>
                <Badge variant="outline" className="bg-background border-border capitalize">{match.status.replace('_', ' ')}</Badge>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-secondary flex items-center justify-center text-2xl font-bold text-secondary-foreground shadow-lg mb-4">
                  {match.player2Name.substring(0, 2).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-foreground">{match.player2Name}</h3>
                <span className="text-3xl font-black text-primary mt-2">{match.score2 || 0}</span>
              </div>
            </div>

            {canPlay && (
              <Button size="lg" className="w-full max-w-xs mx-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Play className="w-5 h-5 mr-2" /> Enter Match Room
              </Button>
            )}
          </div>

          <CardContent className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-foreground flex items-center border-b border-border pb-2">
                <Settings className="w-5 h-5 mr-2 text-primary" /> Match Settings
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Game Type</span>
                  <span className="font-medium text-foreground capitalize">{match.gameType.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format</span>
                  <span className="font-medium text-foreground">Best of {match.bestOfSeries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Limit</span>
                  <span className="font-medium text-foreground">{match.timeLimit ? `${match.timeLimit} mins` : 'Standard'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-bold text-foreground flex items-center border-b border-border pb-2">
                <History className="w-5 h-5 mr-2 text-primary" /> Timeline
              </h4>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-primary bg-background text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-border bg-muted/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-foreground text-sm">Scheduled</span>
                      <span className="text-xs text-muted-foreground">{new Date(match.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {match.status === 'completed' && (
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-primary bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-primary/30 bg-primary/5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-primary text-sm">Completed</span>
                        <span className="text-xs text-muted-foreground">{new Date(match.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-foreground mt-1">Winner: {match.winnerId === match.player1Id ? match.player1Name : match.player2Name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MatchDetailsPage;
