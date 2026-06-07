
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import TimeControlSelector from '@/components/TimeControlSelector.jsx';

export const OnlineGameSettingsScreen = ({ gameType, onCancel, onGameCreated }) => {
  const { currentUser } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [timeError, setTimeError] = useState(null);

  const [settings, setSettings] = useState({
    playerName: currentUser?.username || 'Player 1',
    timeControl: { mode: 'rapid_10min', minutes: 10, seconds: 0, totalSeconds: 600 },
    movementSpeed: 'normal',
    boardColor: 'classic'
  });

  const handleCreate = async () => {
    if (!settings.playerName.trim()) {
      toast.error('Please enter a player name');
      return;
    }
    if (timeError) {
      toast.error(timeError);
      return;
    }

    setIsCreating(true);
    try {
      const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const gameId = `${gameType}-${Date.now()}`;
      
      const invite = await pb.collection('game_invites').create({
        game_id: gameId,
        game_code: gameCode,
        creator_id: currentUser?.id || 'guest_' + Date.now(),
        creator_name: settings.playerName,
        status: 'pending',
        game_settings: settings,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }, { $autoCancel: false });

      await pb.collection('game_sessions').create({
        gameId: gameId,
        gameType: gameType,
        mode: 'online_multiplayer',
        player1Id: invite.creator_id,
        status: 'waiting',
        timeControl: settings.timeControl.mode,
        timeLimit: settings.timeControl.totalSeconds,
        public_mode: false
      }, { $autoCancel: false });

      await pb.collection('game_players').create({
        game_id: gameId,
        player_id: invite.creator_id,
        player_name: settings.playerName,
        player_color: 'white',
        is_creator: true
      }, { $autoCancel: false });

      onGameCreated(invite);
      
    } catch (err) {
      console.error('Failed to create invite:', err);
      toast.error('Failed to create game room. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto">
      <Button variant="ghost" onClick={onCancel} className="mb-4 -ml-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      <Card className="border-2 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-black font-serif">Host Online Game</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Your Name</Label>
            <Input 
              value={settings.playerName} 
              onChange={(e) => setSettings({...settings, playerName: e.target.value})}
              placeholder="Enter your name"
              className="h-12 text-lg"
            />
          </div>
          
          <TimeControlSelector 
            value={settings.timeControl} 
            onChange={(tc) => setSettings({...settings, timeControl: tc})}
            onError={setTimeError}
          />

          <div className="space-y-2">
            <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Movement Speed</Label>
            <Select value={settings.movementSpeed} onValueChange={(v) => setSettings({...settings, movementSpeed: v})}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">Slow</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="fast">Fast</SelectItem>
                <SelectItem value="instant">Instant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full h-14 text-lg rounded-xl mt-4" 
            onClick={handleCreate}
            disabled={isCreating || !!timeError || !settings.playerName.trim()}
          >
            {isCreating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
            {isCreating ? 'Creating Room...' : 'Create Game Room'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
