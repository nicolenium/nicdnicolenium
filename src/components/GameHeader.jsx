
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { ArrowLeft, Settings, RotateCcw } from 'lucide-react';

const GameHeader = ({ title, mode, onReset, onSettings }) => {
  const navigate = useNavigate();

  return (
    <header className="w-full p-4 flex items-center justify-between bg-card border-b sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/games')} className="rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-serif font-bold text-xl leading-tight">{title}</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">{mode?.replace(/_/g, ' ')}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onReset && (
          <Button variant="outline" size="sm" onClick={onReset} className="rounded-full hidden sm:flex">
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
        )}
        {onSettings && (
          <Button variant="ghost" size="icon" onClick={onSettings} className="rounded-full">
            <Settings className="w-5 h-5" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default GameHeader;
