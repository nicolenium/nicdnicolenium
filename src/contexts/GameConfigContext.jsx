
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GameConfigContext = createContext();

export const useGameConfig = () => useContext(GameConfigContext);

export const GameConfigProvider = ({ children }) => {
  const location = useLocation();
  
  // Initialize from localStorage if available
  const [gameConfig, setGameConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('nicd_game_config');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  
  const [gameMode, setGameMode] = useState(gameConfig?.mode || 'human_vs_computer');
  const [timeControl, setTimeControl] = useState(gameConfig?.timeLimit?.toString() || '600');
  const [customTimeMinutes, setCustomTimeMinutes] = useState(15);

  // Clear game config on route change to force setup modal, unless we just set it
  useEffect(() => {
    const handleRouteChange = () => {
      // We want to force the setup modal on new game pages, but keep the config if we just started
      // For now, we clear it to ensure the modal always appears on fresh navigation
      setGameConfig(null);
    };
    handleRouteChange();
  }, [location.pathname]);

  const updateGameConfig = (newConfig) => {
    setGameConfig(newConfig);
    if (newConfig) {
      try {
        localStorage.setItem('nicd_game_config', JSON.stringify(newConfig));
      } catch (e) {
        console.error('Failed to save game config to localStorage', e);
      }
      if (newConfig.mode) setGameMode(newConfig.mode);
      if (newConfig.timeLimit) setTimeControl(newConfig.timeLimit.toString());
    } else {
      localStorage.removeItem('nicd_game_config');
    }
  };

  return (
    <GameConfigContext.Provider value={{ 
      gameConfig, 
      setGameConfig: updateGameConfig,
      gameMode,
      setGameMode,
      timeControl,
      setTimeControl,
      customTimeMinutes,
      setCustomTimeMinutes
    }}>
      {children}
    </GameConfigContext.Provider>
  );
};
