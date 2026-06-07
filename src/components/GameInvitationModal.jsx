
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Search, Copy, QrCode, Send, Users } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { QRCodeSVG } from 'qrcode.react';

const GameInvitationModal = ({ isOpen, onClose, gameType, gameName }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [onlinePlayers, setOnlinePlayers] = useState([]);
  const [invitationCode, setInvitationCode] = useState('');
  const [invitationLink, setInvitationLink] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generateInvitationCode();
      fetchOnlinePlayers();
    }
  }, [isOpen]);

  const generateInvitationCode = () => {
    const code = 'NICD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setInvitationCode(code);
    setInvitationLink(`${window.location.origin}/${gameType}/invite/${code}?ref=nicdnicolenium`);
  };

  const fetchOnlinePlayers = async () => {
    try {
      const players = await pb.collection('waiting_players').getFullList({
        filter: 'status = "online"',
        sort: '-created',
        $autoCancel: false
      });
      setOnlinePlayers(players);
    } catch (error) {
      console.error('Error fetching online players:', error);
    }
  };

  const sendInvitation = async (playerId, playerName) => {
    setLoading(true);
    try {
      const currentUser = pb.authStore.model;
      
      await pb.collection('game_invitations').create({
        game_type: gameType,
        inviter_id: currentUser.id,
        inviter_name: currentUser.username || currentUser.name,
        invitation_code: invitationCode,
        status: 'pending',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }, { $autoCancel: false });

      toast.success(`NICD NICOLENIUM Invitation sent to ${playerName}`);
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const copyInvitationLink = () => {
    navigator.clipboard.writeText(`Play on NICD NICOLENIUM: ${invitationLink}`);
    toast.success('NICD NICOLENIUM invitation link copied to clipboard');
  };

  const filteredPlayers = onlinePlayers.filter(player =>
    player.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Invite Player to {gameName}</DialogTitle>
          <DialogDescription>
            Send a NICD NICOLENIUM invitation to play {gameName} with another player
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invitation Code Section */}
          <div className="bg-muted p-4 rounded-lg space-y-3 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase">NICD NICOLENIUM Invite Code</p>
                <p className="text-2xl font-black tracking-wider text-primary">{invitationCode}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQR(!showQR)}
              >
                <QrCode className="w-4 h-4 mr-2" />
                {showQR ? 'Hide' : 'Show'} QR
              </Button>
            </div>

            {showQR && (
              <div className="flex justify-center p-4 bg-white rounded-lg shadow-inner">
                <QRCodeSVG value={invitationLink} size={200} />
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={invitationLink}
                readOnly
                className="flex-1 bg-background text-foreground"
              />
              <Button onClick={copyInvitationLink} variant="secondary">
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>

          {/* Online Players Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Online Players ({onlinePlayers.length})</h3>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background text-foreground border-border"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar">
              {filteredPlayers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No online players found</p>
              ) : (
                filteredPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:border-primary transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={player.avatar ? pb.files.getUrl(player, player.avatar) : undefined} />
                        <AvatarFallback>{player.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{player.username}</p>
                        <p className="text-sm text-muted-foreground">
                          Rating: {player.rating || 1200}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => sendInvitation(player.userId, player.username)}
                      disabled={loading}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Invite
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameInvitationModal;
