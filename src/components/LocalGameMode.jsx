
import React, { useState, useEffect } from 'react';
import CheckersBoard from '@/components/CheckersBoard.jsx';
import GameStatusPanel from '@/components/GameStatusPanel.jsx';
import MoveHistoryPanel from '@/components/MoveHistoryPanel.jsx';
import CameraButton from '@/components/CameraButton.jsx';
import LocationDisplay from '@/components/LocationDisplay.jsx';
import { Button } from '@/components/ui/button.jsx';
import { RotateCcw, Undo2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  createInitialBoard, 
  getValidMoves, 
  executeMove, 
  validateMove, 
  getGameStatus, 
  convertPositionToNotation,
  hasAnyCapture,
  switchTurn
} from '@/utils/CheckersGameLogic.js';
import { useGameSession } from '@/hooks/useGameSession.js';

const LocalGameMode = () => {
  const [board, setBoard] = useState(() => createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [capturedPieces, setCapturedPieces] = useState({ p1: 0, p2: 0 });
  const [gameStatus, setGameStatus] = useState('in_progress');
  const [historyStack, setHistoryStack] = useState([]);
  const [sessionInitialized, setSessionInitialized] = useState(false);

  const { initializeSession, recordMove, handleGameOver, moveHistory, sessionId } = useGameSession('checkers-8x8', { mode: 'local_multiplayer' });

  useEffect(() => {
    if (!sessionInitialized) {
      initializeSession({ mode: 'local_multiplayer', timeControl: 'custom' });
      setSessionInitialized(true);
    }
  }, [initializeSession, sessionInitialized]);

  const handleRestart = () => {
    setBoard(createInitialBoard());
    setCurrentPlayer(1);
    setSelectedSquare(null);
    setValidMoves([]);
    setCapturedPieces({ p1: 0, p2: 0 });
    setGameStatus('in_progress');
    setHistoryStack([]);
    initializeSession({ mode: 'local_multiplayer', timeControl: 'custom' });
    toast.success("Game restarted");
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const prevState = historyStack[historyStack.length - 1];
    setBoard(prevState.board);
    setCurrentPlayer(prevState.currentPlayer);
    setCapturedPieces(prevState.capturedPieces);
    setGameStatus(prevState.gameStatus);
    setHistoryStack(historyStack.slice(0, -1));
    setSelectedSquare(null);
    setValidMoves([]);
    toast.info("Move undone. Note: Full server sync for undo is limited.");
  };

  const handleSquareClick = (pos) => {
    if (gameStatus !== 'in_progress') return;

    const piece = board[pos.r][pos.c];
    const isOwnPiece = piece !== 0 && (currentPlayer === 1 ? (piece === 1 || piece === 3) : (piece === 2 || piece === 4));

    if (isOwnPiece) {
      const globalCaptureRequired = hasAnyCapture(board, currentPlayer);
      let pieceMoves = getValidMoves(board, pos, currentPlayer);
      
      if (globalCaptureRequired) {
        pieceMoves = pieceMoves.filter(m => m.isCapture);
      }

      if (pieceMoves.length > 0) {
        setSelectedSquare(pos);
        setValidMoves(pieceMoves);
      } else {
        setSelectedSquare(null);
        setValidMoves([]);
      }
      return;
    }

    if (selectedSquare) {
      const move = validateMove(board, selectedSquare, pos, currentPlayer);
      if (move) {
        // Save state for undo
        setHistoryStack([...historyStack, {
          board: board.map(r => [...r]),
          currentPlayer,
          capturedPieces: { ...capturedPieces },
          gameStatus
        }]);

        const { newBoard, capturedPieces: caps, pos: finalPos, madeKing } = executeMove(board, selectedSquare, move, currentPlayer);
        
        let notation = convertPositionToNotation(selectedSquare, finalPos, move.isCapture);
        if (madeKing) notation += ' (King)';
        
        recordMove(notation, caps.length * 10, { 
          player: currentPlayer === 1 ? 'Red' : 'Black',
          moveNumber: Math.floor(moveHistory.length / 2) + 1 
        });
        
        let newCaps = { ...capturedPieces };
        if (caps && caps.length > 0) {
          const key = currentPlayer === 1 ? 'p1' : 'p2';
          newCaps[key] += caps.length;
        }
        
        let nextPlayer = currentPlayer;
        let isTurnOver = true;

        if (move.isCapture && !madeKing) {
          const additionalCaptures = getValidMoves(newBoard, finalPos, currentPlayer).filter(m => m.isCapture);
          if (additionalCaptures.length > 0) {
            isTurnOver = false;
            setBoard(newBoard);
            setSelectedSquare(finalPos);
            setValidMoves(additionalCaptures);
          }
        }

        if (isTurnOver) {
          nextPlayer = switchTurn(currentPlayer);
          setSelectedSquare(null);
          setValidMoves([]);
        }

        const newStatus = getGameStatus(newBoard, nextPlayer);
        
        setBoard(newBoard);
        setCurrentPlayer(nextPlayer);
        setCapturedPieces(newCaps);
        if (newStatus !== 'in_progress') {
          setGameStatus(newStatus);
          handleGameOver(newStatus);
          toast.success(newStatus === 'player1_win' ? 'Red Wins!' : 'Black Wins!');
        }
      } else {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    }
  };

  return (
    <div className="game-layout-grid flex flex-col lg:flex-row gap-8 flex-1 w-full mx-auto">
      <div className="board-container flex flex-col items-center flex-1 max-w-2xl mx-auto">
        <div className="w-full flex justify-between items-center mb-4 px-4">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${currentPlayer === 1 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-zinc-800 border border-zinc-600'}`} />
            <span className="font-bold text-lg uppercase tracking-widest">
              {currentPlayer === 1 ? "Red's Turn" : "Black's Turn"}
            </span>
          </div>
          <div className="flex gap-2">
            <CameraButton sessionId={sessionId || `local-${Date.now()}`} />
            <Button variant="outline" size="sm" onClick={handleUndo} disabled={historyStack.length === 0}>
              <Undo2 className="w-4 h-4 mr-2" /> Undo
            </Button>
            <Button variant="outline" size="sm" onClick={handleRestart}>
              <RotateCcw className="w-4 h-4 mr-2" /> Restart
            </Button>
          </div>
        </div>
        
        <CheckersBoard 
          board={board}
          selectedSquare={selectedSquare}
          validMoves={validMoves}
          onSquareClick={handleSquareClick}
          playerColor={currentPlayer}
        />

        <div className="w-full mt-4 flex justify-between items-center px-4">
          <LocationDisplay sessionId={sessionId || `local-${Date.now()}`} />
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full lg:w-80 flex-shrink-0">
        <GameStatusPanel 
          currentPlayer={currentPlayer}
          moveCount={Math.floor(moveHistory.length / 2) + 1}
          capturedPieces={capturedPieces}
          gameStatus={gameStatus}
        />
        <div className="flex-1 min-h-[300px] border border-border rounded-xl overflow-hidden bg-card text-card-foreground">
          <MoveHistoryPanel history={moveHistory} gameType="checkers" />
        </div>
      </div>
    </div>
  );
};

export default LocalGameMode;
