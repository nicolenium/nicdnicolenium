
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useGameInvitation } from '@/hooks/useGameInvitation.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle2, Swords } from 'lucide-react';
import { toast } from 'sonner';

const GameInvitationPage = ({ defaultGameType }) => {
  const { gameName, code } = useParams();
  const navigate = useNavigate();
  const { fetchInvitation, acceptInvitation, validateExpiration } = useGameInvitation();
  const { isAuthenticated, currentUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState(null);
  const [error, setError] = useState(null);
  const [accepting, setAccepting] = useState(false);

  // Fallback to route param if prop isn't passed directly
  const game = defaultGameType || gameName;

  useEffect(() => {
    const loadInvitation = async () => {
      setLoading(true);
      const record = await fetchInvitation(code);
      
      if (!record) {
        setError('Invitation not found or invalid link.');
      } else if (record.game_type !== game) {
        setError(`This invitation is for ${record.game_type}, not ${game}.`);
      } else if (!validateExpiration(record.expires_at)) {
        setError('This invitation has expired.');
      } else if (record.status === 'accepted') {
        // Already accepted, if it's us, just navigate
        if (currentUser && record.accepted_by_id === currentUser.id) {
          navigate(`/${game}`);
        } else {
          setError('This invitation has already been accepted by someone else.');
        }
      } else {
        setInvitation(record);
      }
      setLoading(false);
    };

    if (code) {
      loadInvitation();
    }
  }, [code, game, currentUser]);

  const handleAccept = async () => {
    if (!isAuthenticated) {
      toast.error('You must log in to accept this invitation.');
      navigate('/login', { state: { returnTo: `/${game}/invite/${code}` } });
      return;
    }

    if (invitation.inviter_id === currentUser.id) {
      toast.error('You cannot accept your own invitation.');
      return;
    }

    setAccepting(true);
    const updated = await acceptInvitation(invitation.id, currentUser.id);
    setAccepting(false);

    if (updated) {
      toast.success('Invitation accepted. Starting match...');
      // Set local storage config to trigger 2P mode automatically
      localStorage.setItem(`nicd_${game}_invite_match`, invitation.id);
      navigate(`/${game}`, { state: { mode: 'human_vs_human' } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Game Invitation | NICD PRODUCTIONS</title>
      </Helmet>
      
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 py-20">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>
          
          <div className="text-center mb-8 mt-4">
            {loading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <h2 className="text-xl font-bold">Validating Invitation...</h2>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="text-2xl font-black mb-2 text-foreground">Invitation Invalid</h2>
                <p className="text-muted-foreground">{error}</p>
                <Button className="mt-8 interactive-scale" onClick={() => navigate('/')}>Return Home</Button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-glow-cyan border border-primary/20">
                  <Swords className="w-10 h-10 text-primary" />
                </div>
                <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider mb-4 border border-secondary/30">
                  Challenge Received
                </span>
                <h2 className="text-3xl font-black mb-2 text-balance leading-tight">
                  <span className="text-primary">{invitation.inviter_name}</span> wants to play
                </h2>
                <h3 className="text-xl font-bold text-muted-foreground capitalize mb-8">{game}</h3>
                
                <div className="bg-muted p-4 rounded-xl border border-border w-full mb-8 flex flex-col gap-2 text-sm font-medium">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mode</span>
                    <span>1v1 Match</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-green-500 font-bold">Ready</span>
                  </div>
                </div>

                <Button 
                  onClick={handleAccept} 
                  disabled={accepting}
                  size="lg" 
                  className="w-full text-lg h-14 font-black bg-primary hover:bg-primary/90 interactive-scale"
                >
                  {accepting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                  {isAuthenticated ? 'Accept & Play' : 'Login to Accept'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GameInvitationPage;
