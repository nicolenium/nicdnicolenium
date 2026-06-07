
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, ShieldCheck } from 'lucide-react';
import { useMicrophone } from '@/contexts/MicrophoneContext.jsx';

const MicrophonePermissionDialog = ({ open, onOpenChange }) => {
  const { requestMicrophonePermission } = useMicrophone();

  const handleAllow = async () => {
    const granted = await requestMicrophonePermission();
    if (granted) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground border-border">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mic className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">Microphone Access</DialogTitle>
          <DialogDescription className="text-center">
            NICD Productions needs access to your microphone for live voice chat during games. We do not record audio unless explicitly requested.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted p-4 rounded-lg flex items-start gap-3 my-4">
          <ShieldCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            You can revoke this permission at any time in your browser settings or within the in-game settings panel.
          </p>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Not Now
          </Button>
          <Button onClick={handleAllow} className="w-full sm:w-auto">
            Allow Access
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MicrophonePermissionDialog;
