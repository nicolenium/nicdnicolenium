
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { UnifiedGameLayout } from '@/components/UnifiedGameLayout.jsx';
import { GameClockDisplay } from '@/components/GameClockDisplay.jsx';
import GameAnimationOverlay from '@/components/GameAnimationOverlay.jsx';
import { Button } from '@/components/ui/button.jsx';
import { toast } from 'sonner';
import { useGameSession } from '@/hooks/useGameSession.js';
import { useSoundEffects } from '@/utils/soundManager.js';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils.js';
import CombinedGameSetupModal from '@/components/CombinedGameSetupModal.jsx';
import { useGameConfig } from '@/contexts/GameConfigContext.jsx';
import { AIResponseManager } from '@/utils/AIResponseManager.js';

import { generateDominoes, getBoardEnds, canPlayTile, evaluateWinner, hasValidMoves } from '@/utils/DominoesGameLogic.js';
import { calculateBestDominoMove } from '@/utils/DominoAIEngine.js';

const Pips = ({ count }) => {
  const patterns = {
    0: [], 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8]
  };
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-1 w-full h-full p-2">
      {[0,1,2,3,4,5,6,7,8].map(i => (
         <div key={i} className="flex items-center justify-center">
           {patterns[count]?.includes(i) && (
             <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-black rounded-full shadow-sm" />
           )}
         </div>
      ))}
    </div>
  );
};

const DominoTile = ({ val1, val2, horizontal = false, isInteractive = false, onClick, disabled = false, hidden = false }) => {
  if (hidden) {
    return (
      <div className={cn("relative flex bg-slate-800 rounded-xl border-2 border-slate-900 shadow-xl", horizontal ? "flex-row w-28 h-14 sm:w-32 sm:h-16" : "flex-col w-14 h-28 sm:w-16 sm:h-32")}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 rounded-xl" />
      </div>
    );
  }
  return (
    <div onClick={disabled ? undefined : onClick} className={cn(
      "relative flex bg-white rounded-xl border-2 border-slate-300 shadow-lg", 
      horizontal ? "flex-row w-28 h-14 sm:w-32 sm:h-16" : "flex-col w-14 h-28 sm:w-16 sm:h-32", 
      isInteractive && !disabled && "cursor-pointer hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-all duration-200 ring-2 ring-primary/50", 
      disabled && !horizontal && "opacity-60 cursor-not-allowed scale-95 transition-all duration-300"
    )}>
      <div className="flex-1 flex items-center justify-center relative"><Pips count={val1} /></div>
      <div className={cn("bg-slate-800", horizontal ? "w-[2px] h-full" : "h-[2px] w-full")} />
      <div className="flex-1 flex items-center justify-center relative"><Pips count={val2} /></div>
    </div>
  );
};

export default function DominoesGamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { playWin, playLose, playCapture } = useSoundEffects();
  const soundPlayedRef = useRef(false);
  const { gameConfig: contextConfig, setGameConfig } = useGameConfig();

  const routerConfig = location.state?.gameConfig;
  const [gameSetupData, setGameSetupData] = useState(() => routerConfig || contextConfig || null);
  
  const urlParams = new URLSearchParams(location.search);
  const urlGameId = urlParams.get('gameId');

  const [showSetupModal, setShowSetupModal] = useState(!gameSetupData && !urlGameId);

  const { initializeSession, recordMove, moveHistory, handleGameOver, loadGameState, saveGameState, isLoading } = useGameSession('dominoes', gameSetupData || {});

  const initialSeconds = useMemo(() => {
    if (!gameSetupData) return 600;
    const tc = gameSetupData.timeLimit ?? gameSetupData.match?.timeControl;
    if (tc === 'unlimited' || tc === 0) return 'unlimited';
    return Number(tc) || 600;
  }, [gameSetupData]);

  const [isInitializing, setIsInitializing] = useState(false);
  const [boneyard, setBoneyard] = useState([]);
  const [p1Hand, setP1Hand] = useState([]);
  const [p2Hand, setP2Hand] = useState([]);
  const [board, setBoard] = useState([]);
  const [turn, setTurn] = useState(1);
  const [winner, setWinner] = useState(null);
  const [timeP1, setTimeP1] = useState(initialSeconds);
  const [timeP2, setTimeP2] = useState(initialSeconds);
  const [passCount, setPassCount] = useState(0);
  const isProcessingRef = useRef(false);
  const gameLoadedRef = useRef(false);

  useEffect(() => {
    if (urlGameId && !gameLoadedRef.current) {
      gameLoadedRef.current = true;
      loadGameState(urlGameId).then(record => {
        if (record) {
          if (record.gameState) {
            setBoard(record.gameState.board || []);
            setP1Hand(record.gameState.p1Hand || []);
            setP2Hand(record.gameState.p2Hand || []);
            setBoneyard(record.gameState.boneyard || []);
            setTurn(record.gameState.turn || 1);
            setPassCount(record.gameState.passCount || 0);
          }
          if (record.player1Time !== undefined) setTimeP1(record.player1Time);
          if (record.player2Time !== undefined) setTimeP2(record.player2Time);
          setShowSetupModal(false);
        }
      });
    }
  }, [urlGameId]);

  const handleGameStart = async (config) => {
    setGameConfig(config);
    setGameSetupData(config);
    setShowSetupModal(false);
    setIsInitializing(true);
    try {
      await initializeSession(config);
      resetGame(config);
    } catch (error) {
      toast.error("Failed to start game: " + error.message);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleCloseModal = () => navigate('/games');

  const resetGame = (config = gameSetupData) => {
    const tiles = generateDominoes();
    setP1Hand(tiles.slice(0, 7));
    setP2Hand(tiles.slice(7, 14));
    setBoneyard(tiles.slice(14));
    setBoard([]);
    setTurn(1);
    setWinner(null);
    const tc = config?.timeLimit ?? config?.match?.timeControl;
    const newTime = tc === 'unlimited' || tc === 0 ? 'unlimited' : (Number(tc) || 600);
    setTimeP1(newTime);
    setTimeP2(newTime);
    setPassCount(0);
    soundPlayedRef.current = false;
    isProcessingRef.current = false;
  };

  useEffect(() => {
    if (winner && !soundPlayedRef.current) {
      soundPlayedRef.current = true;
      if (winner === 1) playWin();
      else playLose();
    }
  }, [winner, playWin, playLose]);

  const checkGameEnd = (newP1, newP2, passedCount) => {
    if (newP1.length === 0 || newP2.length === 0 || passedCount >= 2) {
      const evaluation = evaluateWinner(newP1, newP2);
      setWinner(evaluation.winner);
      handleGameOver(evaluation.winner === 1 ? 'win' : evaluation.winner === 2 ? 'loss' : 'draw');
      if (evaluation.winner === 1) toast.success("You win!");
      else if (evaluation.winner === 2) toast.error("Opponent wins!");
      else toast.info("Game Blocked - It's a draw!");
      return true;
    }
    return false;
  };

  const syncState = (newBoard, newP1, newP2, newBoneyard, nextTurn, newPassCount) => {
    saveGameState({
      gameState: { board: newBoard, p1Hand: newP1, p2Hand: newP2, boneyard: newBoneyard, turn: nextTurn, passCount: newPassCount },
      currentTurn: nextTurn,
      player1Time: timeP1,
      player2Time: timeP2
    });
  };

  const handlePass = (player) => {
    const newPassCount = passCount + 1;
    setPassCount(newPassCount);
    recordMove("Passed turn", 0, { player: player === 1 ? 'Player 1' : 'AI', forceSync: true });
    toast.info(`Player ${player} passed.`);
    
    if (!checkGameEnd(p1Hand, p2Hand, newPassCount)) {
      const nextTurn = player === 1 ? 2 : 1;
      setTurn(nextTurn);
      syncState(board, p1Hand, p2Hand, boneyard, nextTurn, newPassCount);
    }
  };

  const drawTile = (player) => {
    if (boneyard.length === 0) {
      toast.error("Boneyard is empty! Passing turn.");
      handlePass(player);
      return null;
    }
    const tile = boneyard[0];
    const newBoneyard = boneyard.slice(1);
    setBoneyard(newBoneyard);
    
    const newP1 = player === 1 ? [...p1Hand, tile] : p1Hand;
    const newP2 = player === 2 ? [...p2Hand, tile] : p2Hand;
    
    if (player === 1) setP1Hand(newP1); else setP2Hand(newP2);
    playCapture();
    
    syncState(board, newP1, newP2, newBoneyard, turn, passCount);
    return tile;
  };

  const applyTileData = (moveResult, player) => {
    try {
      let newBoard = [...board];
      const { tile, end } = moveResult;

      if (board.length === 0) {
        newBoard.push(tile);
      } else {
        const leftEnd = board[0][0];
        const rightEnd = board[board.length - 1][1];

        if (end === 0) {
          if (tile[1] === leftEnd) newBoard.unshift(tile);
          else newBoard.unshift([tile[1], tile[0]]);
        } else if (end === 1) {
          if (tile[0] === rightEnd) newBoard.push(tile);
          else newBoard.push([tile[1], tile[0]]);
        } else {
          if (tile[1] === leftEnd) newBoard.unshift(tile);
          else if (tile[0] === leftEnd) newBoard.unshift([tile[1], tile[0]]);
          else if (tile[0] === rightEnd) newBoard.push(tile);
          else if (tile[1] === rightEnd) newBoard.push([tile[1], tile[0]]);
        }
      }

      playCapture();
      const newP1 = player === 1 ? p1Hand.filter(t => t !== tile) : p1Hand;
      const newP2 = player === 2 ? p2Hand.filter(t => t !== tile) : p2Hand;
      
      if (player === 1) setP1Hand(newP1); else setP2Hand(newP2);
      setBoard(newBoard);
      setPassCount(0);
      recordMove(`Played [${tile[0]}|${tile[1]}]`, 0, { player: player === 1 ? (gameSetupData?.players?.p1Name || 'Player 1') : (gameSetupData?.players?.p2Name || 'AI'), forceSync: true });
      
      if (!checkGameEnd(newP1, newP2, 0)) {
        const nextTurn = player === 1 ? 2 : 1;
        setTurn(nextTurn);
        syncState(newBoard, newP1, newP2, boneyard, nextTurn, 0);
      }
    } catch (e) {
      console.error("Error applying tile:", e);
    }
  };

  const playTile = (tile, player, endPreference = null) => {
    if (winner || turn !== player || isInitializing) return;
    
    const boardEnds = getBoardEnds(board);
    
    if (canPlayTile(tile, boardEnds)) {
      applyTileData({ tile, end: endPreference }, player);
    } else {
      toast.error("Invalid move!");
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (showSetupModal || isInitializing || isProcessingRef.current || winner) return;

    if (turn === 2 && gameSetupData?.mode === 'human_vs_computer') {
      isProcessingRef.current = true;
      
      AIResponseManager.executeAITurn({
        gameType: 'dominoes',
        gameState: board,
        player: 2,
        difficulty: gameSetupData?.difficulty,
        calculateMoveFn: async () => await calculateBestDominoMove(board, p2Hand, boneyard, gameSetupData?.difficulty),
        applyMoveFn: (res) => {
          if (isMounted && res) applyTileData(res, 2);
        },
        fallbackMoveFn: () => null,
        onTimeout: () => {
          if (isMounted) {
            if (boneyard.length > 0) {
              const drawn = drawTile(2);
              if (drawn) {
                 const boardEnds = getBoardEnds(board);
                 if (canPlayTile(drawn, boardEnds)) {
                    playTile(drawn, 2);
                 } else handlePass(2);
              }
            } else {
              handlePass(2);
            }
          }
        }
      }).finally(() => {
        if (isMounted) isProcessingRef.current = false;
      });
    }
    
    return () => { isMounted = false; };
  }, [turn, p2Hand, board, winner, showSetupModal, isInitializing, gameSetupData, boneyard.length]);

  const handleTimeExpired = () => {
    if (winner) return;
    setWinner(turn === 1 ? 2 : 1);
    handleGameOver('timeout', 0);
    toast.error(`Player ${turn} ran out of time!`);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Restoring game state...</p>
      </div>
    );
  }

  const animationStatus = winner === 1 ? 'won' : winner === 2 ? 'lost' : 'in-progress';
  const boardEnds = getBoardEnds(board);
  const p1HasValid = hasValidMoves(p1Hand, boardEnds);

  return (
    <>
      <Helmet><title>Dominoes | NICOLENIUM</title></Helmet>
      
      <CombinedGameSetupModal 
        isOpen={showSetupModal} 
        gameType="dominoes"
        game={{ name: "Dominoes", id: "dominoes" }}
        onGameStart={handleGameStart} 
        onClose={handleCloseModal} 
      />

      {!showSetupModal && gameSetupData && (
        <UnifiedGameLayout title="Dominoes" turnText={winner ? (winner === 'draw' ? 'DRAW!' : `PLAYER ${winner} WINS!`) : `PLAYER ${turn}'S TURN`} history={moveHistory} onReset={() => resetGame()} canUndo={false} gameType="dominoes">
          
          {isInitializing ? (
            <div className="w-full flex flex-col items-center justify-center min-h-[50vh]">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-xl font-bold text-muted-foreground">Initializing Game Session...</p>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-6 pb-12 pt-6">
              
              <div className="w-full max-w-[900px] flex justify-between gap-4">
                <GameClockDisplay playerName={gameSetupData?.players?.p1Name || 'Player 1'} totalTimeSeconds={initialSeconds} timeRemainingSeconds={timeP1} isActive={turn === 1 && !winner} onTimeExpired={handleTimeExpired} />
                <GameClockDisplay playerName={gameSetupData?.players?.p2Name || 'AI'} totalTimeSeconds={initialSeconds} timeRemainingSeconds={timeP2} isActive={turn === 2 && !winner} onTimeExpired={handleTimeExpired} />
              </div>

              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4">
                {p2Hand.map((_, i) => <DominoTile key={i} hidden={true} />)}
              </div>

              {/* Green Felt Board */}
              <div className="w-full max-w-5xl min-h-[350px] sm:min-h-[450px] bg-[#1a4a2c] border-[16px] border-[#3e2723] rounded-3xl p-6 sm:p-10 flex flex-wrap content-center justify-center gap-2 sm:gap-3 shadow-2xl relative overflow-hidden">
                <GameAnimationOverlay gameStatus={animationStatus}>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                  <div className="relative z-10 w-full flex flex-wrap justify-center items-center gap-1 sm:gap-2">
                    {board.length === 0 ? (
                      <span className="text-emerald-100/30 font-black uppercase tracking-widest text-3xl">Place First Tile</span>
                    ) : (
                      board.map((tile, i) => <DominoTile key={i} val1={tile[0]} val2={tile[1]} horizontal={true} />)
                    )}
                  </div>
                </GameAnimationOverlay>
              </div>

              <div className="flex flex-col items-center gap-6 w-full max-w-5xl bg-card p-6 rounded-3xl border border-border shadow-xl">
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  {p1Hand.map((tile, i) => (
                    <DominoTile 
                      key={i} val1={tile[0]} val2={tile[1]} horizontal={false}
                      isInteractive={turn === 1 && !winner && canPlayTile(tile, boardEnds) && !isProcessingRef.current}
                      disabled={turn !== 1 || winner || !canPlayTile(tile, boardEnds) || isProcessingRef.current}
                      onClick={() => playTile(tile, 1)}
                    />
                  ))}
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                  <Button onClick={() => drawTile(1)} disabled={turn !== 1 || winner || boneyard.length === 0 || p1HasValid || isProcessingRef.current} variant="outline" className="font-bold h-12 px-8 flex-1 sm:flex-none border-2">
                    Draw Tile ({boneyard.length})
                  </Button>
                  <Button onClick={() => handlePass(1)} disabled={turn !== 1 || winner || p1HasValid || boneyard.length > 0 || isProcessingRef.current} variant="secondary" className="font-bold h-12 px-8 flex-1 sm:flex-none">
                    Pass Turn
                  </Button>
                </div>
              </div>
              
            </div>
          )}
        </UnifiedGameLayout>
      )}
    </>
  );
}
