
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils.js';
import { getSquareNumber10x10 } from '@/utils/CheckersGameLogic10x10.js';

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const ROWS = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];

// Player 1 = Dark Pieces, Player 2 = Light Pieces
const CheckersPiece10x10 = ({ player, isKing, isSelected }) => {
  const isDarkPiece = player === 1;
  return (
    <div className={cn(
      "w-[85%] h-[85%] rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center border-4 relative overflow-hidden",
      isDarkPiece ? "bg-slate-800 border-slate-950" : "bg-stone-200 border-stone-400",
      isSelected && "ring-4 ring-[#C4B552] ring-offset-2 ring-offset-amber-900 transition-all"
    )}>
      {/* Texture / Highlight */}
      <div className={cn(
        "absolute inset-1 rounded-full border-2 opacity-50",
        isDarkPiece ? "border-white/10" : "border-black/10"
      )} />
      {/* Inner concentric ring */}
      <div className={cn(
        "absolute inset-3 rounded-full border-2 opacity-40",
        isDarkPiece ? "border-white/10" : "border-black/10"
      )} />
      
      {isKing && (
        <div className={cn(
          "w-1/2 h-1/2 rounded-full flex items-center justify-center shadow-inner relative z-10",
          isDarkPiece ? "bg-slate-900 border-2 border-yellow-500/50" : "bg-stone-100 border-2 border-yellow-500/50"
        )}>
          <CrownIcon className="w-3/5 h-3/5 text-yellow-500" />
        </div>
      )}
    </div>
  );
};

const CrownIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
  </svg>
);

const CheckersBoard10x10 = ({ 
  board = [], 
  onSquareClick, 
  selectedSquare = null, 
  validMoves = [], 
  interactive = true,
  lastMove = null
}) => {
  if (!board || !Array.isArray(board) || board.length !== 10) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-amber-100 rounded-xl border-4 border-orange-600">
        <div className="animate-pulse font-bold text-orange-800">Loading Board Data...</div>
      </div>
    );
  }

  const isValidMoveDest = (r, c) => validMoves?.some(m => m?.to?.r === r && m?.to?.c === c) || false;
  
  const isLastMove = (r, c) => {
    if (!lastMove) return false;
    const isFrom = lastMove.from?.r === r && lastMove.from?.c === c;
    const isTo = lastMove.to?.r === r && lastMove.to?.c === c;
    return isFrom || isTo;
  };
  
  const pieceExists = (r, c) => board?.[r]?.[c] != null;

  return (
    <div className="relative w-full h-full max-w-[85vh] aspect-square select-none flex flex-col items-center justify-center p-2 sm:p-4" aria-label="10x10 Checkers Board">
      
      {/* Coordinate Labels - Top */}
      <div className="flex w-[90%] mb-1" aria-hidden="true">
        {COLS.map(col => (
          <div key={`top-${col}`} className="flex-1 text-center text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">{col}</div>
        ))}
      </div>

      <div className="flex w-full h-[90%]">
        {/* Coordinate Labels - Left */}
        <div className="flex flex-col w-[5%] mr-1" aria-hidden="true">
          {ROWS.map(row => (
            <div key={`left-${row}`} className="flex-1 flex items-center justify-end text-[10px] sm:text-xs font-bold text-muted-foreground pr-1">{row}</div>
          ))}
        </div>

        {/* Main Board Container - Orange Border */}
        <div className="w-[90%] h-full overflow-hidden border-[6px] sm:border-[10px] border-orange-600 shadow-2xl relative bg-amber-100 rounded-sm">
          {/* Squares Layer */}
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
            {board.map((row, r) => 
              row.map((_, c) => {
                const isDark = (r + c) % 2 === 1;
                const isSelected = selectedSquare?.r === r && selectedSquare?.c === c;
                const isDest = isValidMoveDest(r, c);
                const isLast = isLastMove(r, c);
                const sqNum = getSquareNumber10x10(r, c);

                return (
                  <button
                    key={`sq-${r}-${c}`}
                    onClick={() => interactive && isDark && onSquareClick?.(r, c)}
                    disabled={!interactive || !isDark}
                    aria-label={`Square ${sqNum || `${COLS[c]}${ROWS[r]}`}`}
                    className={cn(
                      "relative flex items-center justify-center transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:z-30",
                      isDark ? "bg-amber-900" : "bg-amber-100",
                      interactive && isDark && !pieceExists(r, c) && "cursor-pointer hover:brightness-110",
                      isSelected && "ring-inset ring-4 ring-[#C4B552] z-10 before:absolute before:inset-0 before:bg-[#C4B552]/30",
                      isLast && !isSelected && "before:absolute before:inset-0 before:bg-[#C4B552]/20 border-2 border-[#C4B552]"
                    )}
                  >
                    {isDark && sqNum && (
                      <span className="absolute bottom-0.5 right-0.5 text-[7px] sm:text-[9px] font-bold text-white/50 select-none pointer-events-none drop-shadow-sm z-0">
                        {sqNum}
                      </span>
                    )}
                    {isDest && (
                      <div className="absolute w-1/3 h-1/3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse z-10" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Pieces Layer */}
          <div className="absolute inset-0 pointer-events-none">
            <AnimatePresence>
              {board.map((row, r) => 
                row.map((piece, c) => {
                  if (!piece) return null;
                  const isSelected = selectedSquare?.r === r && selectedSquare?.c === c;
                  return (
                    <motion.div
                      key={`piece-${piece.player}-${piece.id || `${r}-${c}`}`}
                      layout
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, left: `${c * 10}%`, top: `${r * 10}%` }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="absolute piece-container w-[10%] h-[10%] flex items-center justify-center pointer-events-auto"
                      onClick={() => interactive && onSquareClick?.(r, c)}
                    >
                      <CheckersPiece10x10 player={piece.player} isKing={piece.isKing} isSelected={isSelected} />
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Coordinate Labels - Right */}
        <div className="flex flex-col w-[5%] ml-1" aria-hidden="true">
          {ROWS.map(row => (
            <div key={`right-${row}`} className="flex-1 flex items-center justify-start text-[10px] sm:text-xs font-bold text-muted-foreground pl-1">{row}</div>
          ))}
        </div>
      </div>

      {/* Coordinate Labels - Bottom */}
      <div className="flex w-[90%] mt-1" aria-hidden="true">
        {COLS.map(col => (
          <div key={`bottom-${col}`} className="flex-1 text-center text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">{col}</div>
        ))}
      </div>
    </div>
  );
};

export default CheckersBoard10x10;
