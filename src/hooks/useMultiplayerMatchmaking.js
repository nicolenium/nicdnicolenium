
import { useEffect, useState } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useMultiplayerMatchmaking = () => {
  const { currentUser } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const fetchPending = async () => {
      try {
        const records = await pb.collection('game_sessions').getFullList({
          filter: `player2Id="${currentUser.id}" && status="waiting"`,
          $autoCancel: false
        });
        setIncomingRequests(records);
      } catch (e) {
        console.error("Error fetching pending requests:", e);
      }
    };
    
    fetchPending();

    const subscribe = async () => {
      try {
        await pb.collection('game_sessions').subscribe('*', (e) => {
          // Incoming request to me
          if (e.action === 'create' && e.record.player2Id === currentUser.id && e.record.status === 'waiting') {
            toast(`New game request for ${e.record.gameType.replace('_', ' ')}!`, {
              description: 'Check your pending requests to accept.',
            });
            setIncomingRequests(prev => [...prev, e.record]);
          }
          
          // My request was accepted by the other player
          if (e.action === 'update' && e.record.player1Id === currentUser.id && e.record.status === 'in-progress') {
            toast.success('Game request accepted! Joining match...');
            navigate(`/${e.record.gameType.replace('_', '')}`, { state: { sessionId: e.record.id, mode: 'human_vs_human' } });
          }
          
          // I accepted a request
          if (e.action === 'update' && e.record.player2Id === currentUser.id && e.record.status === 'in-progress') {
            setIncomingRequests(prev => prev.filter(r => r.id !== e.record.id));
            navigate(`/${e.record.gameType.replace('_', '')}`, { state: { sessionId: e.record.id, mode: 'human_vs_human' } });
          }

          // Request was declined/cancelled
          if (e.action === 'update' && e.record.player2Id === currentUser.id && e.record.status === 'completed') {
            setIncomingRequests(prev => prev.filter(r => r.id !== e.record.id));
          }
        });
      } catch (err) {
        console.error("Subscription error:", err);
      }
    };

    subscribe();

    return () => {
      pb.collection('game_sessions').unsubscribe('*').catch(() => {});
    };
  }, [currentUser, navigate]);

  const acceptRequest = async (session) => {
    try {
      await pb.collection('game_sessions').update(session.id, { status: 'in-progress' }, { $autoCancel: false });
    } catch (error) {
      toast.error('Failed to accept request.');
    }
  };

  const declineRequest = async (session) => {
    try {
      await pb.collection('game_sessions').update(session.id, { status: 'completed' }, { $autoCancel: false });
      setIncomingRequests(prev => prev.filter(r => r.id !== session.id));
    } catch (error) {
      toast.error('Failed to decline request.');
    }
  };

  return { incomingRequests, acceptRequest, declineRequest };
};
