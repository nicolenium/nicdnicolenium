
import React, { useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

const CameraButton = ({ sessionId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast.error('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (open) {
      startCamera();
      setPhoto(null);
    } else {
      stopCamera();
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    const photoUrl = canvas.toDataURL('image/jpeg');
    setPhoto(photoUrl);
    stopCamera();
  };

  const retakePhoto = () => {
    setPhoto(null);
    startCamera();
  };

  const savePhoto = async () => {
    if (!photo) return;
    setIsUploading(true);

    try {
      // Convert base64 to file
      const res = await fetch(photo);
      const blob = await res.blob();
      const file = new File([blob], `game-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });

      // If playing an actual server session, update the session
      if (sessionId && !sessionId.startsWith('local-')) {
        const formData = new FormData();
        formData.append('camera_photos', file);
        await pb.collection('game_sessions').update(sessionId, formData, { $autoCancel: false });
        toast.success('Photo saved to game session!');
      } else {
        // Local mode or offline
        toast.success('Photo captured! (Local mode)');
      }
      setIsOpen(false);
    } catch (err) {
      console.error('Error saving photo:', err);
      toast.error('Failed to save photo.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-background">
          <Camera className="w-4 h-4 mr-2" />
          Capture
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Take Game Photo</DialogTitle>
        </DialogHeader>
        
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
          {!photo ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
          ) : (
            <img src={photo} alt="Captured" className="w-full h-full object-cover" />
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          {!photo ? (
            <Button onClick={takePhoto} className="w-full">
              <Camera className="w-4 h-4 mr-2" />
              Snap Photo
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={retakePhoto} disabled={isUploading} className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retake
              </Button>
              <Button onClick={savePhoto} disabled={isUploading} className="flex-1">
                <Check className="w-4 h-4 mr-2" />
                {isUploading ? 'Saving...' : 'Save Photo'}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CameraButton;
