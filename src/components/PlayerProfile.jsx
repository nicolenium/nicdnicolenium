
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Target, Hash, BarChart2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Skeleton } from '@/components/ui/skeleton';

const PlayerProfile = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const records = await pb.collection('player_stats').getFullList({
          filter: `userId = "${currentUser.id}"`,
          $autoCancel: false
        });
        
        if (records.length > 0) {
          setStats(records[0]);
        } else {
          // If no stats exist, create default
          const newStats = await pb.collection('player_stats').create({
            userId: currentUser.id,
            gamesPlayed: 0,
            gamesWon: 0,
            gamesLost: 0,
            winPercentage: 0,
            averageMoves: 0,
            currentRating: 1200,
            highestRating: 1200
          }, { $autoCancel: false });
          setStats(newStats);
        }
      } catch (err) {
        console.error('Error fetching player stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser]);

  if (loading) return <Skeleton className="w-full h-48 rounded-xl" />;
  if (!currentUser) return (
    <Card className="bg-muted/50 border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p>Please log in to view your profile.</p>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="w-16 h-16 border-2 border-primary/20">
          <AvatarImage src={currentUser.avatar ? pb.files.getUrl(currentUser, currentUser.avatar) : ''} />
          <AvatarFallback className="bg-primary/10 text-primary text-xl">
            {currentUser.username?.substring(0, 2).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-2xl">{currentUser.username}</CardTitle>
          <div className="text-sm text-muted-foreground flex items-center mt-1">
            <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
            Rating: <span className="font-bold text-foreground ml-1">{stats?.currentRating || 1200}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div className="bg-muted rounded-lg p-3 flex flex-col items-center justify-center">
            <Hash className="w-5 h-5 text-muted-foreground mb-1" />
            <span className="text-2xl font-bold">{stats?.gamesPlayed || 0}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Games</span>
          </div>
          <div className="bg-primary/10 text-primary rounded-lg p-3 flex flex-col items-center justify-center">
            <Trophy className="w-5 h-5 mb-1" />
            <span className="text-2xl font-bold">{stats?.gamesWon || 0}</span>
            <span className="text-xs uppercase tracking-wider">Wins</span>
          </div>
          <div className="bg-muted rounded-lg p-3 flex flex-col items-center justify-center">
            <Target className="w-5 h-5 text-muted-foreground mb-1" />
            <span className="text-2xl font-bold">{stats?.winPercentage ? stats.winPercentage.toFixed(1) : 0}%</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Win Rate</span>
          </div>
          <div className="bg-muted rounded-lg p-3 flex flex-col items-center justify-center">
            <BarChart2 className="w-5 h-5 text-muted-foreground mb-1" />
            <span className="text-2xl font-bold">{stats?.highestRating || 1200}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Peak Rating</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerProfile;
