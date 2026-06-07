
import React from 'react';
import { cn } from '@/lib/utils';

const GameBoardRenderer = ({ 
  grid, 
  renderCell, 
  className, 
  style,
  onCellClick 
}) => {
  if (!grid || !grid.length) return null;
  
  const rows = grid.length;
  const cols = grid[0].length;

  return (
    <div 
      className={cn("grid gap-1", className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        ...style
      }}
    >
      {grid.map((row, r) => 
        row.map((cell, c) => (
          <div 
            key={`${r}-${c}`} 
            onClick={() => onCellClick && onCellClick(r, c, cell)}
            className="relative w-full h-full flex items-center justify-center"
          >
            {renderCell(cell, r, c)}
          </div>
        ))
      )}
    </div>
  );
};

export default GameBoardRenderer;
