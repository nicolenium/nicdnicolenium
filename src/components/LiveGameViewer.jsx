
import React from 'react';
import pb from '@/lib/pocketbaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Eye, VideoOff } from 'lucide-react';
import GameComments from '@/components/GameComments.jsx';
import GameLikesShare from '@/components/GameLikesShare.jsx';

const LiveGameViewer = ({ session }) => {
  if (!session) return null;
  const user = session.expand?.userId;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <Card className="overflow-hidden border-primary/30 shadow-glow bg-card">
          <div className="aspect-video bg-black flex items-center justify-center relative border-b border-primary/20">
            {session.camera_enabled && session.camera_feed_url ? (
              <img src={session.camera_feed_url} alt="Camera Feed" className="w-full h-full object-cover opacity-80" />
            ) : session.camera_enabled ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <VideoOff className="w-16 h-16 text-muted-foreground opacity-30" />
                <p className="absolute bottom-4 text-primary text-sm font-semibold tracking-widest uppercase">Connecting Feed...</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-4xl font-extrabold capitalize text-primary tracking-widest drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                  {(session.video_game_type || session.gameType).replace('_', ' ')}
                </p>
                <p className="text-muted-foreground mt-4 font-medium uppercase tracking-wider">Live Board View</p>
              </div>
            )}
            <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider animate-pulse shadow-lg shadow-destructive/50">
              LIVE
            </div>
            <div className="absolute top-4 right-4 bg-background/80 text-foreground text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 backdrop-blur border border-border">
              <Eye className="w-4 h-4 text-primary" /> {session.viewer_count || 0}
            </div>
          </div>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border-2 border-primary/50 shadow-glow">
                  {user?.profile_picture ? (
                    <AvatarImage src={pb.files.getUrl(user, user.profile_picture)} />
                  ) : (
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{user?.username || 'Player'}'s Game</h2>
                  <p className="text-muted-foreground capitalize text-sm">{session.mode || 'Solo'} • {session.timeControl || 'Standard'}</p>
                </div>
              </div>
              <div className="text-right bg-primary/10 px-6 py-2 rounded-xl border border-primary/20">
                <p className="text-xs text-primary font-bold uppercase tracking-wider">Current Score</p>
                <p className="text-3xl font-black text-foreground drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]">{session.score || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-1 space-y-6">
        <GameLikesShare gameId={session.id} />
        <GameComments gameId={session.id} />
      </div>
    </div>
  );
};

export default LiveGameViewer;
