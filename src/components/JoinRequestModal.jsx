
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMultiplayerMatchmaking } from '@/hooks/useMultiplayerMatchmaking.js';
import { Swords, Check, X, Loader2 } from 'lucide-react';

const JoinRequestModal = () => {
  const { incomingRequests, acceptRequest, declineRequest } = useMultiplayerMatchmaking();
  const [isProcessing, setIsProcessing] = useState(false);

  if (incomingRequests.length === 0) return null;

  const request = incomingRequests[0]; // Show the first pending request

  const handleAccept = async () => {
    setIsProcessing(true);
    await acceptRequest(request);
    setIsProcessing(false);
  };

  const handleDecline = async () => {
    setIsProcessing(true);
    await declineRequest(request);
    setIsProcessing(false);
  };

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md bg-card border-border rounded-2xl shadow-2xl">
        <DialogHeader className="text-center sm:text-left">
          <DialogTitle className="text-2xl font-black flex items-center justify-center sm:justify-start gap-3 uppercase tracking-tight">
            <div className="p-2 bg-primary/20 rounded-full">
              <Swords className="w-6 h-6 text-primary" />
            </div>
            Game Challenge!
          </DialogTitle>
          <DialogDescription className="text-base mt-4 text-muted-foreground font-medium text-center sm:text-left">
            You have been challenged to a match of <span className="font-bold text-foreground capitalize px-2 py-0.5 bg-muted rounded">{request.gameType.replace('_', ' ')}</span>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-4 mt-8">
          <Button 
            onClick={handleDecline} 
            disabled={isProcessing}
            variant="outline" 
            className="flex-1 h-12 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 interactive-scale font-bold tracking-wide"
          >
            <X className="w-5 h-5 mr-2" /> Decline
          </Button>
          <Button 
            onClick={handleAccept} 
            disabled={isProcessing}
            className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground interactive-scale font-bold tracking-wide shadow-lg"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5 mr-2" />} 
            Accept & Play
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinRequestModal;
