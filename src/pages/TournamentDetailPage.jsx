
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { useGameTypeIcon } from '@/hooks/useGameTypeIcon.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Calendar, Clock, Trophy, Users, LayoutList, Network, ArrowRight, Lock, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';

import TournamentNavigationBar from '@/components/TournamentNavigationBar.jsx';
import TournamentRulesAccordion from '@/components/TournamentRulesAccordion.jsx';
import TournamentShareModal from '@/components/TournamentShareModal.jsx';
import TournamentRegistrationForm from '@/components/TournamentRegistrationForm.jsx';
import Footer from '@/components/Footer.jsx';

export default function TournamentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated } = useAuth();
  const { getGameTypeInfo } = useGameTypeIcon();

  const [tournament, setTournament] = useState(null);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const fetchTournamentData = async () => {
    try {
      setLoading(true);
      const record = await pb.collection('tournaments').getOne(id, { $autoCancel: false });
      setTournament(record);

      const partsRes = await pb.collection('tournament_registrations').getList(1, 1, {
        filter: `tournamentId = "${id}"`,
        $autoCancel: false
      });
      setParticipantsCount(partsRes.totalItems);

      // If user is logged in, check if they are already registered
      if (isAuthenticated && currentUser) {
        const myRegRes = await pb.collection('tournament_registrations').getList(1, 1, {
          filter: `tournamentId = "${id}" && userId = "${currentUser.id}"`,
          $autoCancel: false
        });
        setIsRegistered(myRegRes.totalItems > 0);
      }

    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Tournament not found or unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournamentData();
  }, [id, isAuthenticated, currentUser]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background flex-col gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-muted-foreground font-bold animate-pulse">Loading Arena...</p>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-background">
        <TournamentNavigationBar title="Not Found" />
        <div className="flex-1 flex items-center justify-center flex-col text-center px-4">
          <Trophy className="w-16 h-16 text-muted-foreground/30 mb-6" />
          <h2 className="text-3xl font-black mb-2">Tournament Missing</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">The tournament you are looking for does not exist or has been removed from the platform.</p>
          <Button onClick={() => navigate('/tournaments')} size="lg" className="font-bold">Browse Active Tournaments</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const { icon: GameIcon, color, bg } = getGameTypeInfo(tournament.game_type || tournament.gameType);
  const startDate = new Date(tournament.startDate);
  const isPast = startDate < new Date();
  const isFull = participantsCount >= tournament.maxPlayers;
  const fillPercentage = Math.min(100, (participantsCount / tournament.maxPlayers) * 100);

  // Parse Rules Safely
  let rulesObj = {};
  if (typeof tournament.rules === 'string') {
    try {
      rulesObj = JSON.parse(tournament.rules);
    } catch (e) {
      rulesObj = { gameRules: tournament.rules };
    }
  } else if (typeof tournament.rules === 'object') {
    rulesObj = tournament.rules;
  }

  const shareLink = tournament.shareable_link || `/tournament/${id}`;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <Helmet><title>{`${tournament.name} | NICD Productions`}</title></Helmet>
      
      <TournamentNavigationBar title={tournament.name} />

      <main className="flex-1 flex flex-col w-full pb-20">
        {/* Hero Section */}
        <section className="tournament-hero-section shadow-xl border-b border-border relative">
          <div className="max-w-5xl mx-auto w-full relative z-10 flex flex-col md:flex-row items-end md:items-end justify-between gap-8">
            <div className="flex items-start gap-5 md:gap-8 flex-1 w-full">
              <div className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl ${bg} ${color} border border-white/10`}>
                <GameIcon className="w-10 h-10 md:w-14 md:h-14" />
              </div>
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-background/50 backdrop-blur-sm capitalize tracking-wider font-bold">
                    {(tournament.game_type || tournament.gameType).replace('_', ' ')}
                  </Badge>
                  <Badge className="bg-primary/20 text-primary border-primary/30 capitalize tracking-wider font-bold">
                    {tournament.tournament_format || 'Standard Format'}
                  </Badge>
                  {isFull && <Badge variant="destructive" className="font-bold tracking-wider">FULL</Badge>}
                </div>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-balance leading-tight tracking-tighter">
                  {tournament.name}
                </h2>
                <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-4 text-muted-foreground font-medium text-sm md:text-base">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary"/> {startDate.toLocaleDateString()}</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 md:w-5 md:h-5 text-primary"/> {startDate.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                  <div className="flex items-center gap-2"><Trophy className="w-4 h-4 md:w-5 md:h-5 text-amber-500"/> ${tournament.prizePool || 0} Pool</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout */}
        <section className="max-w-5xl mx-auto w-full px-4 md:px-8 pt-10 md:pt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            {/* Description */}
            {(tournament.description || tournament.rules?.description) && (
              <div className="space-y-4">
                <h3 className="tournament-section-title">About the Event</h3>
                <p className="text-muted-foreground leading-relaxed text-lg max-w-prose">
                  {tournament.description || tournament.rules?.description}
                </p>
              </div>
            )}

            {/* Rules Accordion */}
            <div className="space-y-4">
              <h3 className="tournament-section-title">Tournament Rules</h3>
              <TournamentRulesAccordion rules={rulesObj} />
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="flex flex-col gap-6">
            {/* Registration Card */}
            <div className="tournament-card bg-secondary/30 backdrop-blur-md border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-lg flex items-center gap-2"><Users className="w-5 h-5 text-blue-400"/> Registration</h4>
                <span className="font-mono text-sm font-bold bg-background px-2 py-1 rounded-md">{participantsCount} / {tournament.maxPlayers}</span>
              </div>
              <Progress value={fillPercentage} className="h-3 mb-6 bg-background" />
              
              {/* Dynamic Registration Button based on Auth State */}
              {!isAuthenticated ? (
                <Button 
                  className="w-full font-bold text-base h-12 shadow-lg hover:shadow-xl transition-all" 
                  onClick={() => navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`)}
                >
                  <Lock className="w-4 h-4 mr-2" /> Login to Register
                </Button>
              ) : isRegistered ? (
                <Button variant="outline" className="w-full font-bold text-base h-12 border-emerald-500/50 text-emerald-500 bg-emerald-500/10 cursor-default" disabled>
                  <CheckCircle className="w-4 h-4 mr-2" /> Already Registered
                </Button>
              ) : (
                <Dialog open={isRegModalOpen} onOpenChange={setIsRegModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full font-bold text-base h-12 shadow-lg hover:shadow-xl transition-all bg-primary text-primary-foreground hover:bg-primary/90" 
                      disabled={isFull || isPast}
                    >
                      {isFull ? 'Capacity Reached' : isPast ? 'Event Started' : 'Secure Your Spot'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Tournament Entry</DialogTitle>
                    </DialogHeader>
                    <TournamentRegistrationForm 
                      tournamentId={tournament.id} 
                      onSuccess={() => {
                        setIsRegModalOpen(false);
                        fetchTournamentData(); // Refresh UI to show "Already Registered"
                      }} 
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Quick Links Card */}
            <div className="tournament-card p-4 gap-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">Navigation</h4>
              <Button variant="ghost" className="w-full justify-between hover:bg-muted/50 font-bold" onClick={() => navigate(`/tournaments/${id}/bracket`)}>
                <span className="flex items-center"><Network className="w-4 h-4 mr-3 text-muted-foreground"/> Live Bracket</span>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </Button>
              <Button variant="ghost" className="w-full justify-between hover:bg-muted/50 font-bold" onClick={() => navigate(`/tournaments/${id}/standings`)}>
                <span className="flex items-center"><LayoutList className="w-4 h-4 mr-3 text-muted-foreground"/> Leaderboard</span>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </Button>
            </div>

            {/* Share Card */}
            <TournamentShareModal 
              tournamentId={tournament.id} 
              tournamentName={tournament.name} 
              customLink={shareLink} 
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
