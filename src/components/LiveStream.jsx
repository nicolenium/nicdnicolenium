
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Radio, Users, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { Badge } from '@/components/ui/badge';

const LiveStream = ({ sessionId, isAdmin = false }) => {
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamId, setStreamId] = useState(null);

  useEffect(() => {
    if (!sessionId) return;

    // Check existing stream
    const checkStream = async () => {
      try {
        const streams = await pb.collection('live_streams').getFullList({
          filter: `gameSessionId="${sessionId}" && isLive=true`,
          $autoCancel: false
        });
        if (streams.length > 0) {
          setIsLive(true);
          setStreamId(streams[0].id);
          setViewerCount(streams[0].viewerCount || 0);
        }
      } catch (e) {
        console.error("Failed to check stream status", e);
      }
    };
    checkStream();

    // Subscribe to stream updates
    const unsubscribe = pb.collection('live_streams').subscribe('*', (e) => {
      if (e.record.gameSessionId === sessionId) {
        if (e.action === 'update' || e.action === 'create') {
          setIsLive(e.record.isLive);
          setViewerCount(e.record.viewerCount || 0);
          setStreamId(e.record.id);
        } else if (e.action === 'delete') {
          setIsLive(false);
          setStreamId(null);
        }
      }
    });

    return () => pb.collection('live_streams').unsubscribe('*');
  }, [sessionId]);

  const toggleStream = async () => {
    if (!isAdmin) {
      toast.error("Only admins can start official broadcasts.");
      return;
    }

    try {
      if (isLive && streamId) {
        await pb.collection('live_streams').update(streamId, {
          isLive: false,
          endTime: new Date().toISOString()
        }, { $autoCancel: false });
        toast.info("Broadcast ended.");
      } else {
        await pb.collection('live_streams').create({
          gameSessionId: sessionId,
          isLive: true,
          viewerCount: 0
        }, { $autoCancel: false });
        toast.success("Broadcast started successfully.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to toggle broadcast.");
    }
  };

  return (
    <div className="flex items-center gap-4 bg-card border border-border px-4 py-2 rounded-xl shadow-sm">
      <div className="flex items-center gap-2">
        {isLive ? (
          <>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
            </span>
            <span className="text-sm font-bold text-destructive uppercase tracking-wider">Live</span>
          </>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">Offline</span>
        )}
      </div>

      {isLive && (
        <Badge variant="secondary" className="flex items-center gap-1 font-mono">
          <Users className="w-3 h-3" /> {viewerCount}
        </Badge>
      )}

      {isAdmin && (
        <Button 
          variant={isLive ? "destructive" : "default"} 
          size="sm" 
          className="ml-auto text-xs h-8"
          onClick={toggleStream}
        >
          <Radio className="w-3 h-3 mr-2" />
          {isLive ? 'End Stream' : 'Go Live'}
        </Button>
      )}
    </div>
  );
};

export default LiveStream;
