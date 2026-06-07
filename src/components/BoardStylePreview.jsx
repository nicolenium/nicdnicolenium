
import React from 'react';

const PREVIEW_COLORS = {
  classic: { light: 'hsl(36, 60%, 85%)', dark: 'hsl(28, 50%, 45%)' },
  modern: { light: 'hsl(210, 20%, 85%)', dark: 'hsl(210, 30%, 35%)' },
  nature: { light: 'hsl(120, 30%, 90%)', dark: 'hsl(120, 40%, 40%)' },
  ocean: { light: 'hsl(190, 50%, 85%)', dark: 'hsl(200, 60%, 35%)' },
  sunset: { light: 'hsl(40, 80%, 85%)', dark: 'hsl(15, 70%, 50%)' },
  marble: { light: 'hsl(0, 0%, 95%)', dark: 'hsl(0, 0%, 60%)' },
  wood: { light: 'hsl(30, 40%, 70%)', dark: 'hsl(20, 50%, 35%)' },
  custom: { light: 'hsl(0, 0%, 80%)', dark: 'hsl(0, 0%, 20%)' }
};

export const BoardStylePreview = ({ styleId, isSelected, onClick }) => {
  const colors = PREVIEW_COLORS[styleId] || PREVIEW_COLORS.classic;
  
  return (
    <button 
      onClick={onClick}
      type="button"
      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
        isSelected 
          ? 'border-primary bg-primary/10 shadow-md scale-105' 
          : 'border-transparent hover:border-primary/30 hover:bg-muted'
      }`}
    >
      <div className="w-16 h-16 rounded-md overflow-hidden grid grid-cols-4 grid-rows-4 shadow-inner border border-black/10">
        {Array.from({ length: 16 }).map((_, i) => {
          const r = Math.floor(i / 4);
          const c = i % 4;
          const isDark = (r + c) % 2 === 1;
          
          return (
            <div 
              key={i} 
              style={{ backgroundColor: isDark ? colors.dark : colors.light }} 
              className="w-full h-full relative"
            >
              {/* Fake piece on select dark squares */}
              {i === 5 && <div className="absolute inset-[20%] rounded-full bg-white shadow-sm border border-black/10" />}
              {i === 10 && <div className="absolute inset-[20%] rounded-full bg-slate-900 shadow-sm border border-black/10" />}
            </div>
          );
        })}
      </div>
      <span className="text-xs font-bold capitalize">{styleId}</span>
    </button>
  );
};

export default BoardStylePreview;
