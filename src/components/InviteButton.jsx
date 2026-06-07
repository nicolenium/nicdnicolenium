
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useGameInvitation } from '@/hooks/useGameInvitation.js';
import GameInvitationModal from '@/components/GameInvitationModal.jsx';
import { toast } from 'sonner';

const InviteButton = ({ gameType }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const { createInvitation } = useGameInvitation();
  
  const [isCreating, setIsCreating] = useState(false);
  const [invitation, setInvitation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInvite = async () => {
    if (!isAuthenticated) {
      toast.error('You must log in to invite players to a private match.');
      return;
    }

    setIsCreating(true);
    const record = await createInvitation(gameType, currentUser?.username || 'Player');
    setIsCreating(false);

    if (record) {
      setInvitation(record);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Button 
        onClick={handleInvite} 
        disabled={isCreating}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-black tracking-wide shadow-[0_0_15px_rgba(255,215,0,0.2)] interactive-scale h-10 px-5 rounded-full border border-white/10"
      >
        {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
        <span className="hidden sm:inline">Invite Friend</span>
        <span className="inline sm:hidden">Invite</span>
      </Button>

      {invitation && (
        <GameInvitationModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          invitation={invitation} 
        />
      )}
    </>
  );
};

export default InviteButton;
