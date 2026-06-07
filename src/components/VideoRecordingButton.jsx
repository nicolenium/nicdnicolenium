
import React, { useState } from 'react';
import { Camera, Video, MonitorUp, StopCircle, Settings2, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const VideoRecordingButton = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [settings, setSettings] = useState({
    includeMic: true,
    includeCamera: true,
    highQuality: true
  });

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setShowPreview(false);
      toast.success("Recording saved successfully. Ready to share or download.");
    } else {
      setIsRecording(true);
      if (settings.includeCamera) setShowPreview(true);
      toast("Recording started...");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant={isRecording ? "destructive" : "outline"} 
          size="sm" 
          className={`relative overflow-hidden transition-all ${isRecording ? 'animate-pulse bg-red-600/20 text-red-500 border-red-600' : 'bg-background hover:bg-muted'}`}
        >
          {isRecording ? <StopCircle className="w-4 h-4 mr-2" /> : <Camera className="w-4 h-4 mr-2" />}
          {isRecording ? "REC 00:14" : "Record"}
          {isRecording && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_red]" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 bg-card border-border p-4 shadow-xl rounded-xl" align="end">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <Video className="w-5 h-5 text-primary" />
            <h4 className="font-bold">Streaming & Recording</h4>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Record Microphone</label>
              <Switch checked={settings.includeMic} onCheckedChange={(c) => setSettings({...settings, includeMic: c})} disabled={isRecording} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Camera Overlay</label>
              <Switch checked={settings.includeCamera} onCheckedChange={(c) => setSettings({...settings, includeCamera: c})} disabled={isRecording} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">HD Quality (1080p)</label>
              <Switch checked={settings.highQuality} onCheckedChange={(c) => setSettings({...settings, highQuality: c})} disabled={isRecording} />
            </div>
          </div>

          <div className="pt-3 border-t border-border/50 space-y-2">
            <Button 
              className={`w-full ${isRecording ? 'bg-destructive hover:bg-destructive/90 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
              onClick={handleToggleRecord}
            >
              {isRecording ? <><StopCircle className="w-4 h-4 mr-2" /> Stop Recording</> : <><Video className="w-4 h-4 mr-2" /> Start Recording</>}
            </Button>
            
            {!isRecording && (
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 text-xs"><MonitorUp className="w-3 h-3 mr-1" /> Screen Share</Button>
                <Button variant="outline" className="flex-1 text-xs"><Share2 className="w-3 h-3 mr-1" /> Stream</Button>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
      
      {showPreview && (
        <div className="fixed bottom-6 right-6 w-48 h-36 bg-black rounded-lg border-2 border-primary shadow-2xl overflow-hidden z-50">
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded text-[10px] text-white font-bold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> LIVE
          </div>
          <div className="w-full h-full flex items-center justify-center text-white/50 text-xs font-medium">
            Camera Active
          </div>
        </div>
      )}
    </Popover>
  );
};

export default VideoRecordingButton;
