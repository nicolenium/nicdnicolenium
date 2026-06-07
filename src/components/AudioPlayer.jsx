
import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Mic, Activity, CheckCircle2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getLanguageCode } from '@/config/languageAudioConfig';
import { toast } from 'sonner';

export default function AudioPlayer({ text, language, audioUrl, onScore }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);

  const playTTS = () => {
    if (!text) return;
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLanguageCode(language);
    utterance.rate = 0.9;
    
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      toast.error("Failed to play audio.");
    };
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const drawWaveform = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      if (!isRecording) return;
      animationRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteTimeDomainData(dataArray);
      
      ctx.fillStyle = 'rgb(10, 10, 10)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(0, 255, 65)';
      ctx.beginPath();
      
      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };
    draw();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setScore(null);
      
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.offsetWidth;
        canvasRef.current.height = canvasRef.current.offsetHeight;
        drawWaveform();
      }
    } catch (err) {
      toast.error("Microphone access denied.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      
      setAnalyzing(true);
      // Simulate AI analysis delay
      setTimeout(() => {
        setAnalyzing(false);
        const calculatedScore = Math.floor(Math.random() * 20) + 75; // Mock score 75-95
        setScore(calculatedScore);
        if (onScore) onScore(calculatedScore);
      }, 1500);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="w-full space-y-6 bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-bold mb-1">AI Pronunciation</h4>
          <p className="text-sm text-muted-foreground">Listen to the native pronunciation, then try it yourself.</p>
        </div>
        <Button 
          onClick={playTTS} 
          disabled={isPlaying || isRecording}
          variant="secondary"
          className="rounded-full px-6 font-bold"
        >
          {isPlaying ? <Volume2 className="w-4 h-4 mr-2 animate-pulse" /> : <Play className="w-4 h-4 mr-2" />}
          {isPlaying ? 'Playing...' : 'Listen'}
        </Button>
      </div>

      <div className="relative w-full h-32 bg-background rounded-xl border border-border overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full ${!isRecording ? 'opacity-0' : 'opacity-100'} transition-opacity`} />
        
        {!isRecording && !analyzing && !score && (
          <div className="text-muted-foreground flex flex-col items-center">
            <Mic className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-sm font-medium">Ready to record</span>
          </div>
        )}
        
        {analyzing && (
          <div className="text-primary flex flex-col items-center">
            <Activity className="w-8 h-8 mb-2 animate-pulse" />
            <span className="text-sm font-bold uppercase tracking-wider">Analyzing Audio...</span>
          </div>
        )}

        {score && !isRecording && !analyzing && (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-2xl font-black">{score}% Match</span>
            </div>
            <Progress value={score} className="w-48 h-2" />
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button 
          size="lg"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isPlaying || analyzing}
          className={`rounded-full w-16 h-16 transition-all duration-300 ${
            isRecording 
              ? 'bg-destructive hover:bg-destructive/90 shadow-[0_0_0_8px_rgba(239,68,68,0.2)]' 
              : 'bg-primary text-primary-foreground hover:scale-105 shadow-lg'
          }`}
        >
          {isRecording ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-6 h-6" />}
        </Button>
      </div>
    </div>
  );
}
