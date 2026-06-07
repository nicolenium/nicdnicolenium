
import React from 'react';
import { getSquareNumber } from '@/utils/CheckersGameLogic.js';

const CheckersPiece = ({ color, isKing, isSelected }) => (
  <div className={`
    w-[80%] h-[80%] rounded-full shadow-lg flex items-center justify-center border-[3px]
    ${color === 'red' ? 'bg-red-600 border-red-800' : 'bg-zinc-800 border-black'}
    ${isSelected ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-amber-900' : ''}
    transition-all duration-200
  `}>
    {isKing && <div className={`w-1/2 h-1/2 rounded-full ${color === 'red' ? 'bg-red-800' : 'bg-zinc-950'} border-2 border-yellow-400/50 flex items-center justify-center`}><span className="text-yellow-400 text-xs">K</span></div>}
  </div>
);

const CheckersBoard = ({ board, selectedSquare, validMoves, onSquareClick }) => {
  const isPlayableSquare = (r, c) => (r + c) % 2 === 1;

  return (
    <div className="w-full max-w-[80vh] aspect-square border-[12px] border-[#3e2723] rounded-xl overflow-hidden shadow-2xl relative bg-[#3e2723]">
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 border border-black/50">
        {board.map((row, r) => 
          row.map((piece, c) => {
            const isDark = isPlayableSquare(r, c);
            const isSelected = selectedSquare?.r === r && selectedSquare?.c === c;
            const isValidDest = validMoves?.some(m => m.toR === r && m.toC === c);
            const squareNum = getSquareNumber(r, c);

            return (
              <div 
                key={`${r}-${c}`}
                onClick={() => isDark && onSquareClick({r, c})}
                className={`
                  relative flex items-center justify-center transition-colors duration-200
                  ${isDark ? 'bg-[#8d6e63] cursor-pointer hover:brightness-110' : 'bg-[#d7ccc8]'}
                  ${isSelected ? 'after:absolute after:inset-0 after:bg-yellow-400/20 after:border-2 after:border-yellow-400 z-10' : ''}
                `}
              >
                {isDark && squareNum && (
                  <span className="absolute top-0.5 left-1 text-[8px] sm:text-[10px] font-bold select-none font-mono text-black/30">
                    {squareNum}
                  </span>
                )}
                {isValidDest && (
                  <div className="absolute w-4 h-4 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse z-10" />
                )}
                {piece !== 0 && (
                  <CheckersPiece 
                    color={piece === 1 || piece === 3 ? 'red' : 'black'} 
                    isKing={piece === 3 || piece === 4}
                    isSelected={isSelected}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CheckersBoard;
