import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameSetupLayout from '@/components/GameSetupLayout.jsx';

export default function ChessSetupPage() {
  const navigate = useNavigate();

  const handleStart = (settings) => {
    navigate('/chess-game', { state: { settings } });
  };

  const specificRules = [
    { id: 'allowCastling', label: 'Allow Castling', description: 'Standard king/rook maneuver.', default: true },
    { id: 'allowEnPassant', label: 'Allow En Passant', description: 'Standard pawn capture rule.', default: true },
    { id: 'autoQueen', label: 'Auto Promote to Queen', description: 'Skips promotion menu.', default: false },
    { id: 'fiftyMoveRule', label: '50-Move Draw Rule', description: 'Draw after 50 moves without capture/pawn push.', default: true }
  ];

  return (
    <GameSetupLayout 
      gameName="Chess" 
      gameType="chess" 
      specificRules={specificRules}
      onStart={handleStart} 
    />
  );
}