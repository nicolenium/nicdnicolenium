
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UnifiedGameLayout } from '@/components/UnifiedGameLayout.jsx';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';
import LudoBoard from '@/components/LudoBoard.jsx';
import GameAnimationOverlay from '@/components/GameAnimationOverlay.jsx';
import { toast } from 'sonner';
import { useSoundEffects } from '@/utils/soundManager.js';
import { GameClockDisplay } from '@/components/GameClockDisplay.jsx';
import { useGameSession } from '@/hooks/useGameSession.js';
import CombinedGameSetupModal from '@/components/CombinedGameSetupModal.jsx';
import { useGameConfig } from '@/contexts/GameConfigContext.jsx';
import { Loader2 } from 'lucide-react';

import { createInitialLudoState, getValidLudoPieces, executeLudoMoveWithDetails, LUDO_COLORS, SAFE_ZONES } from '@/utils/LudoLogic.js';
import { calculateBestLudoMove } from '@/utils/LudoAIEngine.js';

export default function LudoGamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { playWin, playLose } = useSoundEffects();
  const { gameConfig: contextConfig, setGameConfig } = useGameConfig();

  const routerConfig = location.state?.gameConfig;
  const [gameSetupData, setGameSetupData] = useState(() => routerConfig || contextConfig || null);
  
  const urlParams = new URLSearchParams(location.search);
  const urlGameId = urlParams.get('gameId');

  const [showSetupModal, setShowSetupModal] = useState(!gameSetupData && !urlGameId);

  const { initializeSession, recordMove, moveHistory, handleGameOver, loadGameState, saveGameState, isLoading } = useGameSession('ludo', gameSetupData);

  const [gameState, setGameState] = useState(createInitialLudoState());
  const [validPieces, setValidPieces] = useState([]);
  const isProcessingRef = useRef(false);
  const gameLoadedRef = useRef(false);

  const initialSeconds = useMemo(() => {
    if (!gameSetupData) return 600;
    const tc = gameSetupData.timeLimit ?? gameSetupData.match?.timeControl;
    if (tc === 'unlimited' || tc === 0) return 'unlimited';
    return Number(tc) || 600;
  }, [gameSetupData]);

  const [timeP1, setTimeP1] = useState(initialSeconds);
  const [timeP2, setTimeP2] = useState(initialSeconds);

  useEffect(() => {
    if (urlGameId && !gameLoadedRef.current) {
      gameLoadedRef.current = true;
      loadGameState(urlGameId).then(record => {
        if (record) {
          if (record.gameState && record.gameState.pieces) {
            setGameState(record.gameState);
          }
          if (record.player1Time !== undefined) setTimeP1(record.player1Time);
          if (record.player2Time !== undefined) setTimeP2(record.player2Time);
          setShowSetupModal(false);
        }
      });
    }
  }, [urlGameId]);

  const handleGameStart = (config) => {
    setGameConfig(config);
    setGameSetupData(config);
    setShowSetupModal(false);
    initializeSession(config);
    resetGame(config);
  };

  const handleCloseModal = () => navigate('/games');

  const processMove = (player, pieceIndex) => {
    try {
      const { newState, notation } = executeLudoMoveWithDetails(gameState, player, pieceIndex);
      setGameState(newState);
      setValidPieces([]);
      
      recordMove(notation, 0, { player: LUDO_COLORS[player].name, forceSync: true });
      
      saveGameState({
        gameState: newState,
        currentTurn: newState.turn,
        player1Time: timeP1,
        player2Time: timeP2
      });

      if (newState.winner !== null) {
        toast.success(`${LUDO_COLORS[newState.winner].name} wins!`);
        handleGameOver(newState.winner === 0 ? 'win' : 'loss', 0);
        if (newState.winner === 0) playWin(); else playLose();
      }
    } catch (e) {
      console.error("Ludo move processing error:", e);
    }
  };

  // AI Execution Hook
  useEffect(() => {
    let isMounted = true;
    if (showSetupModal || gameState.winner !== null || isProcessingRef.current) return;

    if (gameSetupData?.match?.mode === 'human_vs_computer' && gameState.turn !== 0) {
      
      const executeAILogic = async () => {
        isProcessingRef.current = true;
        
        if (!gameState.diceRolled) {
          await new Promise(r => setTimeout(r, 600)); // Delay before roll
          if (!isMounted) return;
          const d = Math.floor(Math.random() * 6) + 1;
          setGameState(s => {
            const newS = { ...s, dice: d, diceRolled: true };
            saveGameState({ gameState: newS, currentTurn: newS.turn, player1Time: timeP1, player2Time: timeP2 });
            return newS;
          });
          isProcessingRef.current = false;
        } else {
          await new Promise(r => setTimeout(r, 600)); // Delay before move
          if (!isMounted) return;
          
          const valids = getValidLudoPieces(gameState, gameState.turn);
          if (valids.length === 0) {
            setGameState(s => {
              const newS = { ...s, turn: (s.turn + 1) % 4, diceRolled: false, dice: null, consecutiveSixes: 0 };
              saveGameState({ gameState: newS, currentTurn: newS.turn, player1Time: timeP1, player2Time: timeP2 });
              return newS;
            });
            isProcessingRef.current = false;
          } else {
            setValidPieces(valids);
            try {
              const moveIdx = await calculateBestLudoMove(gameState, gameState.turn, gameSetupData?.match?.difficulty);
              if (isMounted && moveIdx !== null) {
                processMove(gameState.turn, moveIdx);
              } else if (isMounted) {
                processMove(gameState.turn, valids[0]);
              }
            } catch (e) {
              console.error("AI error:", e);
              if (isMounted) processMove(gameState.turn, valids[0]);
            } finally {
              if (isMounted) isProcessingRef.current = false;
            }
          }
        }
      };
      
      executeAILogic();
    } else if (gameState.diceRolled && gameState.turn === 0) {
      const valids = getValidLudoPieces(gameState, gameState.turn);
      if (valids.length === 0 && !isProcessingRef.current) {
        isProcessingRef.current = true;
        setTimeout(() => {
          if (isMounted) {
            setGameState(s => {
              const newS = { ...s, turn: (s.turn + 1) % 4, diceRolled: false, dice: null, consecutiveSixes: 0 };
              saveGameState({ gameState: newS, currentTurn: newS.turn, player1Time: timeP1, player2Time: timeP2 });
              return newS;
            });
            setValidPieces([]);
            isProcessingRef.current = false;
            toast.info("No valid moves. Turn passed.");
          }
        }, 1000);
      } else {
        setValidPieces(valids);
      }
    }
    
    return () => { isMounted = false; };
  }, [gameState, gameSetupData, showSetupModal]);

  const handleRollDice = () => {
    if (showSetupModal || gameState.winner !== null || gameState.diceRolled || isProcessingRef.current) return;
    if (gameSetupData?.match?.mode === 'human_vs_computer' && gameState.turn !== 0) return;
    const d = Math.floor(Math.random() * 6) + 1;
    setGameState(s => {
      const newS = { ...s, dice: d, diceRolled: true };
      saveGameState({ gameState: newS, currentTurn: newS.turn, player1Time: timeP1, player2Time: timeP2 });
      return newS;
    });
  };

  const handlePieceClick = (player, pieceIndex) => {
    if (showSetupModal || gameState.winner !== null || isProcessingRef.current) return;
    if (player !== gameState.turn) return;
    if (gameSetupData?.match?.mode === 'human_vs_computer' && player !== 0) return;
    
    if (validPieces.includes(pieceIndex)) {
      processMove(player, pieceIndex);
    }
  };

  const resetGame = (config = gameSetupData) => {
    setGameState(createInitialLudoState());
    setValidPieces([]);
    const tc = config?.timeLimit ?? config?.match?.timeControl;
    const newTime = tc === 'unlimited' || tc === 0 ? 'unlimited' : (Number(tc) || 600);
    setTimeP1(newTime);
    setTimeP2(newTime);
    isProcessingRef.current = false;
  };

  const handleTimeExpired = () => {
    if (gameState.winner !== null) return;
    setGameState(s => ({ ...s, winner: gameState.turn === 0 ? 1 : 0 }));
    handleGameOver('timeout', 0);
    toast.error(`${LUDO_COLORS[gameState.turn].name} ran out of time!`);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Restoring game state...</p>
      </div>
    );
  }

  let turnText = `${LUDO_COLORS[gameState.turn].name}'S TURN`;
  if (gameState.winner !== null) turnText = `${LUDO_COLORS[gameState.winner].name} WINS!`;

  return (
    <>
      <Helmet><title>Ludo | NICOLENIUM</title></Helmet>

      <CombinedGameSetupModal 
        isOpen={showSetupModal} 
        gameType="ludo"
        game={{ name: "Ludo", id: "ludo" }}
        onGameStart={handleGameStart} 
        onClose={handleCloseModal} 
      />

      {!showSetupModal && gameSetupData && (
        <UnifiedGameLayout title="Ludo" turnText={turnText} onReset={() => resetGame()} history={moveHistory} canUndo={false} gameType="ludo">
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-[70vh] mb-6 flex justify-between gap-4">
              <GameClockDisplay playerName={gameSetupData?.players?.p1Name || 'Player 1'} totalTimeSeconds={initialSeconds} timeRemainingSeconds={timeP1} isActive={gameState.turn === 0 && gameState.winner === null} onTimeExpired={handleTimeExpired} />
              <GameClockDisplay playerName={gameSetupData?.players?.p2Name || 'AI'} totalTimeSeconds={initialSeconds} timeRemainingSeconds={timeP2} isActive={gameState.turn !== 0 && gameState.winner === null} onTimeExpired={handleTimeExpired} />
            </div>

            <div className="w-full max-w-[70vh] aspect-square relative shadow-2xl rounded-2xl overflow-hidden border-8 border-border">
              <GameAnimationOverlay gameStatus={gameState.winner === 0 ? 'won' : gameState.winner !== null ? 'lost' : 'in-progress'}>
                <LudoBoard gameState={gameState} onPieceClick={handlePieceClick} validPieces={validPieces} />
              </GameAnimationOverlay>
            </div>
            
            <div className="mt-8 flex gap-6 items-center">
              <div className="w-20 h-20 border-4 border-primary/20 rounded-2xl shadow-xl flex items-center justify-center text-4xl font-black bg-card text-primary">
                {gameState.dice || '?'}
              </div>
              <Button 
                size="lg" 
                className="font-black uppercase tracking-widest h-16 px-8 rounded-xl shadow-glow-primary hover:scale-105 transition-transform"
                onClick={handleRollDice} 
                disabled={gameState.diceRolled || (gameSetupData?.match?.mode === 'human_vs_computer' && gameState.turn !== 0) || gameState.winner !== null || isProcessingRef.current}
              >
                Roll Dice
              </Button>
            </div>
          </div>
        </UnifiedGameLayout>
      )}
    </>
  );
}
