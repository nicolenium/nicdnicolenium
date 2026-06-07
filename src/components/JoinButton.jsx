
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users } from 'lucide-react';
import WaitingPlayersList from '@/components/WaitingPlayersList.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const JoinButton = ({ gameType }) => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.error('You must log in to join multiplayer games.');
      return;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          onClick={handleOpen}
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-black tracking-wide shadow-md interactive-scale h-10 px-5 rounded-full border border-white/10"
        >
          <Users className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Find Match</span>
          <span className="inline sm:hidden">Find</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Available Players
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <WaitingPlayersList gameType={gameType} onChallengeSent={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinButton;
