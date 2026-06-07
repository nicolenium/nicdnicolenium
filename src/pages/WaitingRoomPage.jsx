
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PlayerCard from '@/components/PlayerCard.jsx';
import OnlinePlayerNotification from '@/components/OnlinePlayerNotification.jsx';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { Loader2, Users, PlayCircle } from 'lucide-react';

const WaitingRoomPage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [waitingPlayers, setWaitingPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWaiting, setIsWaiting] = useState(false);
  const [waitingRecordId, setWaitingRecordId] = useState(null);

  useEffect(() => {
    fetchWaitingPlayers();

    const subscribe = async () => {
      try {
        await pb.collection('waiting_players').subscribe('*', (e) => {
          if (e.action === 'create') {
            setWaitingPlayers(prev => [...prev, e.record]);
          } else if (e.action === 'update') {
            setWaitingPlayers(prev => prev.map(p => p.id === e.record.id ? e.record : p));
          } else if (e.action === 'delete') {
            setWaitingPlayers(prev => prev.filter(p => p.id !== e.record.id));
          }
        });
      } catch (err) {
        console.error('Subscription error:', err);
      }
    };

    subscribe();

    return () => {
      pb.collection('waiting_players').unsubscribe('*').catch(() => {});
      // Cleanup waiting status if leaving page
      if (waitingRecordId) {
        pb.collection('waiting_players').delete(waitingRecordId, { $autoCancel: false }).catch(() => {});
      }
    };
  }, [waitingRecordId]);

  const fetchWaitingPlayers = async () => {
    try {
      const records = await pb.collection('waiting_players').getList(1, 50, {
        sort: '-created',
        $autoCancel: false
      });
      setWaitingPlayers(records.items);
      
      // Check if current user is already waiting
      if (currentUser) {
        const myRecord = records.items.find(p => p.userId === currentUser.id);
        if (myRecord) {
          setIsWaiting(true);
          setWaitingRecordId(myRecord.id);
        }
      }
    } catch (error) {
      console.error('Error fetching waiting players:', error);
      toast.error('Failed to load waiting room.');
    } finally {
      setLoading(false);
    }
  };

  const toggleWaitingStatus = async () => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to join the waiting room.');
      return;
    }

    try {
      if (isWaiting && waitingRecordId) {
        await pb.collection('waiting_players').delete(waitingRecordId, { $autoCancel: false });
        setIsWaiting(false);
        setWaitingRecordId(null);
        toast.success('You left the waiting room.');
      } else {
        const record = await pb.collection('waiting_players').create({
          userId: currentUser.id,
          username: currentUser.username || 'Player',
          rating: 1200,
          status: 'online'
        }, { $autoCancel: false });
        setIsWaiting(true);
        setWaitingRecordId(record.id);
        toast.success('You are now waiting for a game.');
      }
    } catch (error) {
      console.error('Error toggling waiting status:', error);
      toast.error('Failed to update status.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Waiting Room | NICD PRODUCTIONS</title>
      </Helmet>
      
      <Header />
      <OnlinePlayerNotification />
      
      <main className="flex-1 container mx-auto px-4 py-24 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
              <Users className="w-10 h-10 text-primary" />
              Global Waiting Room
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">Find opponents and start playing instantly.</p>
          </div>
          
          <Button 
            size="lg" 
            onClick={toggleWaitingStatus}
            variant={isWaiting ? "destructive" : "default"}
            className="font-bold text-lg px-8 h-14 interactive-scale shadow-md"
          >
            {isWaiting ? 'Leave Waiting Room' : (
              <>
                <PlayCircle className="w-5 h-5 mr-2" /> Start Waiting
              </>
            )}
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 animate-pulse">
                <div className="w-14 h-14 rounded-full bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
                <div className="w-24 h-10 bg-muted rounded-md"></div>
              </div>
            ))}
          </div>
        ) : waitingPlayers.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-3xl shadow-sm">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-bold text-foreground mb-2">Room is Empty</h3>
            <p className="text-muted-foreground max-w-md mx-auto">There are currently no players waiting for a match. Click "Start Waiting" to be the first!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {waitingPlayers.map(player => (
              <PlayerCard 
                key={player.id} 
                player={player} 
                currentUser={currentUser} 
                gameType="checkers" 
              />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default WaitingRoomPage;
