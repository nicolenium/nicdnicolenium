
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useMicrophone } from '@/contexts/MicrophoneContext.jsx';
import { Mic, Waves, EarOff as AudioLines, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MicrophoneSettingsPanel = () => {
  const { 
    devices, selectedDevice, setSelectedDevice, 
    settings, updateSettings, 
    startMicrophone, stopMicrophone, stream 
  } = useMicrophone();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold flex items-center gap-2"><Mic className="w-4 h-4" /> Input Device</h4>
          <p className="text-xs text-muted-foreground">Select your preferred microphone</p>
        </div>
        <Select value={selectedDevice} onValueChange={setSelectedDevice}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select device..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">System Default</SelectItem>
            {devices.map(d => (
              <SelectItem key={d.deviceId} value={d.deviceId}>{d.label || `Microphone ${d.deviceId.substring(0,4)}`}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="flex items-center gap-2"><Settings2 className="w-4 h-4" /> Input Volume</Label>
          <span className="text-xs text-muted-foreground">{settings.inputVolume}%</span>
        </div>
        <Slider 
          value={[settings.inputVolume]} 
          onValueChange={([val]) => updateSettings({ inputVolume: val })} 
          max={100} 
        />
      </div>

      <div className="space-y-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2"><Waves className="w-4 h-4 text-blue-400" /> Noise Cancellation</Label>
            <p className="text-xs text-muted-foreground">Filter out background noise</p>
          </div>
          <Switch 
            checked={settings.noiseCancellation} 
            onCheckedChange={(checked) => updateSettings({ noiseCancellation: checked })} 
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2"><AudioLines className="w-4 h-4 text-purple-400" /> Echo Cancellation</Label>
            <p className="text-xs text-muted-foreground">Prevent audio feedback loops</p>
          </div>
          <Switch 
            checked={settings.echoCancellation} 
            onCheckedChange={(checked) => updateSettings({ echoCancellation: checked })} 
          />
        </div>
      </div>

      <div className="pt-4 border-t border-border/50 flex justify-end gap-2">
        {stream ? (
          <Button variant="outline" onClick={stopMicrophone} className="border-destructive text-destructive hover:bg-destructive/10">Stop Testing</Button>
        ) : (
          <Button variant="secondary" onClick={startMicrophone}>Test Microphone</Button>
        )}
      </div>
    </div>
  );
};

export default MicrophoneSettingsPanel;
