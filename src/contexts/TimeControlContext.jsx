
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const TimeControlContext = createContext();

export const useTimeControl = () => useContext(TimeControlContext);

export const TimeControlProvider = ({ children }) => {
  const [timeSettings, setTimeSettings] = useState(() => {
    const saved = localStorage.getItem('nicd_time_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error('Failed to parse saved time settings'); }
    }
    return {
      timeControlType: 'rapid_10min',
      customMinutes: 10,
      customSeconds: 0
    };
  });

  useEffect(() => {
    localStorage.setItem('nicd_time_settings', JSON.stringify(timeSettings));
  }, [timeSettings]);

  const getInitialSeconds = useCallback((gameSetupData = timeSettings) => {
    const safeData = gameSetupData || {};
    const timeControlType = safeData.timeControlType || safeData.timeLimit || 'rapid_10min';
    
    switch (timeControlType) {
      case 'rapid_10min': case '10': return 10 * 60;
      case 'blitz_5min': case '5': return 5 * 60;
      case 'bullet_3min': case '3': return 3 * 60;
      case 'bullet_1min': case '1': return 1 * 60;
      case 'custom': return (parseInt(safeData.customMinutes || safeData.customTime) || 0) * 60 + (parseInt(safeData.customSeconds) || 0);
      case 'unlimited': case 'no_limit':
      default: return Infinity;
    }
  }, [timeSettings]);

  const updateTimeSettings = useCallback((newSettings) => {
    setTimeSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <TimeControlContext.Provider value={{
      timeSettings,
      updateTimeSettings,
      getInitialSeconds
    }}>
      {children}
    </TimeControlContext.Provider>
  );
};
