
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Video, Square, Play, Pause, FastForward, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

export const VideoRecorder = ({ sessionId }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        chunksRef.current = [];
        setIsRecording(false);
        await uploadVideo(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Screen recording started");
    } catch (err) {
      console.error("Recording error:", err);
      toast.error("Failed to start recording. Please grant permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const uploadVideo = async (blob) => {
    if (!pb.authStore.isValid || !sessionId) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('videoFile', blob, `game_${sessionId}.webm`);
      formData.append('gameSessionId', sessionId);
      formData.append('userId', pb.authStore.model.id);
      
      await pb.collection('game_videos').create(formData, { $autoCancel: false });
      toast.success("Game video saved successfully");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to save video to database");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex gap-2">
      {!isRecording ? (
        <Button variant="outline" size="sm" onClick={startRecording} disabled={isUploading} className="text-primary hover:text-primary hover:bg-primary/10">
          <Video className="w-4 h-4 mr-2" /> {isUploading ? 'Saving...' : 'Record Game'}
        </Button>
      ) : (
        <Button variant="destructive" size="sm" onClick={stopRecording} className="animate-pulse">
          <Square className="w-4 h-4 mr-2" /> Stop Recording
        </Button>
      )}
    </div>
  );
};

export const VideoPlayer = ({ videoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const changeSpeed = () => {
    const nextSpeed = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : playbackRate === 2 ? 0.5 : 1;
    setPlaybackRate(nextSpeed);
    if (videoRef.current) videoRef.current.playbackRate = nextSpeed;
  };

  if (!videoUrl) return null;

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardContent className="p-0 relative group">
        <video 
          ref={videoRef} 
          src={videoUrl} 
          className="w-full h-auto aspect-video object-cover bg-black"
          onEnded={() => setIsPlaying(false)}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full" onClick={togglePlay}>
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 font-mono" onClick={changeSpeed}>
              <FastForward className="w-4 h-4 mr-1" /> {playbackRate}x
            </Button>
          </div>
          <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full" asChild>
            <a href={videoUrl} download>
              <Download className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
