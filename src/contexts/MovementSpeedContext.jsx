
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserSettings } from '@/hooks/useUserSettings.js';

const MovementSpeedContext = createContext();

export const SPEED_DURATIONS = {
  slow: 2,
  normal: 1,
  fast: 0.5,
  instant: 0
};

export const useMovementSpeed = () => useContext(MovementSpeedContext);

export const MovementSpeedProvider = ({ children }) => {
  const { settings, updateSettings } = useUserSettings();
  const [speed, setSpeed] = useState('normal');

  useEffect(() => {
    console.log('[MovementSpeedContext] Initializing with settings:', settings);
    if (settings?.movement_speed) {
      setSpeed(settings.movement_speed);
    }
  }, [settings]);

  const handleSetSpeed = async (newSpeed) => {
    console.log('[MovementSpeedContext] Setting speed:', newSpeed);
    setSpeed(newSpeed);
    if (settings) {
      try {
        await updateSettings({ movement_speed: newSpeed });
      } catch (err) {
        console.error('[MovementSpeedContext] Failed to save speed to settings', err);
      }
    }
  };

  const getDuration = () => SPEED_DURATIONS[speed] || 1;

  return (
    <MovementSpeedContext.Provider value={{ speed, setSpeed: handleSetSpeed, getDuration }}>
      {children}
    </MovementSpeedContext.Provider>
  );
};
