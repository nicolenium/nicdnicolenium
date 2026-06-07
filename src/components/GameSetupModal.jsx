
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { gameRegistry } from '@/utils/GameRegistry.js';

export default function GameSetupModal({ isOpen, onClose, gameId, onStart }) {
  const [difficulty, setDifficulty] = useState('medium');
  const [mode, setMode] = useState('vs_ai');
  const [timeControl, setTimeControl] = useState('10min');

  const gameMeta = gameRegistry.getGame(gameId);

  // CRITICAL: Reset state every time modal opens to prevent caching
  useEffect(() => {
    if (isOpen) {
      setDifficulty('medium');
      setMode('vs_ai');
      setTimeControl('10min');
    }
  }, [isOpen, gameId]);

  const handleStart = () => {
    onStart({
      gameId,
      difficulty,
      mode,
      timeControl
    });
  };

  if (!gameMeta) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-primary">{gameMeta.name} Setup</DialogTitle>
          <DialogDescription>Configure your game settings before starting.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {gameMeta.hasAI && (
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Game Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <Button variant={mode === 'vs_ai' ? 'default' : 'outline'} onClick={() => setMode('vs_ai')} className="font-bold">Vs AI</Button>
                <Button variant={mode === 'local_multiplayer' ? 'default' : 'outline'} onClick={() => setMode('local_multiplayer')} className="font-bold">Local Multiplayer</Button>
              </div>
            </div>
          )}

          {mode === 'vs_ai' && gameMeta.hasAI && (
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">AI Difficulty</label>
              <div className="grid grid-cols-3 gap-3">
                <Button variant={difficulty === 'easy' ? 'default' : 'outline'} onClick={() => setDifficulty('easy')} className="font-bold">Easy</Button>
                <Button variant={difficulty === 'medium' ? 'default' : 'outline'} onClick={() => setDifficulty('medium')} className="font-bold">Medium</Button>
                <Button variant={difficulty === 'hard' ? 'default' : 'outline'} onClick={() => setDifficulty('hard')} className="font-bold">Hard</Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Time Control</label>
            <div className="grid grid-cols-3 gap-3">
              <Button variant={timeControl === '3min' ? 'default' : 'outline'} onClick={() => setTimeControl('3min')} className="font-bold">3 Min</Button>
              <Button variant={timeControl === '10min' ? 'default' : 'outline'} onClick={() => setTimeControl('10min')} className="font-bold">10 Min</Button>
              <Button variant={timeControl === 'unlimited' ? 'default' : 'outline'} onClick={() => setTimeControl('unlimited')} className="font-bold">Unlimited</Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={onClose} className="font-bold">Cancel</Button>
          <Button onClick={handleStart} className="font-bold bg-primary text-primary-foreground shadow-glow-primary px-8">Start Game</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
