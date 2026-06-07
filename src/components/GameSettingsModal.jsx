
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { useUserSettings } from '@/hooks/useUserSettings.js';
import { useTimeControl } from '@/contexts/TimeControlContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';
import { X, Save, AlertCircle } from 'lucide-react';

const TIME_OPTIONS = [
  { value: 'no_limit', label: 'No Limit' },
  { value: 'rapid_10min', label: 'Rapid (10 min)' },
  { value: 'blitz_5min', label: 'Blitz (5 min)' },
  { value: 'bullet_3min', label: 'Bullet (3 min)' },
  { value: 'bullet_1min', label: 'Bullet (1 min)' },
  { value: 'custom', label: 'Custom Time' }
];

const GameSettingsModal = ({ open, onOpenChange }) => {
  const { settings, updateSettings, loading } = useUserSettings();
  const { timeSettings, updateTimeSettings } = useTimeControl();
  
  const [localTimeControl, setLocalTimeControl] = useState('rapid_10min');
  const [customTimeMinutes, setCustomTimeMinutes] = useState(10);
  const [customTimeSeconds, setCustomTimeSeconds] = useState(0);
  const [timeError, setTimeError] = useState('');

  useEffect(() => {
    if (open && timeSettings) {
      setLocalTimeControl(timeSettings.timeControlType || 'rapid_10min');
      setCustomTimeMinutes(timeSettings.customTimeMinutes ?? 10);
      setCustomTimeSeconds(timeSettings.customTimeSeconds ?? 0);
      setTimeError('');
    }
  }, [open, timeSettings]);

  if (loading || !settings) return null;

  const validateCustomTime = () => {
    const m = parseInt(customTimeMinutes) || 0;
    const s = parseInt(customTimeSeconds) || 0;
    
    if (m < 0 || m > 999) return 'Minutes must be between 0 and 999.';
    if (s < 0 || s > 59) return 'Seconds must be between 0 and 59.';
    if (m === 0 && s === 0) return 'Total time must be at least 1 second.';
    
    return '';
  };

  const handleSaveTimeSettings = async () => {
    if (localTimeControl === 'custom') {
      const error = validateCustomTime();
      if (error) {
        setTimeError(error);
        toast.error(error);
        return;
      }
    }

    const newTimeSettings = {
      timeControlType: localTimeControl,
      customTimeMinutes: parseInt(customTimeMinutes) || 0,
      customTimeSeconds: parseInt(customTimeSeconds) || 0
    };

    updateTimeSettings(newTimeSettings);
    updateSettings({
      timeControl: localTimeControl,
      customTimeMinutes: newTimeSettings.customTimeMinutes,
      customTimeIncrement: newTimeSettings.customTimeSeconds // Storing seconds here or in a dedicated field
    });

    try {
      if (pb.authStore.isValid && pb.authStore.model?.collectionName === 'users') {
        await pb.collection('users').update(pb.authStore.model.id, {
          time_limit: newTimeSettings.timeControlType === 'custom' ? newTimeSettings.customTimeMinutes : null,
          custom_time_minutes: newTimeSettings.customTimeMinutes
        }, { $autoCancel: false });
        toast.success('Time settings saved successfully.');
      }
    } catch (err) {
      console.error('Failed saving time settings to DB:', err);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] rounded-3xl overflow-hidden p-0 gap-0 border border-border shadow-2xl">
        
        <div className="p-6 pb-0 flex justify-between items-center bg-card">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl sm:text-3xl font-black font-serif">Game Settings</DialogTitle>
            <DialogDescription>Customize your game experience.</DialogDescription>
          </DialogHeader>
          <DialogClose className="rounded-full p-2 hover:bg-muted transition-colors">
            <X className="w-6 h-6" />
          </DialogClose>
        </div>

        <Tabs defaultValue="time" className="w-full flex flex-col h-[65dvh] sm:h-[550px]">
          <div className="px-6 border-b border-border bg-card z-10">
            <TabsList className="flex h-14 w-full justify-start overflow-x-auto hide-scrollbar gap-2 bg-transparent">
              <TabsTrigger value="time" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold text-base">Time Control</TabsTrigger>
              <TabsTrigger value="appearance" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold text-base">Appearance</TabsTrigger>
              <TabsTrigger value="audio" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold text-base">Audio</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-muted/10 custom-scrollbar">
            
            {/* TIME CONTROL TAB */}
            <TabsContent value="time" className="mt-0 space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-bold">Select Time Format</Label>
                <Select value={localTimeControl} onValueChange={(val) => { setLocalTimeControl(val); setTimeError(''); }}>
                  <SelectTrigger className="h-14 rounded-xl bg-card text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {localTimeControl === 'custom' && (
                <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 p-5 bg-card border rounded-2xl shadow-sm">
                  <div className="space-y-2">
                    <Label className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Minutes</Label>
                    <Input 
                      type="number" min="0" max="999" 
                      placeholder="Minutes"
                      value={customTimeMinutes}
                      onChange={(e) => { setCustomTimeMinutes(e.target.value); setTimeError(''); }}
                      className="h-14 text-2xl font-mono font-bold text-center rounded-xl bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Seconds</Label>
                    <Input 
                      type="number" min="0" max="59" 
                      placeholder="Seconds"
                      value={customTimeSeconds}
                      onChange={(e) => { setCustomTimeSeconds(e.target.value); setTimeError(''); }}
                      className="h-14 text-2xl font-mono font-bold text-center rounded-xl bg-muted/50"
                    />
                  </div>
                  
                  {timeError && (
                    <div className="col-span-2 flex items-center gap-2 text-sm font-bold text-destructive bg-destructive/10 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4" /> {timeError}
                    </div>
                  )}

                  <div className="col-span-2 text-center text-sm font-medium text-muted-foreground bg-muted py-3 rounded-lg">
                    Total Time: <span className="text-foreground font-bold">{customTimeMinutes || 0}</span> minutes <span className="text-foreground font-bold">{customTimeSeconds || 0}</span> seconds
                  </div>
                </div>
              )}

              <Button onClick={handleSaveTimeSettings} className="w-full h-12 rounded-xl text-base font-bold mt-4">
                <Save className="w-4 h-4 mr-2" /> Apply Time Settings
              </Button>
            </TabsContent>

            {/* APPEARANCE TAB */}
            <TabsContent value="appearance" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-card border shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold">Dark Theme</Label>
                    <p className="text-xs text-muted-foreground">Switch UI to dark mode</p>
                  </div>
                  <Switch checked={settings.theme === 'dark'} onCheckedChange={(val) => updateSettings({ theme: val ? 'dark' : 'light' })} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold">High Contrast</Label>
                    <p className="text-xs text-muted-foreground">Improve visibility</p>
                  </div>
                  <Switch checked={settings.highContrast} onCheckedChange={(val) => updateSettings({ highContrast: val })} />
                </div>
              </div>
            </TabsContent>

            {/* AUDIO TAB */}
            <TabsContent value="audio" className="mt-0 space-y-6">
              <div className="p-5 rounded-2xl bg-card border shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-lg font-bold">Master Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">Play sounds during gameplay</p>
                  </div>
                  <Switch checked={settings.soundEnabled} onCheckedChange={(val) => updateSettings({ soundEnabled: val })} />
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between">
                    <Label className="font-bold">Volume Level</Label>
                    <span className="font-bold text-muted-foreground">{settings.volumeLevel}%</span>
                  </div>
                  <Slider 
                    value={[settings.volumeLevel]} max={100} step={1} 
                    onValueChange={([val]) => updateSettings({ volumeLevel: val })}
                    disabled={!settings.soundEnabled} className="py-2"
                  />
                </div>
              </div>
            </TabsContent>

          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GameSettingsModal;
