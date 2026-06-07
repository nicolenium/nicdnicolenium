
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Loader2, ArrowLeft, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

export const JoinGameFlow = ({ gameType, onCancel, onGameJoined }) => {
  const { currentUser } = useAuth();
  const [code, setCode] = useState('');
  const [playerName, setPlayerName] = useState(currentUser?.username || 'Player 2');
  const [isJoining, setIsJoining] = useState(false);
  const [inviteDetails, setInviteDetails] = useState(null);

  const handleLookup = async () => {
    if (!code.trim()) {
      toast.error('Please enter a game code');
      return;
    }

    setIsJoining(true);
    try {
      // Extract code if it's a full URL
      let cleanCode = code.trim();
      if (cleanCode.includes('/join/')) {
        cleanCode = cleanCode.split('/join/')[1].split('?')[0];
      }

      const records = await pb.collection('game_invites').getFullList({
        filter: `game_code = "${cleanCode.toUpperCase()}" && status = "pending"`,
        $autoCancel: false
      });

      if (records.length === 0) {
        toast.error('Invalid or expired game code.');
        setIsJoining(false);
        return;
      }

      setInviteDetails(records[0]);
    } catch (err) {
      console.error('Lookup failed:', err);
      toast.error('Failed to find game. Please check the code.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleJoin = async () => {
    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsJoining(true);
    try {
      const playerId = currentUser?.id || 'guest_' + Date.now();

      // Update invite status
      await pb.collection('game_invites').update(inviteDetails.id, {
        status: 'accepted',
        opponent_id: playerId,
        opponent_name: playerName
      }, { $autoCancel: false });

      // Add to players
      await pb.collection('game_players').create({
        game_id: inviteDetails.game_id,
        player_id: playerId,
        player_name: playerName,
        player_color: 'black',
        is_creator: false
      }, { $autoCancel: false });

      // Update session status
      const sessions = await pb.collection('game_sessions').getFullList({
        filter: `gameId = "${inviteDetails.game_id}"`,
        $autoCancel: false
      });
      
      if (sessions.length > 0) {
        await pb.collection('game_sessions').update(sessions[0].id, {
          player2Id: playerId,
          status: 'in-progress'
        }, { $autoCancel: false });
      }

      toast.success('Successfully joined game!');
      onGameJoined(inviteDetails.game_id, playerId);

    } catch (err) {
      console.error('Join failed:', err);
      toast.error('Failed to join game. It may have already started.');
    } finally {
      setIsJoining(false);
    }
  };

  if (inviteDetails) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto">
        <Card className="border-2 shadow-xl rounded-2xl overflow-hidden">
          <div className="h-2 w-full bg-secondary" />
          <CardHeader>
            <CardTitle className="text-2xl font-black font-serif">Join Match</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-xl border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Host:</span>
                <span className="font-bold">{inviteDetails.creator_name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time Control:</span>
                <span className="font-bold capitalize">{inviteDetails.game_settings?.timeControl?.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Your Name</Label>
              <Input 
                value={playerName} 
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="h-12 text-lg"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 h-12" onClick={() => setInviteDetails(null)}>Cancel</Button>
              <Button className="flex-1 h-12" onClick={handleJoin} disabled={isJoining}>
                {isJoining ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogIn className="w-4 h-4 mr-2" />}
                Accept & Join
              </Button>
            </div>
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
          <CardTitle className="text-2xl font-black font-serif">Join Online Game</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Game Code or Invite Link</Label>
            <Input 
              value={code} 
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. ABC123XYZ"
              className="h-14 text-xl font-mono tracking-wider uppercase"
            />
          </div>

          <Button 
            className="w-full h-14 text-lg rounded-xl mt-4" 
            onClick={handleLookup}
            disabled={isJoining || !code.trim()}
          >
            {isJoining ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
            Find Game
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
