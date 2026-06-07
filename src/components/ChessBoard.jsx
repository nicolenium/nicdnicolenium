
import React from 'react';
import { cn } from '@/lib/utils';

// Using standard Unicode solid chess pieces
const PIECES = {
  'K': '♚', 'Q': '♛', 'R': '♜', 'B': '♝', 'N': '♞', 'P': '♟', // White
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'  // Black
};

const ChessBoard = ({ boardState, onCellClick, selectedCell, validMoves, flipped = false }) => {
  if (!boardState || !boardState.length) return null;

  const isWhitePiece = (p) => p && p === p.toUpperCase();

  const renderCell = (r, c) => {
    // If flipped, invert coordinates for rendering
    const displayR = flipped ? 7 - r : r;
    const displayC = flipped ? 7 - c : c;
    
    const piece = boardState[displayR][displayC];
    const isDark = (displayR + displayC) % 2 === 1;
    const isSelected = selectedCell?.r === displayR && selectedCell?.c === displayC;
    const isValidMove = validMoves?.some(m => m.r === displayR && m.c === displayC);
    
    return (
      <button
        key={`${displayR}-${displayC}`}
        className={cn(
          "w-full h-full flex items-center justify-center relative transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary z-10",
          isDark ? "bg-[#B58863]" : "bg-[#F0D9B5]", // Updated to requested standard chess colors
          isSelected && "ring-inset ring-4 ring-primary z-20 bg-primary/30"
        )}
        onClick={() => onCellClick(displayR, displayC)}
        aria-label={`Square ${String.fromCharCode(97 + displayC)}${8 - displayR}`}
      >
        {isValidMove && (
          <div className={cn(
            "absolute rounded-full z-10 pointer-events-none",
            piece ? "w-full h-full border-4 border-black/20 bg-transparent ring-inset" : "w-1/3 h-1/3 bg-black/20"
          )} />
        )}
        
        {piece && (
          <span 
            className={cn(
              "text-[min(4vw,40px)] sm:text-[min(5vw,55px)] leading-none select-none z-20 transition-transform duration-200",
              isSelected && "scale-110"
            )}
            style={{
              // White pieces: White fill, black outline. Black pieces: Black fill, white outline.
              color: isWhitePiece(piece) ? '#FFFFFF' : '#000000',
              WebkitTextStroke: isWhitePiece(piece) ? '1.5px #000000' : '1px #FFFFFF',
              textShadow: isWhitePiece(piece) ? '0 2px 4px rgba(0,0,0,0.5)' : '0 2px 4px rgba(255,255,255,0.3)'
            }}
          >
            {PIECES[piece]}
          </span>
        )}
        
        {/* Coordinates */}
        {displayC === 0 && (
          <span className={cn("absolute top-0.5 left-1 text-[8px] sm:text-[10px] font-bold select-none", isDark ? "text-[#F0D9B5]" : "text-[#B58863]")}>
            {8 - displayR}
          </span>
        )}
        {displayR === 7 && (
          <span className={cn("absolute bottom-0.5 right-1 text-[8px] sm:text-[10px] font-bold select-none", isDark ? "text-[#F0D9B5]" : "text-[#B58863]")}>
            {String.fromCharCode(97 + displayC)}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="w-full max-w-[80vh] aspect-square border-[8px] sm:border-[12px] border-[#312e2b] rounded-md overflow-hidden shadow-2xl bg-[#312e2b]">
      <div className="w-full h-full grid grid-cols-8 grid-rows-8">
        {Array(8).fill(null).map((_, r) => 
          Array(8).fill(null).map((_, c) => renderCell(r, c))
        )}
      </div>
    </div>
  );
};

export default ChessBoard;
