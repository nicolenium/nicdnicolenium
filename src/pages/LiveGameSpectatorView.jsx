
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Eye, ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';
import SpectatorChat from '@/components/SpectatorChat.jsx';
import LiveGameProgressDisplay from '@/components/LiveGameProgressDisplay.jsx';

const LiveGameSpectatorView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const record = await pb.collection('game_sessions').getOne(id, {
          expand: 'player1Id,player2Id',
          $autoCancel: false
        });
        setSession(record);
        
        // Optimistic spectator count bump could happen here via API
      } catch(e) {
        console.error(e);
      }
    };
    loadSession();

    pb.collection('game_sessions').subscribe(id, (e) => {
      setSession(e.record);
    });

    return () => { pb.collection('game_sessions').unsubscribe(id); };
  }, [id]);

  if (!session) return <div className="min-h-screen flex items-center justify-center">Loading live feed...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Spectating Live Match | NICD</title></Helmet>
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/games')} className="mb-6 rounded-full font-bold">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Games
        </Button>

        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]">
          <div className="flex-1 flex flex-col gap-6">
            <LiveGameProgressDisplay session={session} />
            
            <div className="flex-1 bg-card border border-border rounded-2xl flex items-center justify-center p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full text-xs font-bold">
                <Users className="w-4 h-4" /> {session.spectator_count || 1} watching
              </div>
              <div className="text-center text-muted-foreground">
                <Eye className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-xl font-bold">Live Board Rendering Area</p>
                <p>Real-time moves sync via PocketBase</p>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-96 flex flex-col">
            <SpectatorChat gameSessionId={id} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LiveGameSpectatorView;
