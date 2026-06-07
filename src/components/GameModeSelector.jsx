import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Bot, Cpu } from 'lucide-react';

const GameModeSelector = ({ mode, setMode, difficulty, setDifficulty, timeControl, setTimeControl, onStart }) => {
  return (
    <div className="space-y-8 w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={`cursor-pointer transition-all ${mode === 'HvH' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'}`}
          onClick={() => setMode('HvH')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full"><Users className="w-8 h-8 text-primary" /></div>
            <h3 className="font-bold">Human vs Human</h3>
            <p className="text-xs text-muted-foreground">Play locally with a friend</p>
          </CardContent>
        </Card>
        <Card 
          className={`cursor-pointer transition-all ${mode === 'HvAI' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'}`}
          onClick={() => setMode('HvAI')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full"><Bot className="w-8 h-8 text-primary" /></div>
            <h3 className="font-bold">Human vs AI</h3>
            <p className="text-xs text-muted-foreground">Challenge the computer</p>
          </CardContent>
        </Card>
        <Card 
          className={`cursor-pointer transition-all ${mode === 'AIvAI' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'}`}
          onClick={() => setMode('AIvAI')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full"><Cpu className="w-8 h-8 text-primary" /></div>
            <h3 className="font-bold">AI vs AI</h3>
            <p className="text-xs text-muted-foreground">Watch computers play</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card p-6 rounded-xl border">
        {(mode === 'HvAI' || mode === 'AIvAI') && (
          <div className="space-y-2">
            <label className="text-sm font-medium">AI Difficulty</label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="EASY">Easy</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HARD">Hard</SelectItem>
                <SelectItem value="IMPOSSIBLE">Impossible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium">Time Control</label>
          <Select value={timeControl} onValueChange={setTimeControl}>
            <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Limit</SelectItem>
              <SelectItem value="5">5 Minutes</SelectItem>
              <SelectItem value="10">10 Minutes</SelectItem>
              <SelectItem value="15">15 Minutes</SelectItem>
              <SelectItem value="30">30 Minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button size="lg" className="w-full text-lg font-bold h-14" onClick={onStart}>
        Start Game
      </Button>
    </div>
  );
};

export default GameModeSelector;