
import React from 'react';
import { ShieldAlert, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils.js';

export function VisitorPlayCounter({ remainingPlays, gameId }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-card border border-border shadow-sm rounded-full z-40">
      <div className={cn(
        "flex items-center gap-1.5 font-bold text-sm",
        remainingPlays > 0 ? "text-primary" : "text-destructive"
      )}>
        {remainingPlays > 0 ? <Zap className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
        <span>Guest Plays: {remainingPlays}/2</span>
      </div>
      
      {remainingPlays <= 0 && (
        <Button 
          size="sm" 
          onClick={() => navigate('/signup')} 
          className="h-8 rounded-full text-xs font-bold shadow-glow-primary ml-2"
        >
          Unlock Unlimited
        </Button>
      )}
    </div>
  );
}

export function VisitorRegistrationModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card w-full max-w-md p-8 rounded-3xl shadow-2xl border-2 border-border text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-black text-foreground mb-4 tracking-tight">Play Limit Reached!</h2>
        <p className="text-muted-foreground font-medium mb-8">
          You've used your 2 free guest plays for this game. Create a free account to unlock unlimited access, track your progress, and compete on global leaderboards.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button variant="outline" onClick={onClose} className="flex-1 h-12 font-bold rounded-xl border-2">
            Maybe Later
          </Button>
          <Button onClick={() => navigate('/signup')} className="flex-1 h-12 font-bold rounded-xl shadow-glow-primary">
            Create Free Account
          </Button>
        </div>
      </div>
    </div>
  );
}
