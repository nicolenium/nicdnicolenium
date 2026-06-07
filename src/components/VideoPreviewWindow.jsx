
import React, { useRef, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Camera, FlipHorizontal, RefreshCw, XCircle } from 'lucide-react';

const VideoPreviewWindow = ({ open, onOpenChange, onConfirm }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [isMirrored, setIsMirrored] = useState(false);

  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [open]);

  const startCamera = async () => {
    setError('');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Camera/Microphone access denied or unavailable.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleConfirm = () => {
    onConfirm(stream);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-brand-primary" /> Camera Setup
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error ? (
            <div className="p-6 bg-destructive/10 border border-destructive/30 rounded-xl text-center flex flex-col items-center">
              <XCircle className="w-12 h-12 text-destructive mb-3" />
              <p className="font-semibold text-destructive">{error}</p>
              <Button variant="outline" className="mt-4 border-destructive/50 hover:bg-destructive/20" onClick={startCamera}>
                <RefreshCw className="w-4 h-4 mr-2" /> Retry
              </Button>
            </div>
          ) : (
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-inner border border-border/50">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transition-all"
                style={{ 
                  filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%)`,
                  transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)'
                }}
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <Button size="icon" variant="secondary" className="h-8 w-8 bg-black/50 hover:bg-black/80 text-white border-0 backdrop-blur" onClick={() => setIsMirrored(!isMirrored)}>
                  <FlipHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {!error && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Brightness</Label>
                  <span className="text-xs text-muted-foreground">{brightness[0]}%</span>
                </div>
                <Slider value={brightness} onValueChange={setBrightness} min={50} max={150} step={1} className="[&_[role=slider]]:bg-brand-primary" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Contrast</Label>
                  <span className="text-xs text-muted-foreground">{contrast[0]}%</span>
                </div>
                <Slider value={contrast} onValueChange={setContrast} min={50} max={150} step={1} className="[&_[role=slider]]:bg-brand-primary" />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!!error} className="bg-brand-primary text-primary-foreground hover:bg-brand-primary/90">
            Confirm & Start
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPreviewWindow;
