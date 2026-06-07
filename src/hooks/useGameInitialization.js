
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

export function useGameInitialization(gameType, gameSetupData, shouldInitialize = true) {
  const { currentUser } = useAuth();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);

  const initializeGame = useCallback(async () => {
    if (!shouldInitialize) return;
    
    setLoading(true);

    try {
      if (!gameType) {
        console.error("[GameInit] Game type is required but was not provided.");
        throw new Error("Game type is required.");
      }

      const player1Id = currentUser?.id || `guest_${Date.now()}`;
      console.log(`[GameInit] Extracted player1Id: ${player1Id}`);

      let player2Id = null;
      if (gameSetupData?.mode === 'multiplayer' || gameSetupData?.gameMode === 'Multiplayer') {
        player2Id = gameSetupData.opponentId || null;
      } else if (gameSetupData?.gameMode === 'Tournament') {
        player2Id = gameSetupData.tournamentOpponentId || null;
      }
      console.log(`[GameInit] Determined player2Id: ${player2Id}`);

      const fallbackData = {
        gameId: crypto.randomUUID(),
        player1Id,
        player2Id,
        gameType: gameType,
        status: 'waiting',
        difficulty: gameSetupData?.difficulty || 'medium',
        mode: gameSetupData?.mode || gameSetupData?.gameMode || 'Single Player',
        timeLimit: parseInt(gameSetupData?.timeLimit) || 0,
        playerName: gameSetupData?.playerName || currentUser?.name || 'Player 1',
        startTime: new Date().toISOString(),
        moveHistory: [],
        score: 0,
        winner: null,
        isFallback: true
      };

      let attempt = 0;
      const maxAttempts = 3;
      let createdRecord = null;

      while (attempt < maxAttempts) {
        try {
          attempt++;
          console.log(`[GameInit] Attempt ${attempt} to create game record for ${gameType}...`);
          
          const recordData = {
            player1Id,
            player2Id,
            gameType,
            status: 'waiting',
            difficulty: fallbackData.difficulty,
            mode: fallbackData.mode,
            timeLimit: fallbackData.timeLimit,
            playerName: fallbackData.playerName,
            startTime: fallbackData.startTime,
            moveHistory: [],
            score: 0
          };

          const record = await pb.collection('game_sessions').create(recordData, { $autoCancel: false });
          createdRecord = await pb.collection('game_sessions').getOne(record.id, { $autoCancel: false });
          
          console.log(`[GameInit] Successfully created game record on attempt ${attempt}. ID: ${createdRecord.id}`);
          break;
        } catch (err) {
          console.error(`[GameInit] Attempt ${attempt} failed:`, err);
          if (attempt < maxAttempts) {
            console.log(`[GameInit] Waiting 1s before retry...`);
            await new Promise(res => setTimeout(res, 1000));
          }
        }
      }

      if (createdRecord) {
        setGameData({ ...createdRecord, gameId: createdRecord.id });
      } else {
        console.warn(`[GameInit] All ${maxAttempts} attempts failed. Proceeding with local fallback session.`);
        toast.warning("Playing in local mode. Progress may not be saved to leaderboards.");
        setGameData(fallbackData);
      }
    } catch (fatalError) {
      console.error("[GameInit] Fatal error during initialization:", fatalError);
      setGameData({
        gameId: crypto.randomUUID(),
        player1Id: currentUser?.id || `guest_${Date.now()}`,
        player2Id: null,
        gameType: gameType || 'unknown',
        status: 'waiting',
        moveHistory: [],
        score: 0,
        isFallback: true
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, gameType, gameSetupData, shouldInitialize]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return { gameData, loading, error: null, retry: initializeGame };
}
