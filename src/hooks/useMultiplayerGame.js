
import { useState, useEffect, useRef, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

export const useMultiplayerGame = (gameSessionId, userId) => {
  const [gameState, setGameState] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const lastMoveTime = useRef(0);

  const fetchGameState = useCallback(async () => {
    try {
      const record = await pb.collection('game_sessions').getOne(gameSessionId, { $autoCancel: false });
      setGameState(record);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch game state:', err);
      setError('Failed to connect to game session.');
      setIsConnected(false);
    }
  }, [gameSessionId]);

  useEffect(() => {
    if (!gameSessionId) return;

    fetchGameState();

    // Subscribe to real-time updates
    pb.collection('game_sessions').subscribe(gameSessionId, (e) => {
      if (e.action === 'update') {
        setGameState(e.record);
      }
    }).catch(err => {
      console.error('Subscription error:', err);
      setError('Lost connection to game server.');
      setIsConnected(false);
    });

    return () => {
      pb.collection('game_sessions').unsubscribe(gameSessionId);
    };
  }, [gameSessionId, fetchGameState]);

  const submitMove = async (moveData) => {
    // Rate limiting: max 1 move per 500ms
    const now = Date.now();
    if (now - lastMoveTime.current < 500) {
      toast.warning('Moving too fast!');
      return false;
    }
    lastMoveTime.current = now;

    try {
      await pb.collection('game_sessions').update(gameSessionId, {
        ...moveData,
        updated: new Date().toISOString()
      }, { $autoCancel: false });
      return true;
    } catch (err) {
      console.error('Failed to submit move:', err);
      toast.error('Failed to submit move. Retrying...');
      // Simple retry logic
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await pb.collection('game_sessions').update(gameSessionId, moveData, { $autoCancel: false });
        return true;
      } catch (retryErr) {
        setError('Connection unstable. Move failed.');
        return false;
      }
    }
  };

  return {
    gameState,
    isConnected,
    error,
    submitMove,
    refresh: fetchGameState
  };
};
