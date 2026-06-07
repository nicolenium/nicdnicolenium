
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, X, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

const InvitationNotifications = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const fetchInvitations = async () => {
      try {
        const records = await pb.collection('game_invites').getFullList({
          filter: `opponent_id = "${currentUser.id}" && status = "pending"`,
          sort: '-created',
          $autoCancel: false
        });
        setInvitations(records);
      } catch (err) {
        console.error('Failed to fetch invitations:', err);
      }
    };

    fetchInvitations();

    // Subscribe to real-time updates
    pb.collection('game_invites').subscribe('*', function (e) {
      if (e.action === 'create' && e.record.opponent_id === currentUser.id && e.record.status === 'pending') {
        setInvitations(prev => [e.record, ...prev]);
        toast('New Game Invitation!', {
          description: `${e.record.creator_name} invited you to play.`,
          icon: <Gamepad2 className="w-4 h-4" />
        });
      } else if (e.action === 'update' || e.action === 'delete') {
        setInvitations(prev => prev.filter(inv => inv.id !== e.record.id || (e.record.status === 'pending' && e.action !== 'delete')));
      }
    });

    return () => {
      pb.collection('game_invites').unsubscribe('*');
    };
  }, [currentUser]);

  const handleAccept = async (invitation) => {
    try {
      await pb.collection('game_invites').update(invitation.id, { status: 'accepted' }, { $autoCancel: false });
      toast.success('Invitation accepted!');
      setIsOpen(false);
      // Navigate to game room or setup
      navigate(`/game-room?code=${invitation.game_code}`);
    } catch (err) {
      toast.error('Failed to accept invitation.');
    }
  };

  const handleDecline = async (invitation) => {
    try {
      await pb.collection('game_invites').update(invitation.id, { status: 'declined' }, { $autoCancel: false });
      toast.info('Invitation declined.');
    } catch (err) {
      toast.error('Failed to decline invitation.');
    }
  };

  if (!currentUser) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="w-5 h-5" />
          {invitations.length > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 min-w-[20px] h-5 flex items-center justify-center bg-destructive text-destructive-foreground rounded-full text-[10px]">
              {invitations.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b bg-muted/50">
          <h4 className="font-bold flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" /> Game Invitations
          </h4>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {invitations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No pending invitations.
            </div>
          ) : (
            <div className="flex flex-col">
              {invitations.map(inv => (
                <div key={inv.id} className="p-4 border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <p className="text-sm mb-3">
                    <span className="font-bold text-foreground">{inv.creator_name}</span> invited you to a game.
                    <br/>
                    <span className="text-xs text-muted-foreground">Code: {inv.game_code}</span>
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 h-8" onClick={() => handleAccept(inv)}>
                      <Check className="w-4 h-4 mr-1" /> Accept
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 h-8" onClick={() => handleDecline(inv)}>
                      <X className="w-4 h-4 mr-1" /> Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InvitationNotifications;
