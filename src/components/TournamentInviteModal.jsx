
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Search, UserPlus, X, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const TournamentInviteModal = ({ isOpen, onClose, tournament }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [invitedPlayers, setInvitedPlayers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && tournament) {
      fetchInvitedPlayers();
    }
  }, [isOpen, tournament]);

  const fetchInvitedPlayers = async () => {
    try {
      const invites = await pb.collection('tournament_invites').getFullList({
        filter: `tournamentId = "${tournament.id}"`,
        expand: 'invitedUserId',
        $autoCancel: false
      });
      setInvitedPlayers(invites);
    } catch (error) {
      console.error('Error fetching invites:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const users = await pb.collection('users').getFullList({
        filter: `username ~ "${searchQuery}" || email ~ "${searchQuery}"`,
        $autoCancel: false
      });
      // Filter out already invited users and the host
      const filteredUsers = users.filter(u => 
        u.id !== tournament.hostId && 
        !invitedPlayers.some(invite => invite.invitedUserId === u.id)
      );
      setSearchResults(filteredUsers);
    } catch (error) {
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const handleInvite = async (user) => {
    try {
      const inviteCode = 'NICD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      await pb.collection('tournament_invites').create({
        tournamentId: tournament.id,
        invitedUserId: user.id,
        inviteCode,
        status: 'pending'
      }, { $autoCancel: false });
      
      toast.success(`NICD NICOLENIUM invite sent to ${user.username}`);
      setSearchQuery('');
      setSearchResults([]);
      fetchInvitedPlayers();
    } catch (error) {
      toast.error('Failed to send invite');
    }
  };

  const handleRemoveInvite = async (inviteId) => {
    try {
      await pb.collection('tournament_invites').delete(inviteId, { $autoCancel: false });
      toast.success('Invite removed');
      fetchInvitedPlayers();
    } catch (error) {
      toast.error('Failed to remove invite');
    }
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/tournaments/${tournament.id}/join?ref=nicdnicolenium`;
    navigator.clipboard.writeText(`Join the NICD NICOLENIUM tournament: ${link}`);
    setCopied(true);
    toast.success('NICD NICOLENIUM link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Invite Players</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Invite players to {tournament?.name} on NICD NICOLENIUM
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {tournament?.tournament_format === 'Invite-Only' && (
            <div className="bg-muted/50 p-4 rounded-xl border border-border flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <p className="text-sm font-bold text-foreground uppercase tracking-wide">NICD NICOLENIUM Invite Link</p>
                <p className="text-xs text-muted-foreground mt-1">Share this link with players you want to invite.</p>
              </div>
              <Button variant="outline" size="sm" onClick={copyInviteLink} className="shrink-0 w-full sm:w-auto">
                {copied ? <Check className="w-4 h-4 mr-2 text-primary" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied' : 'Copy Link'}
              </Button>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by username or email..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-9 bg-background border-border text-foreground"
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching}>
                Search
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="border border-border rounded-xl overflow-hidden bg-background">
                <Table>
                  <TableBody>
                    {searchResults.map(user => (
                      <TableRow key={user.id} className="border-border">
                        <TableCell className="font-medium text-foreground">{user.username}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="secondary" onClick={() => handleInvite(user)}>
                            <UserPlus className="w-4 h-4 mr-2" /> Invite
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Invited Players ({invitedPlayers.length})</h4>
            <div className="border border-border rounded-xl overflow-hidden bg-background max-h-[200px] overflow-y-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Player</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-right text-muted-foreground">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitedPlayers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                        No players invited yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    invitedPlayers.map(invite => (
                      <TableRow key={invite.id} className="border-border">
                        <TableCell className="font-medium text-foreground">
                          {invite.expand?.invitedUserId?.username || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                            invite.status === 'accepted' ? 'bg-primary/20 text-primary' :
                            invite.status === 'declined' ? 'bg-destructive/20 text-destructive' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {invite.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="icon" variant="ghost" onClick={() => handleRemoveInvite(invite.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <X className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TournamentInviteModal;
