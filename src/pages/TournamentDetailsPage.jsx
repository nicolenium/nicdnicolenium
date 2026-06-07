import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Trophy, Users, Calendar, Clock, Share2, UserPlus, Play, LogOut, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import TournamentInviteModal from '@/components/TournamentInviteModal.jsx';

const TournamentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  
  const [tournament, setTournament] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    fetchTournamentData();
  }, [id]);

  const fetchTournamentData = async () => {
    try {
      const tData = await pb.collection('tournaments').getOne(id, { expand: 'hostId', $autoCancel: false });
      setTournament(tData);

      const pData = await pb.collection('tournament_participants').getFullList({
        filter: `tournamentId = "${id}"`,
        expand: 'userId',
        $autoCancel: false
      });
      setParticipants(pData);

      const mData = await pb.collection('tournament_matches').getFullList({
        filter: `tournamentId = "${id}"`,
        sort: 'round,scheduledTime',
        $autoCancel: false
      });
      setMatches(mData);
    } catch (error) {
      console.error('Error fetching tournament:', error);
      toast.error('Failed to load tournament details');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsJoining(true);
    try {
      await pb.collection('tournament_participants').create({
        tournamentId: id,
        userId: currentUser.id,
        username: currentUser.username,
        status: 'registered',
        score: 0,
        wins: 0,
        losses: 0,
        draws: 0
      }, { $autoCancel: false });
      
      // Update tournament count
      await pb.collection('tournaments').update(id, {
        currentPlayers: (tournament.currentPlayers || 0) + 1
      }, { $autoCancel: false });

      toast.success('Successfully joined tournament!');
      fetchTournamentData();
    } catch (error) {
      toast.error('Failed to join tournament');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    const participantRecord = participants.find(p => p.userId === currentUser?.id);
    if (!participantRecord) return;
    
    try {
      await pb.collection('tournament_participants').delete(participantRecord.id, { $autoCancel: false });
      await pb.collection('tournaments').update(id, {
        currentPlayers: Math.max(0, (tournament.currentPlayers || 1) - 1)
      }, { $autoCancel: false });
      
      toast.success('Left tournament');
      fetchTournamentData();
    } catch (error) {
      toast.error('Failed to leave tournament');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 space-y-8">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!tournament) return <div className="p-8 text-center text-foreground">Tournament not found</div>;

  const isHost = currentUser?.id === tournament.hostId;
  const isParticipant = participants.some(p => p.userId === currentUser?.id);
  const isFull = (tournament.currentPlayers || 0) >= tournament.maxPlayers;
  const canJoin = !isHost && !isParticipant && !isFull && tournament.status === 'upcoming' && tournament.tournament_format === 'Public';

  return (
    <div className="min-h-screen bg-background pb-12">
      <Helmet><title>{tournament.name} - NICD PRODUCTIONS</title></Helmet>
      
      {/* Hero Header */}
      <div className="tournament-hero-section">
        <div className="container mx-auto relative z-10">
          <Button variant="ghost" onClick={() => navigate('/tournaments')} className="mb-6 text-muted-foreground hover:text-foreground -ml-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tournaments
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 capitalize">
                  {tournament.gameType}
                </Badge>
                <Badge variant="outline" className="bg-secondary text-secondary-foreground border-border">
                  {tournament.tournament_format}
                </Badge>
                <Badge variant="outline" className="bg-muted text-muted-foreground border-border capitalize">
                  {tournament.status}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-2">{tournament.name}</h1>
              <p className="text-lg text-muted-foreground">Hosted by {tournament.expand?.hostId?.username || 'Unknown'}</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="bg-card/50 backdrop-blur border-border">
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
              
              {isHost && tournament.status === 'upcoming' && (
                <>
                  <Button variant="secondary" onClick={() => setIsInviteModalOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" /> Invite Players
                  </Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Play className="w-4 h-4 mr-2" /> Start Tournament
                  </Button>
                </>
              )}
              
              {canJoin && (
                <Button onClick={handleJoin} disabled={isJoining} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {isJoining ? 'Joining...' : 'Join Tournament'}
                </Button>
              )}
              
              {isParticipant && tournament.status === 'upcoming' && (
                <Button variant="destructive" onClick={handleLeave}>
                  <LogOut className="w-4 h-4 mr-2" /> Leave
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">About Tournament</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {tournament.description || 'No description provided for this tournament.'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-foreground">Participants ({participants.length}/{tournament.maxPlayers})</CardTitle>
              </CardHeader>
              <CardContent>
                {participants.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No participants yet.</div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow className="border-border">
                          <TableHead className="text-muted-foreground">Player</TableHead>
                          <TableHead className="text-muted-foreground">Status</TableHead>
                          <TableHead className="text-right text-muted-foreground">Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {participants.map(p => (
                          <TableRow key={p.id} className="border-border">
                            <TableCell className="font-medium text-foreground flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                                {p.username.substring(0, 2).toUpperCase()}
                              </div>
                              {p.username}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize bg-background text-muted-foreground border-border">
                                {p.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono text-foreground">{p.score || 0}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Simplified Bracket / Matches View */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Matches</CardTitle>
              </CardHeader>
              <CardContent>
                {matches.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border rounded-xl bg-muted/10">
                    <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">Matches will be generated when the tournament starts.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {matches.map(match => (
                      <div key={match.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors cursor-pointer" onClick={() => navigate(`/matches/${match.id}`)}>
                        <div className="flex-1 flex items-center justify-end gap-4">
                          <span className="font-medium text-foreground">{match.player1Name}</span>
                          <span className="text-xl font-bold text-primary">{match.score1 || 0}</span>
                        </div>
                        <div className="px-4 text-muted-foreground text-sm font-bold">VS</div>
                        <div className="flex-1 flex items-center justify-start gap-4">
                          <span className="text-xl font-bold text-primary">{match.score2 || 0}</span>
                          <span className="font-medium text-foreground">{match.player2Name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Start Date</p>
                    <p className="text-sm">{new Date(tournament.startDate).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Trophy className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Format</p>
                    <p className="text-sm capitalize">{tournament.format?.replace('_', ' ') || 'Standard'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Time Control</p>
                    <p className="text-sm capitalize">{tournament.timeControl || 'Standard'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Players</p>
                    <p className="text-sm">{tournament.currentPlayers || 0} / {tournament.maxPlayers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>

      <TournamentInviteModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        tournament={tournament} 
      />
    </div>
  );
};

export default TournamentDetailsPage;