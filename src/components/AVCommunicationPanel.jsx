
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Minimize2, Send, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';
import { toast } from 'sonner';

export default function AVCommunicationPanel({ gameSessionId, currentUserId, opponentId, onClose }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
        toast.error("Could not access camera or microphone.");
      }
    };
    
    startMedia();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages([...messages, { text: chatInput, sender: 'me', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    setChatInput('');
  };

  const handleEndCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (onClose) onClose();
  };

  if (isMinimized) {
    return (
      <div className="absolute right-4 top-20 z-50 bg-card border border-border shadow-lg rounded-full flex items-center p-2 gap-2 animate-in fade-in">
        <Button variant="ghost" size="icon" onClick={() => setIsMinimized(false)} className="rounded-full hover:bg-primary/20 hover:text-primary">
          <MessageSquare className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card border-l border-border shadow-2xl w-full sm:w-80 absolute right-0 top-0 bottom-0 z-40 animate-in slide-in-from-right-8 overflow-hidden">
      <div className="p-3 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          Live A/V Chat
        </h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMinimized(true)}>
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" onClick={handleEndCall}>
            <PhoneOff className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-3 shrink-0">
        {/* Remote Video */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-border">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs font-medium text-white backdrop-blur-sm">
            Opponent
          </div>
          {!remoteVideoRef.current?.srcObject && (
            <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm font-medium bg-zinc-900">
              Waiting for opponent...
            </div>
          )}
        </div>

        {/* Local Video and Controls */}
        <div className="flex gap-3 h-20">
          <div className="relative w-1/3 h-full bg-black rounded-xl overflow-hidden border border-border">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                <VideoOff className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex-1 grid grid-cols-2 gap-2">
            <Button variant={isMuted ? "destructive" : "secondary"} size="sm" onClick={toggleMute} className="h-full flex flex-col items-center justify-center gap-1 rounded-xl">
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span className="text-[10px] font-bold uppercase tracking-wider">{isMuted ? 'Muted' : 'Mic On'}</span>
            </Button>
            <Button variant={isVideoOff ? "destructive" : "secondary"} size="sm" onClick={toggleVideo} className="h-full flex flex-col items-center justify-center gap-1 rounded-xl">
              {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              <span className="text-[10px] font-bold uppercase tracking-wider">{isVideoOff ? 'Cam Off' : 'Cam On'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col border-t border-border bg-background min-h-0">
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <p className="text-center text-xs font-medium text-muted-foreground mt-4">Start chatting!</p>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-3 py-2 rounded-2xl max-w-[85%] text-sm font-medium shadow-sm ${msg.sender === 'me' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground mt-1 px-1">{msg.time}</span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="p-3 border-t border-border flex gap-2 bg-muted/20 shrink-0">
          <Input 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type message..."
            className="h-10 text-sm rounded-full bg-background border-border"
          />
          <Button type="submit" size="icon" className="h-10 w-10 shrink-0 rounded-full bg-primary text-primary-foreground">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
