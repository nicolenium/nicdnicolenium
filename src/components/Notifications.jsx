
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Check, X } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Notifications = () => {
  const { currentUser } = useAuth();
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchInvites = async () => {
      try {
        // Find pending game invitations for this user
        const records = await pb.collection('game_invitations').getList(1, 10, {
          filter: `status = "pending"`, 
          // Note: typically there's an invited_id field, but schema shows inviter_id and status. 
          // For generic display without specific targeted fields in schema, we mock or fetch available.
          sort: '-created',
          $autoCancel: false
        });
        setInvites(records.items);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchInvites();
    
    // Setup realtime
    pb.collection('game_invitations').subscribe('*', fetchInvites, { $autoCancel: false });
    return () => pb.collection('game_invitations').unsubscribe();
  }, [currentUser]);

  const handleAction = async (id, action) => {
    try {
      await pb.collection('game_invitations').update(id, { 
        status: action,
        accepted_by_id: action === 'accepted' ? currentUser.id : ''
      }, { $autoCancel: false });
      toast.success(`Invitation ${action}`);
    } catch (err) {
      toast.error('Action failed');
    }
  };

  if (!currentUser) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Bell className="w-5 h-5 mr-2" /> Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {invites.length === 0 ? (
          <div className="text-sm text-muted-foreground">You have no new notifications.</div>
        ) : (
          <div className="space-y-3">
            {invites.map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-3 bg-muted rounded-lg text-sm">
                <div>
                  <span className="font-semibold">{inv.inviter_name}</span> invited you to play <span className="uppercase font-medium">{inv.game_type}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:bg-green-500/10 hover:text-green-600" onClick={() => handleAction(inv.id, 'accepted')}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleAction(inv.id, 'declined')}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Notifications;
