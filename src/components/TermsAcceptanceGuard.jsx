
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import { Label } from '@/components/ui/label.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';
import { toast } from 'sonner';

export default function TermsAcceptanceGuard({ children }) {
  const { currentUser, isAuthenticated } = useAuth();
  const [hasAccepted, setHasAccepted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptedCheckbox, setAcceptedCheckbox] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const checkTerms = async () => {
      if (!isAuthenticated || !currentUser) {
        if (isMounted) {
          setHasAccepted(true); // Guests bypass terms check for now
          setIsLoading(false);
        }
        return;
      }

      try {
        const records = await pb.collection('terms_and_conditions_acceptance').getList(1, 1, {
          filter: `userId = "${currentUser.id}"`,
          $autoCancel: false
        });
        
        if (isMounted) {
          if (records.items.length === 0) {
            setHasAccepted(false);
          } else {
            setHasAccepted(true);
          }
        }
      } catch (e) {
        console.error("Failed to check terms acceptance:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkTerms();
    return () => { isMounted = false; };
  }, [isAuthenticated, currentUser]);

  const handleAccept = async () => {
    if (!acceptedCheckbox) {
      toast.error("Please check the box to accept the terms.");
      return;
    }

    try {
      await pb.collection('terms_and_conditions_acceptance').create({
        userId: currentUser.id,
      }, { $autoCancel: false });
      
      setHasAccepted(true);
      toast.success("Terms accepted. Welcome to NICD NICOLENIUM!");
    } catch (e) {
      console.error("Failed to save terms acceptance:", e);
      toast.error("An error occurred. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading verification...</div>;
  }

  if (!hasAccepted) {
    return (
      <div className="relative min-h-screen bg-background">
        {/* Render children underneath but obfuscated and unclickable */}
        <div className="opacity-20 pointer-events-none blur-sm select-none">
          {children}
        </div>
        
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent className="max-w-3xl" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-primary">Action Required: Terms & Conditions</DialogTitle>
              <DialogDescription className="text-base">
                You must accept our Terms and Conditions before playing any games on the platform.
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="h-[40vh] bg-muted/30 p-4 rounded-xl border border-border mt-4 mb-4 text-sm leading-relaxed text-muted-foreground">
              <h3 className="font-bold text-foreground mb-2">1. Fair Play Policy</h3>
              <p className="mb-4">Players must not use external assistance, cheating software, or exploit game bugs. Violators will be permanently banned.</p>
              
              <h3 className="font-bold text-foreground mb-2">2. Respectful Conduct</h3>
              <p className="mb-4">Harassment, hate speech, and abusive language in multiplayer chats or forums are strictly prohibited.</p>
              
              <h3 className="font-bold text-foreground mb-2">3. Account Integrity</h3>
              <p className="mb-4">You are responsible for maintaining the confidentiality of your account credentials. Sharing accounts is discouraged.</p>
              
              <h3 className="font-bold text-foreground mb-2">4. Data & Privacy</h3>
              <p className="mb-4">We collect gameplay statistics and preferences to improve your experience. View our full Privacy Policy for details.</p>
              
              <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">
                Read full Terms and Conditions in a new tab
              </a>
            </ScrollArea>

            <div className="flex items-center space-x-3 mb-6 bg-secondary/20 p-4 rounded-xl">
              <Checkbox 
                id="terms" 
                checked={acceptedCheckbox} 
                onCheckedChange={setAcceptedCheckbox}
                className="w-6 h-6"
              />
              <Label htmlFor="terms" className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                I have read and agree to the NICD NICOLENIUM Terms and Conditions
              </Label>
            </div>

            <DialogFooter>
              <Button onClick={handleAccept} size="lg" disabled={!acceptedCheckbox} className="w-full sm:w-auto px-12 font-bold text-lg">
                Accept & Continue Playing
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return children;
}
