
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Gamepad2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import TermsAndConditionsModal from './TermsAndConditionsModal.jsx';

export default function CombinedGameSetupModal({ isOpen, onClose, onGameStart, gameType, game }) {
  const [mode, setMode] = useState('human_vs_computer');
  const [difficulty, setDifficulty] = useState('medium');
  const [timeLimit, setTimeLimit] = useState('600');
  const [playerName, setPlayerName] = useState('Player 1');
  
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleStart = () => {
    onGameStart({
      mode,
      difficulty,
      timeLimit: parseInt(timeLimit, 10),
      players: {
        p1Name: playerName,
        p1Color: 'white',
        p2Name: mode === 'human_vs_computer' ? 'AI PRO' : 'Player 2',
        p2Color: 'black'
      },
      match: {
        mode,
        difficulty,
        timeControl: parseInt(timeLimit, 10)
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-primary" /> 
            {game?.name || 'Game Setup'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-muted-foreground">Player Name</Label>
            <Input 
              value={playerName} 
              onChange={(e) => setPlayerName(e.target.value)}
              className="h-12 border-2 rounded-xl font-bold"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-muted-foreground">Game Mode</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="h-12 border-2 rounded-xl font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="human_vs_computer">Player vs AI</SelectItem>
                <SelectItem value="human_vs_human">Local Multiplayer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode === 'human_vs_computer' && (
            <div className="space-y-2">
              <Label className="text-sm font-bold text-muted-foreground">AI Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="h-12 border-2 rounded-xl font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy (500ms limit)</SelectItem>
                  <SelectItem value="medium">Medium (1s limit)</SelectItem>
                  <SelectItem value="hard">Hard (2s limit)</SelectItem>
                  <SelectItem value="expert">Expert (3s limit)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-bold text-muted-foreground">Time Control</Label>
            <Select value={timeLimit} onValueChange={setTimeLimit}>
              <SelectTrigger className="h-12 border-2 rounded-xl font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="300">5 Minutes (Blitz)</SelectItem>
                <SelectItem value="600">10 Minutes (Rapid)</SelectItem>
                <SelectItem value="1800">30 Minutes (Classical)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted/50 p-4 rounded-xl border border-border">
            <div className="flex items-center space-x-3 mb-2">
              <Checkbox 
                id="terms" 
                checked={termsAccepted} 
                onCheckedChange={setTermsAccepted} 
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="terms" className="text-sm font-medium cursor-pointer flex-1">
                I accept the <button type="button" onClick={() => setShowTerms(true)} className="text-primary font-bold hover:underline">Terms & Conditions</button>
              </Label>
            </div>
          </div>

          <Button 
            className="w-full h-14 text-lg font-black rounded-xl shadow-glow-primary disabled:opacity-50" 
            onClick={handleStart}
            disabled={!termsAccepted || !playerName.trim()}
          >
            Start Game
          </Button>
        </div>
      </DialogContent>

      <TermsAndConditionsModal 
        isOpen={showTerms} 
        onClose={() => setShowTerms(false)} 
        onAccept={() => {
          setTermsAccepted(true);
          setShowTerms(false);
        }} 
      />
    </Dialog>
  );
}
