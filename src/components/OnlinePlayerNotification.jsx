
import React, { useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';

const OnlinePlayerNotification = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    const subscribeToWaitingPlayers = async () => {
      try {
        await pb.collection('waiting_players').subscribe('*', (e) => {
          if (e.action === 'create' && e.record.userId !== currentUser?.id) {
            // Play a subtle sound (optional, using a generic browser beep or silent if not allowed)
            try {
              const audio = new Audio('/notification.mp3'); // Assuming this exists in public, otherwise it fails silently
              audio.volume = 0.3;
              audio.play().catch(() => {}); // Catch auto-play restrictions
            } catch (err) {}

            toast.success(`Player ${e.record.username} is now online`, {
              description: 'They are waiting in the lobby for a match.',
              duration: 5000,
            });
          }
        });
      } catch (error) {
        console.error("Failed to subscribe to waiting_players:", error);
      }
    };

    subscribeToWaitingPlayers();

    return () => {
      pb.collection('waiting_players').unsubscribe('*').catch(() => {});
    };
  }, [currentUser]);

  return null;
};

export default OnlinePlayerNotification;
