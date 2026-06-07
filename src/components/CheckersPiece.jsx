
import React from 'react';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils.js';

const CheckersPiece = ({ player, isKing, isSelected, theme = 'classic' }) => {
  const isP1 = player === 1; // White Piece
  
  return (
    <div
      className={cn(
        "w-[90%] h-[90%] rounded-full flex items-center justify-center transition-all duration-300 relative",
        // Pure solid colors - no gradients, no shading
        isP1 
          ? "bg-[#FFFFFF] border-2 border-gray-300" 
          : "bg-[#000000] border-2 border-gray-700",
        isSelected ? 'scale-110 ring-4 ring-[#C4B552] ring-offset-2 ring-offset-transparent z-20' : 'z-10'
      )}
      aria-label={`${isP1 ? 'White' : 'Black'} ${isKing ? 'King' : 'Piece'}`}
    >
      <div 
        className={cn(
          "w-full h-full rounded-full flex items-center justify-center overflow-hidden",
          isP1 ? "border border-gray-200" : "border border-gray-600"
        )}
      >
        {isKing && (
          <Crown 
            className={cn("w-[55%] h-[55%] drop-shadow-sm", isP1 ? "text-gray-400" : "text-gray-300")} 
            strokeWidth={3} 
          />
        )}
      </div>
    </div>
  );
};

export default CheckersPiece;
