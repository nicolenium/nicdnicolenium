
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, PhoneOff, Mic, MicOff, Signal } from 'lucide-react';
import { useMicrophone } from '@/contexts/MicrophoneContext.jsx';
import { toast } from 'sonner';

const VoiceChatComponent = ({ sessionId, remoteUser }) => {
  const { stream, isMuted, volumeLevel, startMicrophone, stopMicrophone, toggleMicrophoneMute } = useMicrophone();
  const [isConnected, setIsConnected] = useState(false);
  const [latency, setLatency] = useState(0);

  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, []);

  const handleConnect = async () => {
    await startMicrophone();
    // Simulate WebRTC connection delay
    setTimeout(() => {
      setIsConnected(true);
      setLatency(Math.floor(Math.random() * 50) + 20); // 20-70ms mock latency
      toast.success("Connected to voice channel");
    }, 1000);
  };

  const handleDisconnect = () => {
    stopMicrophone();
    setIsConnected(false);
    toast("Disconnected from voice channel");
  };

  return (
    <Card className="bg-card border-border/50 shadow-md">
      <CardHeader className="py-3 px-4 border-b border-border/50 bg-muted/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Phone className="w-4 h-4 text-brand-primary" /> Voice Channel
          </CardTitle>
          {isConnected && (
            <span className="flex items-center gap-1.5 text-[10px] text-green-500 font-mono font-bold tracking-wider">
              <Signal className="w-3 h-3" /> {latency}ms
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {!isConnected ? (
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">Join voice chat to communicate with other players.</p>
            <Button onClick={handleConnect} className="w-full bg-green-600 hover:bg-green-700 text-white shadow-glow">
              <Phone className="w-4 h-4 mr-2" /> Connect Audio
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Local User */}
            <div className="flex items-center justify-between bg-muted/30 p-2 rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/20 text-primary">ME</AvatarFallback>
                  </Avatar>
                  {volumeLevel > 10 && !isMuted && (
                    <span className="absolute -inset-1 rounded-full border-2 border-green-500 animate-pulse pointer-events-none" />
                  )}
                </div>
                <span className="text-sm font-bold">You</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-8 w-8 ${isMuted ? 'text-destructive bg-destructive/10' : 'text-green-500 hover:bg-green-500/10'}`}
                onClick={toggleMicrophoneMute}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>

            {/* Remote User (Mock) */}
            {remoteUser && (
              <div className="flex items-center justify-between bg-muted/30 p-2 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={remoteUser.avatar} />
                      <AvatarFallback className="bg-secondary text-secondary-foreground">{remoteUser.name?.[0] || 'R'}</AvatarFallback>
                    </Avatar>
                    {/* Simulated remote speaking */}
                    <span className="absolute -inset-1 rounded-full border border-green-500/50 pointer-events-none" />
                  </div>
                  <span className="text-sm font-medium">{remoteUser.name || 'Opponent'}</span>
                </div>
                <Mic className="w-4 h-4 text-green-500/70" />
              </div>
            )}

            <Button onClick={handleDisconnect} variant="destructive" className="w-full mt-2">
              <PhoneOff className="w-4 h-4 mr-2" /> Disconnect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceChatComponent;
