
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Video, VideoOff, Volume2, Settings2, Activity } from 'lucide-react';

const AVTab = () => {
  const [micEnabled, setMicEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [quality, setQuality] = useState('auto');

  return (
    <div className="flex flex-col h-full gap-6 p-4 bg-card rounded-xl border border-border overflow-y-auto custom-scrollbar">
      
      {/* Camera Preview Placeholder */}
      <div className="w-full aspect-video bg-muted rounded-xl border border-border flex flex-col items-center justify-center relative overflow-hidden">
        {cameraEnabled ? (
          <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-500 text-sm font-medium">Camera Feed Active</span>
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-white font-bold uppercase tracking-wider">Live</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-muted-foreground">
            <VideoOff className="w-12 h-12 mb-2 opacity-20" />
            <span className="text-sm font-medium">Camera is off</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant={micEnabled ? "default" : "outline"} 
          className={`h-14 rounded-xl flex flex-col gap-1 ${micEnabled ? 'bg-primary text-primary-foreground' : ''}`}
          onClick={() => setMicEnabled(!micEnabled)}
        >
          {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          <span className="text-xs">{micEnabled ? 'Mute Mic' : 'Unmute Mic'}</span>
        </Button>
        
        <Button 
          variant={cameraEnabled ? "default" : "outline"} 
          className={`h-14 rounded-xl flex flex-col gap-1 ${cameraEnabled ? 'bg-primary text-primary-foreground' : ''}`}
          onClick={() => setCameraEnabled(!cameraEnabled)}
        >
          {cameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          <span className="text-xs">{cameraEnabled ? 'Stop Video' : 'Start Video'}</span>
        </Button>
      </div>

      {/* Settings */}
      <div className="space-y-6 bg-muted/30 p-4 rounded-xl border border-border/50">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" /> Output Volume
            </label>
            <span className="text-xs text-muted-foreground font-mono">{volume[0]}%</span>
          </div>
          <Slider 
            value={volume} 
            onValueChange={setVolume} 
            max={100} 
            step={1}
            className="py-2"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-primary" /> Video Quality
          </label>
          <Select value={quality} onValueChange={setQuality}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto (Recommended)</SelectItem>
              <SelectItem value="hd">High Definition (720p)</SelectItem>
              <SelectItem value="sd">Standard Definition (480p)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-2 border-t border-border flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Activity className="w-3 h-3" /> Connection Status
          </span>
          <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
            Excellent
          </span>
        </div>
      </div>
    </div>
  );
};

export default AVTab;
