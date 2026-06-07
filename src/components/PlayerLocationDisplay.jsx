
import React from 'react';
import { codeToFlag } from '@/utils/geolocationService.js';

const PlayerLocationDisplay = ({ country, state, countryCode, showState = true, className = "" }) => {
  const flag = countryCode ? codeToFlag(countryCode) : '🌍';
  
  if (!country) return null;

  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground ${className}`}>
      <span className="text-base leading-none" role="img" aria-label={`Flag of ${country}`}>
        {flag}
      </span>
      <span>
        {showState && state && state !== 'Unknown' ? `${state}, ` : ''}{country}
      </span>
    </span>
  );
};

export default PlayerLocationDisplay;
