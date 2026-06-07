
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Loader2, Copy, Check, Share2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

export const CreateGameInviteFlow = ({ gameType, onCancel, onGameCreated }) => {
  const { currentUser } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [inviteData, setInviteData] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [settings, setSettings] = useState({
    playerName: currentUser?.username || 'Player 1',
    timeControl: 'rapid_10min',
    movementSpeed: 'normal'
  });

  const handleCreate = async () => {
    if (!settings.playerName.trim()) {
      toast.error('Please enter a player name');
      return;
    }

    setIsCreating(true);
    try {
      const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const gameId = `${gameType}-${Date.now()}`;
      
      // Create invite record
      const invite = await pb.collection('game_invites').create({
        game_id: gameId,
        game_code: gameCode,
        creator_id: currentUser?.id || 'guest_' + Date.now(),
        creator_name: settings.playerName,
        status: 'pending',
        game_settings: settings,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      }, { $autoCancel: false });

      // Create initial session
      await pb.collection('game_sessions').create({
        gameId: gameId,
        gameType: gameType,
        mode: 'online_multiplayer',
        player1Id: invite.creator_id,
        status: 'waiting',
        timeControl: settings.timeControl,
        public_mode: false
      }, { $autoCancel: false });

      // Add creator to players
      await pb.collection('game_players').create({
        game_id: gameId,
        player_id: invite.creator_id,
        player_name: settings.playerName,
        player_color: 'white',
        is_creator: true
      }, { $autoCancel: false });

      setInviteData({ ...invite, link: `${window.location.origin}/games/${gameType}/join/${gameCode}` });
      onGameCreated(gameId, invite.creator_id);
      
    } catch (err) {
      console.error('Failed to create invite:', err);
      toast.error('Failed to create game room. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
    toast.success(`${type === 'code' ? 'Game code' : 'Invite link'} copied!`);
  };

  if (inviteData) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto">
        <Card className="border-2 shadow-xl rounded-2xl overflow-hidden">
          <div className="h-2 w-full bg-primary" />
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-black font-serif">Game Room Created</CardTitle>
            <p className="text-muted-foreground">Share this code or link with your opponent.</p>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            
            <div className="bg-muted/50 p-6 rounded-xl border-2 border-dashed text-center space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Game Code</Label>
              <div className="text-4xl font-black tracking-widest font-mono text-primary">{inviteData.game_code}</div>
              <Button variant="outline" size="sm" className="mt-2 rounded-full" onClick={() => copyToClipboard(inviteData.game_code, 'code')}>
                {copiedCode ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copiedCode ? 'Copied!' : 'Copy Code'}
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Invite Link</Label>
              <div className="flex gap-2">
                <Input readOnly value={inviteData.link} className="font-mono text-sm bg-muted/50" />
                <Button variant="secondary" className="shrink-0" onClick={() => copyToClipboard(inviteData.link, 'link')}>
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 text-muted-foreground py-4">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="font-medium">Waiting for opponent to join...</span>
            </div>

            <Button variant="ghost" className="w-full" onClick={onCancel}>Cancel Game</Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto">
      <Button variant="ghost" onClick={onCancel} className="mb-4 -ml-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      <Card className="border-2 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-black font-serif">Host Online Game</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Your Name</Label>
            <Input 
              value={settings.playerName} 
              onChange={(e) => setSettings({...settings, playerName: e.target.value})}
              placeholder="Enter your name"
              className="h-12 text-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Time Control</Label>
            <Select value={settings.timeControl} onValueChange={(v) => setSettings({...settings, timeControl: v})}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select time control" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_limit">No Time Limit</SelectItem>
                <SelectItem value="rapid_10min">Rapid (10 min)</SelectItem>
                <SelectItem value="blitz_5min">Blitz (5 min)</SelectItem>
                <SelectItem value="bullet_3min">Bullet (3 min)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full h-14 text-lg rounded-xl mt-4" 
            onClick={handleCreate}
            disabled={isCreating}
          >
            {isCreating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
            {isCreating ? 'Creating Room...' : 'Create Game Room'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
