
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Clock, MapPin, Share2, Heart, Play } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const LiveGameCard = ({ session }) => {
  const gameTypeFormatted = session.gameType?.replace(/_/g, ' ') || 'Unknown Game';
  const duration = session.startTime ? formatDistanceToNow(new Date(session.startTime)) : 'Just started';
  
  return (
    <Card className="overflow-hidden border-border/50 bg-[hsl(var(--live-card-bg))] hover:border-brand-primary/50 transition-all duration-300 group flex flex-col h-full shadow-lg hover:shadow-[0_0_20px_rgba(0,255,255,0.1)]">
      {/* Thumbnail Area */}
      <div className="relative aspect-video bg-muted flex items-center justify-center border-b border-border/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background/40 to-transparent z-10" />
        <span className="capitalize font-black text-4xl md:text-5xl text-foreground/20 group-hover:scale-110 transition-transform duration-500 select-none z-0">
          {gameTypeFormatted}
        </span>
        
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          <span className="bg-red-500/90 text-white text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded shadow-sm flex items-center gap-1.5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
          </span>
          {session.camera_enabled && (
            <span className="bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md border border-white/10">
              CAM
            </span>
          )}
        </div>

        <div className="absolute bottom-3 right-3 z-20 bg-black/60 backdrop-blur-md px-2 py-1 rounded flex items-center gap-1.5 border border-white/10">
          <Users className="w-3 h-3 text-brand-primary" />
          <span className="text-xs font-bold text-white tabular-nums">{session.viewer_count || 0}</span>
        </div>
      </div>

      {/* Content Area */}
      <CardContent className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-brand-primary transition-colors">
              {session.expand?.userId?.username || 'Guest Player'}
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
              <span className="capitalize bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded">{session.difficulty || 'Casual'}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {duration}</span>
            </div>
          </div>
        </div>

        {session.location && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{session.location}</span>
          </div>
        )}

        <div className="mt-auto pt-4 flex gap-2">
          <Button asChild className="flex-1 bg-brand-primary text-primary-foreground hover:bg-brand-primary/90 font-bold tracking-wide">
            <Link to={`/live-games/${session.id}`}>
              <Play className="w-4 h-4 mr-2" /> Watch
            </Link>
          </Button>
          <Button variant="outline" size="icon" className="border-border hover:text-brand-primary shrink-0">
            <Heart className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="border-border hover:text-brand-primary shrink-0">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveGameCard;
