
import { useState, useEffect, useCallback, useRef } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

export const useOnlineGameSync = (gameId, playerId) => {
  const [gameState, setGameState] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isOpponentConnected, setIsOpponentConnected] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [syncError, setSyncError] = useState(null);
  
  const disconnectTimerRef = useRef(null);

  // Fetch initial game state
  useEffect(() => {
    if (!gameId) return;

    const initSync = async () => {
      try {
        // Fetch game session
        const session = await pb.collection('game_sessions').getOne(gameId, { $autoCancel: false });
        setGameState(session);

        // Fetch players
        const players = await pb.collection('game_players').getFullList({
          filter: `game_id = "${gameId}"`,
          $autoCancel: false
        });
        
        const opp = players.find(p => p.player_id !== playerId);
        if (opp) {
          setOpponent(opp);
          setIsOpponentConnected(true);
        }

        // Subscribe to moves
        pb.collection('game_moves').subscribe('*', (e) => {
          if (e.action === 'create' && e.record.game_id === gameId) {
            if (e.record.player_id !== playerId) {
              setLastMove(e.record);
            }
          }
        });

        // Subscribe to session updates (status, clock, etc)
        pb.collection('game_sessions').subscribe(gameId, (e) => {
          setGameState(e.record);
          
          // Handle disconnects via status
          if (e.record.status === 'abandoned') {
            setIsOpponentConnected(false);
            toast.error('Opponent disconnected. Game abandoned.');
          }
        });

        // Subscribe to player presence (mocked via game_players updates)
        pb.collection('game_players').subscribe('*', (e) => {
          if (e.record.game_id === gameId && e.record.player_id !== playerId) {
            if (e.action === 'delete') {
              handleOpponentDisconnect();
            }
          }
        });

      } catch (err) {
        console.error('Sync initialization failed:', err);
        setSyncError(err.message);
      }
    };

    initSync();

    return () => {
      pb.collection('game_moves').unsubscribe('*');
      pb.collection('game_sessions').unsubscribe(gameId);
      pb.collection('game_players').unsubscribe('*');
      if (disconnectTimerRef.current) clearTimeout(disconnectTimerRef.current);
    };
  }, [gameId, playerId]);

  const handleOpponentDisconnect = useCallback(() => {
    setIsOpponentConnected(false);
    toast.warning('Opponent disconnected. Waiting 30 seconds for reconnection...');
    
    disconnectTimerRef.current = setTimeout(async () => {
      try {
        await pb.collection('game_sessions').update(gameId, {
          status: 'abandoned',
          result: 'opponent_disconnected'
        }, { $autoCancel: false });
        toast.error('Opponent failed to reconnect. You win by abandonment.');
      } catch (err) {
        console.error('Failed to update abandoned status:', err);
      }
    }, 30000);
  }, [gameId]);

  const sendMove = useCallback(async (moveData, moveNumber) => {
    try {
      await pb.collection('game_moves').create({
        game_id: gameId,
        player_id: playerId,
        move_data: moveData,
        move_number: moveNumber
      }, { $autoCancel: false });
    } catch (err) {
      console.error('Failed to send move:', err);
      toast.error('Failed to sync move with server.');
    }
  }, [gameId, playerId]);

  const updateGameState = useCallback(async (updates) => {
    try {
      await pb.collection('game_sessions').update(gameId, updates, { $autoCancel: false });
    } catch (err) {
      console.error('Failed to update game state:', err);
    }
  }, [gameId]);

  return {
    gameState,
    opponent,
    isOpponentConnected,
    lastMove,
    syncError,
    sendMove,
    updateGameState
  };
};
