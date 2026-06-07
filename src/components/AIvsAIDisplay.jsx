
import React from 'react';
import CheckersBoard from '@/components/CheckersBoard.jsx';
import GameTimer from '@/components/GameTimer.jsx';
import { Button } from '@/components/ui/button';
import { Pause, Play, FastForward, RotateCcw, MonitorPlay } from 'lucide-react';

const AIvsAIDisplay = ({
  boardState,
  currentPlayer,
  ai1Time,
  ai2Time,
  gameStatus,
  difficulty,
  speed,
  isPaused,
  moveHistory,
  capturedPieces,
  onPauseToggle,
  onSpeedChange,
  onReset
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full">
      <div className="flex lg:flex-col justify-center gap-4 w-full lg:w-64 order-2 lg:order-1 shrink-0">
        
        {/* Controls Panel */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 shadow-sm w-full">
          <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-center border-b border-border pb-2 mb-1">
            Simulation Controls
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant={isPaused ? "default" : "outline"} 
              size="sm" 
              onClick={onPauseToggle}
              className="w-full flex items-center justify-center gap-1"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onReset}
              className="w-full flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          <div className="text-xs font-bold text-muted-foreground mt-2 mb-1">Speed Control</div>
          <div className="grid grid-cols-4 gap-1">
            {[0.5, 1, 2, 4].map(s => (
              <Button
                key={s}
                variant={speed === s ? "default" : "outline"}
                size="sm"
                className="text-xs px-1"
                onClick={() => onSpeedChange(s)}
              >
                {s}x
              </Button>
            ))}
          </div>
        </div>

        {/* Timers */}
        <div className="w-full">
          <GameTimer 
            humanPlayerTime={ai1Time}
            opponentTime={ai2Time}
            isHumanPlayerTurn={currentPlayer === 1}
            gameStatus={gameStatus}
            humanName={`AI White (${difficulty})`}
            opponentName={`AI Black (${difficulty})`}
            isAIOpponent={true}
          />
        </div>

        {/* Stats */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm w-full">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-muted-foreground">White Captures:</span>
            <span className="font-bold font-mono">{capturedPieces.p1}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Black Captures:</span>
            <span className="font-bold font-mono">{capturedPieces.p2}</span>
          </div>
          <div className="flex justify-between items-center text-sm mt-3 pt-3 border-t border-border">
            <span className="text-muted-foreground">Moves Made:</span>
            <span className="font-bold font-mono">{moveHistory.length}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[700px] order-1 lg:order-2 flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-4 bg-muted/30 p-3 rounded-xl border border-border">
          <div className="flex items-center gap-2">
            <MonitorPlay className="w-5 h-5 text-primary" />
            <span className="font-bold">AI vs AI Exhibition</span>
          </div>
          <div className={`text-sm font-black uppercase px-4 py-1.5 rounded-full border shadow-sm ${currentPlayer === 1 ? 'bg-[hsl(var(--chk-p1))]/10 text-[hsl(var(--chk-p1))] border-[hsl(var(--chk-p1))]' : 'bg-[hsl(var(--chk-p2))]/10 text-[hsl(var(--chk-p2))] border-[hsl(var(--chk-p2))]'}`}>
            {gameStatus !== 'active' ? gameStatus.replace('_', ' ') : currentPlayer === 1 ? "White's Turn" : "Black's Turn"}
          </div>
        </div>
        
        <CheckersBoard 
          boardState={boardState}
          selectedSquare={null}
          validMoves={new Map()}
          onSquareClick={() => {}}
        />
      </div>
    </div>
  );
};

export default AIvsAIDisplay;
