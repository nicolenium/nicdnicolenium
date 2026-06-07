
import React from 'react';

export const PieceStylePreview = ({ styleId, isSelected, onClick }) => {
  return (
    <button 
      onClick={onClick}
      type="button"
      className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
        isSelected 
          ? 'border-primary bg-primary/10 shadow-md scale-105' 
          : 'border-transparent hover:border-primary/30 hover:bg-muted'
      }`}
    >
      <div className="flex gap-2">
        <div className={`w-8 h-8 rounded-full shadow-md theme-piece-${styleId} bg-[hsl(var(--piece-light,0_0%_100%))] border-2 border-slate-200 flex items-center justify-center`}>
          {styleId === '3d' && <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white to-transparent opacity-50" />}
          {styleId === 'cartoon' && <div className="w-2 h-2 rounded-full bg-white absolute top-1 left-2 opacity-80" />}
        </div>
        <div className={`w-8 h-8 rounded-full shadow-md theme-piece-${styleId} bg-[hsl(var(--piece-dark,0_0%_15%))] border-2 border-slate-800 flex items-center justify-center`}>
          {styleId === '3d' && <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white to-transparent opacity-20" />}
          {styleId === 'cartoon' && <div className="w-2 h-2 rounded-full bg-white absolute top-1 left-2 opacity-40" />}
        </div>
      </div>
      <span className="text-xs font-bold capitalize">{styleId}</span>
    </button>
  );
};

export default PieceStylePreview;
