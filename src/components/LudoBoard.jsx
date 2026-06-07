
import React from 'react';
import { LUDO_COLORS, SAFE_ZONES, TRACK_PATH, HOME_STRETCHES, getAbsolutePos, createInitialLudoState } from '@/utils/LudoLogic.js';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils.js';

const getCellCSS = (r, c) => ({
  left: `${(c * 100 / 15)}%`,
  top: `${(r * 100 / 15)}%`,
  width: `${100 / 15}%`,
  height: `${100 / 15}%`
});

const LudoBoard = ({ gameState, onPieceClick, validPieces = [] }) => {
  // Safe initialization to prevent undefined errors
  const safeGameState = gameState || createInitialLudoState();
  const pieces = safeGameState?.pieces || [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  const turn = safeGameState?.turn ?? 0;

  const getPieceCoords = (player, pieceIndex) => {
    try {
      const pos = pieces[player]?.[pieceIndex] ?? 0;
      
      if (pos === -1) {
        // Base rendering (4 corners)
        const baseCoords = [
          [{r:2, c:2}, {r:2, c:3}, {r:3, c:2}, {r:3, c:3}], // Red Top-Left
          [{r:2, c:11}, {r:2, c:12}, {r:3, c:11}, {r:3, c:12}], // Green Top-Right
          [{r:11, c:11}, {r:11, c:12}, {r:12, c:11}, {r:12, c:12}], // Yellow Bottom-Right
          [{r:11, c:2}, {r:11, c:3}, {r:12, c:2}, {r:12, c:3}], // Blue Bottom-Left
        ];
        return baseCoords[player]?.[pieceIndex] || { r: 7, c: 7 };
      }
      
      if (pos >= 0 && pos <= 50) {
        const absPos = getAbsolutePos(player, pos);
        return TRACK_PATH[absPos] || { r: 7, c: 7 };
      }
      
      if (pos >= 51 && pos <= 56) {
        return HOME_STRETCHES[player]?.[pos - 51] || { r: 7, c: 7 };
      }
      
      return { r: 7, c: 7 }; // Center safety if completed
    } catch (error) {
      console.error("Error calculating piece coordinates:", error);
      return { r: 7, c: 7 };
    }
  };

  return (
    <div className="w-full max-w-[70vh] aspect-square relative bg-white border-[12px] border-slate-300 rounded-xl shadow-2xl overflow-hidden">
      
      {/* 4 Colored Bases */}
      <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-red-500 border-r-4 border-b-4 border-slate-300 p-[10%]">
        <div className="w-full h-full bg-white rounded-2xl shadow-inner" />
      </div>
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-green-500 border-l-4 border-b-4 border-slate-300 p-[10%]">
        <div className="w-full h-full bg-white rounded-2xl shadow-inner" />
      </div>
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-yellow-400 border-l-4 border-t-4 border-slate-300 p-[10%]">
        <div className="w-full h-full bg-white rounded-2xl shadow-inner" />
      </div>
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-500 border-r-4 border-t-4 border-slate-300 p-[10%]">
        <div className="w-full h-full bg-white rounded-2xl shadow-inner" />
      </div>

      {/* Grid rendering for visual track borders */}
      <div className="absolute inset-0 z-0">
        {Array.from({length: 225}).map((_, i) => {
          const r = Math.floor(i / 15);
          const c = i % 15;
          const isTrack = (r >= 6 && r <= 8) || (c >= 6 && c <= 8);
          if (!isTrack) return null;
          
          let bgClass = "bg-white border border-slate-200";
          if (r === 7 && c >= 1 && c <= 5) bgClass = "bg-red-500/80 border-slate-300/50";
          if (c === 7 && r >= 1 && r <= 5) bgClass = "bg-green-500/80 border-slate-300/50";
          if (r === 7 && c >= 9 && c <= 13) bgClass = "bg-yellow-400/80 border-slate-300/50";
          if (c === 7 && r >= 9 && r <= 13) bgClass = "bg-blue-500/80 border-slate-300/50";
          
          // Safe Zones
          const isSafeZone = SAFE_ZONES?.some(z => z.r === r && z.c === c);

          if (isSafeZone && bgClass === "bg-white border border-slate-200") {
             bgClass = "bg-slate-200 border-slate-300";
          }

          return (
            <div key={i} className={cn("absolute flex items-center justify-center", bgClass)} style={getCellCSS(r, c)}>
              {isSafeZone && <Star className="w-1/2 h-1/2 text-slate-400" />}
            </div>
          );
        })}
        {/* Center Triangles */}
        <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] z-0">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <polygon points="0,0 50,50 0,100" fill={LUDO_COLORS[0]?.hex || '#ef4444'} />
            <polygon points="0,0 100,0 50,50" fill={LUDO_COLORS[1]?.hex || '#22c55e'} />
            <polygon points="100,0 100,100 50,50" fill={LUDO_COLORS[2]?.hex || '#eab308'} />
            <polygon points="0,100 100,100 50,50" fill={LUDO_COLORS[3]?.hex || '#3b82f6'} />
          </svg>
        </div>
      </div>

      {/* Pieces Rendering */}
      {pieces.map((playerPieces, playerIdx) => 
        (playerPieces || []).map((pos, pieceIdx) => {
          if (pos === 56) return null; // Fully home, hidden
          
          const coords = getPieceCoords(playerIdx, pieceIdx);
          const isClickable = turn === playerIdx && validPieces?.includes(pieceIdx);
          
          return (
            <div 
              key={`p-${playerIdx}-${pieceIdx}`}
              onClick={() => isClickable && onPieceClick?.(playerIdx, pieceIdx)}
              className={cn(
                "absolute z-10 transition-all duration-300 flex items-center justify-center p-1",
                isClickable ? "cursor-pointer animate-bounce z-20 scale-110" : ""
              )}
              style={getCellCSS(coords.r, coords.c)}
            >
              <div 
                className="w-[85%] h-[85%] rounded-full shadow-lg border-2 border-white/50"
                style={{ backgroundColor: LUDO_COLORS[playerIdx]?.hex || '#000' }}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default LudoBoard;
