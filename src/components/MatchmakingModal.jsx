
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Loader2, UserPlus, Globe, Search, Clock } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { useNavigate } from 'react-router-dom';

const MatchmakingModal = ({ open, onOpenChange, gameId, setupData }) => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(true);
  const [opponents, setOpponents] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    let timer;
    if (open) {
      setIsSearching(true);
      setTimeLeft(30);
      
      // Simulate finding opponents
      setTimeout(() => {
        setOpponents([
          { id: '1', username: 'ChessMaster99', rating: 1450, location: 'New York, USA', difficulty: 'Hard' },
          { id: '2', username: 'LudoKing', rating: 1200, location: 'London, UK', difficulty: 'Medium' }
        ]);
        setIsSearching(false);
      }, 3000);

      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsSearching(false);
            if (opponents.length === 0) {
              toast.error("No opponents found in time. Try playing against AI.");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [open, gameId]);

  const handleInvite = (opponent) => {
    toast.success(`Invitation sent to ${opponent.username}!`);
    setTimeout(() => {
      onOpenChange(false);
      navigate(`/games/${gameId}/play`, { state: { ...setupData, opponent: opponent.username, mode: 'MULTIPLAYER' } });
    }, 1500);
  };

  const handleCreatePublic = () => {
    toast.success("Public lobby created! Waiting for players...");
    setTimeout(() => {
      onOpenChange(false);
      navigate(`/games/${gameId}/play`, { state: { ...setupData, opponent: 'Waiting...', mode: 'MULTIPLAYER_HOST' } });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Find Opponent</DialogTitle>
          <DialogDescription>Matchmaking for {gameId.replace('_', ' ')}</DialogDescription>
        </DialogHeader>

        <div className="py-6 min-h-[300px] flex flex-col">
          {isSearching ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                <Search className="w-12 h-12 text-primary opacity-50" />
              </motion.div>
              <h3 className="text-xl font-bold">Scanning Lobbies...</h3>
              <p className="text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" /> {timeLeft}s remaining
              </p>
            </div>
          ) : opponents.length > 0 ? (
            <div className="space-y-4 flex-1">
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Available Players</h4>
              {opponents.map((opp) => (
                <div key={opp.id} className="flex items-center justify-between p-4 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div>
                    <h5 className="font-bold text-lg">{opp.username}</h5>
                    <p className="text-sm text-muted-foreground flex gap-3">
                      <span>Rating: {opp.rating}</span>
                      <span>{opp.location}</span>
                    </p>
                  </div>
                  <Button onClick={() => handleInvite(opp)} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <UserPlus className="w-4 h-4 mr-2" /> Invite
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
              <Globe className="w-12 h-12 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-bold">No Players Available</h3>
              <p className="text-muted-foreground">There are currently no active players matching your criteria.</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t flex justify-between items-center">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleCreatePublic} className="rounded-full">
              <Globe className="w-4 h-4 mr-2" /> Create Public Match
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchmakingModal;
