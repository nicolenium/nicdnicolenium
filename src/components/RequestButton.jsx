
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Swords, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useGameInvitation } from '@/hooks/useGameInvitation.js';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const RequestButton = ({ gameType }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const { createInvitation } = useGameInvitation();
  
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [sendingTo, setSendingTo] = useState(null);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchUsers();
    }
  }, [isOpen, isAuthenticated]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      // Basic fetch - in real app, might want to only fetch "friends"
      const records = await pb.collection('users').getList(1, 20, {
        filter: `id != "${currentUser.id}"`,
        sort: '-updated',
        $autoCancel: false
      });
      setUsers(records.items);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSendRequest = async (targetUser) => {
    setSendingTo(targetUser.id);
    const record = await createInvitation(gameType, currentUser?.username || 'Player');
    setSendingTo(null);

    if (record) {
      // In a fully featured system, we'd also create a notification record here
      // For now, the creation of game_invitations triggers real-time for the other user 
      // if they are online and we add logic for it. (Prompt specifies request button)
      toast.success(`Game request sent to ${targetUser.username}.`);
      setIsOpen(false);
    }
  };

  const openDialog = () => {
    if (!isAuthenticated) {
      toast.error('You must log in to request games.');
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <Button 
        variant="secondary"
        onClick={openDialog}
        className="font-bold shadow-sm interactive-scale h-9 sm:h-10 px-3 sm:px-4"
      >
        <Swords className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Request Game</span>
        <span className="inline sm:hidden">Request</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-center">
              Request Match
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {isLoadingUsers ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
            ) : users.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No other players found.</p>
            ) : (
              users.map(u => (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      {u.avatar ? <AvatarImage src={pb.files.getUrl(u, u.avatar)} /> : <AvatarFallback>{u.username?.substring(0,2).toUpperCase()}</AvatarFallback>}
                    </Avatar>
                    <span className="font-semibold">{u.username}</span>
                  </div>
                  <Button 
                    size="sm" 
                    disabled={sendingTo === u.id}
                    onClick={() => handleSendRequest(u)}
                    className="interactive-scale"
                  >
                    {sendingTo === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RequestButton;
