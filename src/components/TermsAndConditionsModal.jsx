
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';

export default function TermsAndConditionsModal({ isOpen, onClose, onAccept }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col bg-card border-border rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-foreground">Terms and Conditions</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Please read and accept the terms to proceed to the game.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 p-6 border border-border rounded-xl bg-muted/30 mt-2">
          <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
            <section>
              <h3 className="text-lg font-bold text-foreground mb-2">1. Acceptance of Terms</h3>
              <p>By accessing and playing games on NICOLENIUM, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you are prohibited from using the platform.</p>
            </section>
            
            <section>
              <h3 className="text-lg font-bold text-foreground mb-2">2. Fair Play Policy</h3>
              <p>Players are expected to compete fairly. The use of external assistance, unauthorized bots, or exploiting bugs to gain an unfair advantage is strictly prohibited and may result in account suspension.</p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-foreground mb-2">3. User Conduct</h3>
              <p>Respectful behavior is required in all interactions, including game chat and community forums. Harassment, hate speech, and inappropriate content will not be tolerated.</p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-foreground mb-2">4. Data and Privacy</h3>
              <p>Your gameplay data, including move history and statistics, may be recorded for analytical and matchmaking purposes. Please refer to our Privacy Policy for detailed information on data handling.</p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-foreground mb-2">5. Modifications</h3>
              <p>NICOLENIUM reserves the right to modify these terms at any time. Continued use of the platform constitutes acceptance of the revised terms.</p>
            </section>
          </div>
        </ScrollArea>
        <DialogFooter className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="font-bold rounded-xl">
            Decline
          </Button>
          <Button onClick={() => { onAccept(); onClose(); }} className="font-bold rounded-xl shadow-glow-primary">
            I Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
