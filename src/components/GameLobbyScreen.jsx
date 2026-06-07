
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Loader2, Copy, Check, Play, Users, Clock, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

export const GameLobbyScreen = ({ inviteId, gameType, onStartGame, onCancel }) => {
  const [inviteData, setInviteData] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [opponentJoined, setOpponentJoined] = useState(false);

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const record = await pb.collection('game_invites').getOne(inviteId, { $autoCancel: false });
        setInviteData({ ...record, link: `${window.location.origin}/games/${gameType}/join/${record.game_code}` });
        if (record.status === 'accepted' && record.opponent_id) {
          setOpponentJoined(true);
        }
      } catch (err) {
        console.error('Failed to fetch invite:', err);
        toast.error('Failed to load lobby data.');
      }
    };

    fetchInvite();

    const unsubscribe = pb.collection('game_invites').subscribe(inviteId, (e) => {
      setInviteData(prev => ({ ...prev, ...e.record }));
      if (e.record.status === 'accepted' && e.record.opponent_id) {
        setOpponentJoined(true);
        toast.success(`${e.record.opponent_name} joined the game!`);
      }
    });

    return () => {
      pb.collection('game_invites').unsubscribe(inviteId);
    };
  }, [inviteId, gameType]);

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

  if (!inviteData) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const formatTime = (tc) => {
    if (!tc) return 'Unknown';
    if (tc.mode === 'no_limit') return 'No Time Limit';
    if (tc.mode === 'custom') return `Custom: ${tc.minutes}m ${tc.seconds}s`;
    return tc.mode.replace('_', ' ').toUpperCase();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl mx-auto">
      <Card className="border-2 shadow-xl rounded-2xl overflow-hidden">
        <div className="h-2 w-full bg-primary" />
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-black font-serif">Game Lobby</CardTitle>
          <p className="text-muted-foreground">Share this code or link with your opponent.</p>
        </CardHeader>
        <CardContent className="space-y-8 pt-2">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted/50 p-6 rounded-xl border-2 border-dashed text-center space-y-3 flex flex-col justify-center">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Game Code</Label>
              <div className="text-5xl font-black tracking-widest font-mono text-primary">{inviteData.game_code}</div>
              <Button variant="outline" size="sm" className="mt-2 rounded-full mx-auto" onClick={() => copyToClipboard(inviteData.game_code, 'code')}>
                {copiedCode ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copiedCode ? 'Copied!' : 'Copy Code'}
              </Button>
            </div>

            <div className="space-y-4 bg-card border rounded-xl p-6">
              <h3 className="font-bold flex items-center gap-2 border-b pb-2"><Settings2 className="w-4 h-4"/> Match Settings</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4"/> Time Control</span>
                  <span className="font-medium">{formatTime(inviteData.game_settings?.timeControl)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4"/> Host</span>
                  <span className="font-medium">{inviteData.creator_name}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Invite Link</Label>
            <div className="flex gap-2">
              <Input readOnly value={inviteData.link} className="font-mono text-sm bg-muted/50 h-12" />
              <Button variant="secondary" className="shrink-0 h-12 px-6" onClick={() => copyToClipboard(inviteData.link, 'link')}>
                {copiedLink ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />} Copy
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            {opponentJoined ? (
              <div className="space-y-6">
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {inviteData.opponent_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold">{inviteData.opponent_name}</div>
                      <div className="text-xs text-primary font-medium">Ready to play</div>
                    </div>
                  </div>
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <Button size="lg" className="w-full h-16 text-xl font-bold rounded-xl shadow-lg" onClick={() => onStartGame(inviteData.game_id, inviteData.creator_id)}>
                  <Play className="w-6 h-6 mr-2 fill-current" /> Start Game
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground py-8 bg-muted/30 rounded-xl border border-dashed">
                <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                <span className="font-medium text-lg">Waiting for opponent to join...</span>
              </div>
            )}
          </div>

          <Button variant="ghost" className="w-full" onClick={onCancel}>Cancel Game</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
