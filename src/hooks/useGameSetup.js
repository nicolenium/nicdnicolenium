
import { useState, useCallback } from 'react';

export function useGameSetup(initialGame = null) {
  const [config, setConfig] = useState({
    entryFee: '',
    prizeAmount: '',
    timeLimit: '10',
    difficulty: 'medium',
    players: '2',
    mode: 'online'
  });
  
  const [acceptedTnC, setAcceptedTnC] = useState(false);
  const [acceptanceTimestamp, setAcceptanceTimestamp] = useState(null);
  const [errors, setErrors] = useState({});

  const updateConfig = useCallback((field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null }));
  }, []);

  const handleAcceptTnC = useCallback((checked) => {
    setAcceptedTnC(checked);
    setAcceptanceTimestamp(checked ? new Date().toISOString() : null);
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    
    if (config.entryFee && isNaN(Number(config.entryFee))) {
      newErrors.entryFee = 'Must be a valid number';
    }
    if (config.prizeAmount && isNaN(Number(config.prizeAmount))) {
      newErrors.prizeAmount = 'Must be a valid number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && acceptedTnC;
  }, [config, acceptedTnC]);

  return {
    config,
    updateConfig,
    acceptedTnC,
    handleAcceptTnC,
    acceptanceTimestamp,
    errors,
    validate,
    isReady: acceptedTnC && Object.keys(errors).length === 0
  };
}
