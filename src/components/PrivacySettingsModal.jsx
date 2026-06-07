
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Globe, Lock, Users } from 'lucide-react';

const PrivacySettingsModal = ({ open, onOpenChange, privacyLevel, onPrivacyChange }) => {
  const [selected, setSelected] = useState(privacyLevel || 'public');

  useEffect(() => {
    if (open) {
      setSelected(privacyLevel || 'public');
    }
  }, [open, privacyLevel]);

  const handleSave = () => {
    if (onPrivacyChange) {
      onPrivacyChange(selected);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Game Privacy Settings</DialogTitle>
          <DialogDescription>
            Choose who can spectate or interact with your game session.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={selected} onValueChange={setSelected} className="flex flex-col gap-3">
            <Label className="flex items-start space-x-3 space-y-0 rounded-xl border p-4 cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
              <RadioGroupItem value="public" className="mt-1" />
              <div className="flex-1">
                <p className="flex items-center font-bold text-foreground">
                  <Globe className="w-4 h-4 mr-2 text-green-500" /> Public
                </p>
                <p className="text-sm text-muted-foreground mt-1">Anyone can view this game session.</p>
              </div>
            </Label>
            
            <Label className="flex items-start space-x-3 space-y-0 rounded-xl border p-4 cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
              <RadioGroupItem value="friends_only" className="mt-1" />
              <div className="flex-1">
                <p className="flex items-center font-bold text-foreground">
                  <Users className="w-4 h-4 mr-2 text-blue-500" /> Friends Only
                </p>
                <p className="text-sm text-muted-foreground mt-1">Only players on your friends list can watch.</p>
              </div>
            </Label>
            
            <Label className="flex items-start space-x-3 space-y-0 rounded-xl border p-4 cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
              <RadioGroupItem value="private" className="mt-1" />
              <div className="flex-1">
                <p className="flex items-center font-bold text-foreground">
                  <Lock className="w-4 h-4 mr-2 text-red-500" /> Private
                </p>
                <p className="text-sm text-muted-foreground mt-1">No one can view this session except you.</p>
              </div>
            </Label>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacySettingsModal;
