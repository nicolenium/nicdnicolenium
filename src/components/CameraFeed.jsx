
import React, { useRef, useState, useEffect } from 'react';
import { Video, VideoOff, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CameraFeed = ({ onToggle }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const toggleCamera = async () => {
    if (isEnabled) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setIsEnabled(false);
      if (onToggle) onToggle(false);
    } else {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setIsEnabled(true);
        if (onToggle) onToggle(true);
      } catch (err) {
        console.error(err);
        toast.error('Camera access denied or unavailable.');
      }
    }
  };

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={toggleCamera} className={isEnabled ? 'border-primary text-primary' : ''}>
        {isEnabled ? <Video className="w-4 h-4 mr-2" /> : <VideoOff className="w-4 h-4 mr-2" />}
        Camera {isEnabled ? 'On' : 'Off'}
      </Button>

      {isEnabled && (
        <div className={`fixed bottom-4 right-4 z-50 bg-background rounded-xl overflow-hidden border-2 border-primary shadow-glow transition-all duration-300 ${isMinimized ? 'w-32 h-24' : 'w-64 h-48'}`}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 bg-black/50 hover:bg-primary/50 text-white rounded-md backdrop-blur-sm transition-colors">
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraFeed;
