
import { useState, useCallback, useRef, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';
import { MoveHistoryManager } from '@/utils/MoveHistoryManager.js';
import { ActivityLogManager } from '@/utils/ActivityLogManager.js';
import { GamePersistenceManager } from '@/utils/GamePersistenceManager.js';

export const useGameSession = (gameType, initialConfig = {}) => {
  const { currentUser, isAuthenticated } = useAuth();
  
  const safeInitialConfig = initialConfig || {};
  const defaultConfig = {
    playerName: safeInitialConfig.playerName || 'Player',
    difficulty: safeInitialConfig.difficulty || 'medium',
    mode: safeInitialConfig.mode || 'human_vs_computer',
    timeLimit: safeInitialConfig.timeLimit !== undefined ? safeInitialConfig.timeLimit : 600,
    ...safeInitialConfig
  };
  
  const [sessionId, setSessionId] = useState(null);
  const [status, setStatus] = useState('initializing'); // initializing, active, paused, completed, abandoned, error
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [moveHistory, setMoveHistory] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(defaultConfig.timeLimit);
  const [startTime, setStartTime] = useState(null);
  const [analysisData, setAnalysisData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const timerRef = useRef(null);
  const lastMoveTimeRef = useRef(Date.now());
  const isLocalOnly = useRef(false);
  const syncTimeoutRef = useRef(null);

  // Restore game state from local on mount
  useEffect(() => {
    if (sessionId && isLocalOnly.current) {
      const savedState = GamePersistenceManager.loadLocal(sessionId);
      if (savedState) {
        setMoveHistory(savedState.moveHistory || []);
        setScore(savedState.score || 0);
        setStatus(savedState.status || 'active');
        if (savedState.activityLog) setActivityLog(savedState.activityLog);
        toast.info("Local game state restored.");
      }
    }
    
    return GamePersistenceManager.registerUnloadSave(sessionId, () => ({
      status, score, moveHistory, activityLog, timeRemaining
    }));
  }, [sessionId]);

  // Browser navigation warning for active games
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (status === 'active') {
        e.preventDefault();
        e.returnValue = 'Game in progress. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    const handleUnload = () => {
      if (status === 'active' && sessionId && !isLocalOnly.current) {
        // Best effort to mark abandoned on sudden exit
        pb.collection('game_sessions').update(sessionId, { status: 'abandoned' }, { $autoCancel: false }).catch(() => {});
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [status, sessionId]);

  const loadGameState = async (gameIdParam) => {
    setIsLoading(true);
    try {
      const record = await pb.collection('game_sessions').getFirstListItem(`gameId="${gameIdParam}"`, { $autoCancel: false });
      setSessionId(record.id);
      setStatus(record.status);
      setMoveHistory(record.moveHistory || []);
      setScore(record.score || 0);
      isLocalOnly.current = false;
      return record;
    } catch(e) {
      console.error("Load Game State failed", e);
      toast.error("Failed to load saved game session.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveGameState = async (stateData) => {
    if (!sessionId || isLocalOnly.current) return;
    try {
      await pb.collection('game_sessions').update(sessionId, {
        gameState: stateData.gameState,
        currentTurn: stateData.currentTurn?.toString() || '',
        player1Time: stateData.player1Time,
        player2Time: stateData.player2Time,
        moveHistory: stateData.moveHistory || moveHistory,
        status: stateData.status || status,
        updatedAt: new Date().toISOString()
      }, { $autoCancel: false });
    } catch(e) {
      console.error("Save Game State failed", e);
    }
  };

  const logActivity = useCallback((type, description, metadata = {}) => {
    const log = ActivityLogManager.createLog(type, currentUser?.username || 'Guest', description, metadata);
    setActivityLog(prev => [...prev, log]);
  }, [currentUser]);

  const initializeSession = useCallback(async (config) => {
    try {
      setStatus('initializing');
      setError(null);
      
      const finalConfig = { ...defaultConfig, ...(config || {}) };
      const now = new Date();
      
      const p1 = currentUser?.id || `guest_${crypto.randomUUID().substring(0, 8)}`;
      let p2 = 'AI';
      if (finalConfig.mode === 'multiplayer' || finalConfig.mode === 'human_vs_human') {
        p2 = finalConfig.opponentId || 'waiting_player';
      }

      const generatedGameId = crypto.randomUUID();

      const sessionData = {
        gameId: generatedGameId,
        player1Id: p1,
        player2Id: p2,
        gameType: gameType || 'unknown',
        status: 'in_progress',
        mode: finalConfig.mode === 'multiplayer' ? 'human_vs_human' : 'human_vs_computer',
        difficulty: finalConfig.difficulty || 'medium',
        score: 0,
        startTime: now.toISOString(),
        is_live: true,
      };

      if (!isAuthenticated || !currentUser?.id) {
        isLocalOnly.current = true;
        const localId = `local_${sessionData.gameId}`;
        setSessionId(localId);
        setStartTime(now);
        setTimeRemaining(finalConfig.timeLimit);
        setStatus('active');
        lastMoveTimeRef.current = Date.now();
        logActivity(ActivityLogManager.TYPES.GAME_START, `Game started locally (Guest)`);
        window.history.replaceState(null, '', `?gameId=${sessionData.gameId}`);
        return localId;
      }

      const record = await pb.collection('game_sessions').create(sessionData, { $autoCancel: false });
      setSessionId(record.id);
      setStartTime(now);
      setTimeRemaining(finalConfig.timeLimit);
      setStatus('active');
      lastMoveTimeRef.current = Date.now();
      isLocalOnly.current = false;
      
      logActivity(ActivityLogManager.TYPES.GAME_START, `Game started online`);
      
      // Update URL with gameId to support refresh
      window.history.replaceState(null, '', `?gameId=${generatedGameId}`);
      
      return record.id;
    } catch (err) {
      console.error("[GameSession] Game session init error:", err);
      setStatus('active');
      setError(err.message);
      toast.error(`Playing locally (Cloud unavailable).`);
      
      isLocalOnly.current = true;
      const fallbackGameId = crypto.randomUUID();
      const fallbackId = `local_${fallbackGameId}`;
      setSessionId(fallbackId);
      setStartTime(new Date());
      lastMoveTimeRef.current = Date.now();
      window.history.replaceState(null, '', `?gameId=${fallbackGameId}`);
      return fallbackId;
    }
  }, [currentUser, isAuthenticated, gameType, defaultConfig, logActivity]);

  const recordMove = useCallback((notation, points = 0, additionalData = {}) => {
    if (status !== 'active') return;

    const now = Date.now();
    const timeSpent = (now - lastMoveTimeRef.current) / 1000;
    lastMoveTimeRef.current = now;

    const moveNumber = additionalData.moveNumber || moveHistory.length + 1;

    const moveRecord = MoveHistoryManager.createMoveRecord({
      moveNumber,
      notation,
      player: additionalData.player || 'Player 1',
      timeSpent,
      rawMove: additionalData.rawMove
    });

    setMoveHistory(prev => {
      const updated = [...prev, moveRecord];
      const newScore = score + points;
      
      if (sessionId && isLocalOnly.current) {
        GamePersistenceManager.saveLocal(sessionId, { status, score: newScore, moveHistory: updated, activityLog });
      }

      if (sessionId && !isLocalOnly.current) {
        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = setTimeout(() => {
          pb.collection('game_sessions').update(sessionId, {
            moveHistory: updated,
            score: newScore
          }, { $autoCancel: false }).catch(e => console.error('Move sync failed:', e));
        }, 3000); 
      }
      return updated;
    });

    logActivity(ActivityLogManager.TYPES.MOVE, `Move ${moveNumber}: ${notation}`);
    if (points !== 0) setScore(s => s + points);
  }, [sessionId, status, score, moveHistory.length, activityLog, logActivity]);

  const handleGameOver = useCallback(async (reason, finalScore = score) => {
    setStatus(reason === 'resign' ? 'abandoned' : 'completed');
    clearInterval(timerRef.current);
    
    logActivity(ActivityLogManager.TYPES.GAME_END, `Game ended. Reason: ${reason}. Final Score: ${finalScore}`);
    
    if (sessionId && isLocalOnly.current) GamePersistenceManager.clearLocal(sessionId);

    if (sessionId && !isLocalOnly.current) {
      try {
        const timeUsed = startTime ? Math.floor((Date.now() - startTime.getTime()) / 1000) : 0;
        await pb.collection('game_sessions').update(sessionId, {
          status: reason === 'resign' ? 'abandoned' : 'completed',
          is_live: false,
          endTime: new Date().toISOString(),
          score: finalScore,
          moveHistory,
          timeUsed,
          analysisData
        }, { $autoCancel: false });
      } catch (error) {
        console.error('[GameSession] Failed to save final results.', error);
      }
    }
  }, [sessionId, score, moveHistory, activityLog, startTime, analysisData, logActivity]);

  const updateAnalysis = useCallback((data) => setAnalysisData(prev => ({ ...prev, ...data })), []);

  return {
    sessionId, status, error, score, moveHistory, activityLog, timeRemaining, analysisData, isLoading,
    initializeSession, recordMove, logActivity, handleGameOver, updateAnalysis, setScore,
    loadGameState, saveGameState
  };
};
