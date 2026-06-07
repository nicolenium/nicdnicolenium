
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Undo, Menu, Maximize, Shield } from 'lucide-react';

const GameControls = ({ onReset, onUndo, onMenu, onFullscreen, onPrivacy }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 p-4 bg-card border border-border rounded-xl shadow-glow-cyan">
      <Button variant="outline" onClick={onReset} className="border-border hover:bg-border/20">
        <RotateCcw className="w-4 h-4 mr-2" /> Reset
      </Button>
      <Button variant="outline" onClick={onUndo} className="border-border hover:bg-border/20">
        <Undo className="w-4 h-4 mr-2" /> Undo
      </Button>
      <Button variant="outline" onClick={onMenu} className="border-border hover:bg-border/20">
        <Menu className="w-4 h-4 mr-2" /> Menu
      </Button>
      <Button variant="outline" onClick={onFullscreen} className="border-border hover:bg-border/20">
        <Maximize className="w-4 h-4 mr-2" /> Fullscreen
      </Button>
      <Button variant="outline" onClick={onPrivacy} className="border-border hover:bg-border/20">
        <Shield className="w-4 h-4 mr-2" /> Privacy
      </Button>
    </div>
  );
};

export default GameControls;
