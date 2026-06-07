
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultSetupData = {
  difficulty: 'medium',
  mode: 'human_vs_computer',
  timeLimit: '600',
  timeControlType: 'rapid_10min',
  customTime: '',
  playerName: 'Player 1',
  opponent: 'AI PRO',
  rulesConfirmed: true
};

export function useGameStartFlow(gameType) {
  const navigate = useNavigate();

  // CRITICAL FIX: Always default to 'setup' to ensure the modal shows
  // on every game launch, removing any bypass logic.
  const [flowState, setFlowState] = useState('setup'); 
  const [gameSetupData, setGameSetupData] = useState(null);

  const initiateFlow = useCallback(() => {
    setFlowState('setup');
    setGameSetupData(null);
  }, []);

  const handleTermsAccept = useCallback(() => {
    setFlowState('playing');
  }, []);

  const handleTermsDecline = useCallback(() => {
    navigate('/games');
  }, [navigate]);

  const handleSetupComplete = useCallback((settings) => {
    setGameSetupData(settings || defaultSetupData);
    setFlowState('playing');
  }, []);

  const handleSetupCancel = useCallback(() => {
    navigate('/games');
  }, [navigate]);

  return {
    flowState,
    gameSetupData,
    initiateFlow,
    handleTermsAccept,
    handleTermsDecline,
    handleSetupComplete,
    handleSetupCancel
  };
}
