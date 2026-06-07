
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MapPin, ShieldAlert, Globe } from 'lucide-react';
import { toast } from 'sonner';

const LocationPrivacyModal = ({ open, onOpenChange, locationData, onSave }) => {
  const [shareLocation, setShareLocation] = useState(locationData?.shared ?? true);
  const [showExact, setShowExact] = useState(locationData?.exact ?? false);
  const [manualOverride, setManualOverride] = useState(locationData?.manual ?? '');

  const handleSave = () => {
    onSave({
      shared: shareLocation,
      exact: showExact,
      manual: manualOverride
    });
    toast.success("Location preferences saved.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-primary" /> Location & Privacy
          </DialogTitle>
          <DialogDescription>
            Manage how your location appears to other players and spectators.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 border border-border/50 rounded-xl">
            <div className="space-y-0.5">
              <Label className="text-base font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-primary" /> Share Location
              </Label>
              <p className="text-xs text-muted-foreground">Display your location flag on your profile and live games.</p>
            </div>
            <Switch checked={shareLocation} onCheckedChange={setShareLocation} className="data-[state=checked]:bg-brand-primary" />
          </div>

          {shareLocation && (
            <>
              <div className="flex items-center justify-between p-4 bg-muted/30 border border-border/50 rounded-xl">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-yellow-500" /> High Accuracy
                  </Label>
                  <p className="text-xs text-muted-foreground">Show exact city vs general region/country.</p>
                </div>
                <Switch checked={showExact} onCheckedChange={setShowExact} className="data-[state=checked]:bg-brand-primary" />
              </div>

              <div className="space-y-3 p-4 bg-muted/30 border border-border/50 rounded-xl">
                <Label className="font-bold">Manual Location Override</Label>
                <p className="text-xs text-muted-foreground">Don't want to use GPS? Type a custom location here.</p>
                <Input 
                  placeholder="e.g., London, UK" 
                  value={manualOverride}
                  onChange={(e) => setManualOverride(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} className="bg-brand-primary text-primary-foreground hover:bg-brand-primary/90">
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPrivacyModal;
