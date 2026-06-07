
import React from 'react';
import { ShieldCheck } from 'lucide-react';

const BrandingWatermark = ({ position = 'bottom-right', className = '' }) => {
  const positionClasses = {
    'top-left': 'top-6 left-6',
    'top-right': 'top-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-right': 'bottom-6 right-6',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'relative': ''
  };

  return (
    <div className={`pointer-events-none select-none flex items-center gap-2 opacity-60 ${position !== 'relative' ? 'absolute z-0' : ''} ${positionClasses[position]} ${className}`}>
      <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-primary drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
      <div className="flex flex-col">
        <span className="font-black text-sm md:text-base leading-none text-foreground tracking-[0.15em] uppercase drop-shadow-md">
          NICD
        </span>
        <span className="text-[8px] md:text-[10px] font-bold text-primary uppercase tracking-[0.3em] mt-0.5 drop-shadow-md">
          Nicolenium
        </span>
      </div>
    </div>
  );
};

export default BrandingWatermark;
