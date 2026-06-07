
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const records = await pb.collection('player_stats').getList(1, 10, {
          sort: '-currentRating',
          expand: 'userId',
          $autoCancel: false
        });
        setLeaders(records.items);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-500" /> Top Players
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full rounded-md" />)}
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">No ranked players yet.</div>
        ) : (
          <div className="space-y-2">
            {leaders.map((leader, index) => {
              const user = leader.expand?.userId;
              if (!user) return null;
              
              let rankColor = "text-muted-foreground";
              if (index === 0) rankColor = "text-yellow-500";
              if (index === 1) rankColor = "text-gray-400";
              if (index === 2) rankColor = "text-amber-700";

              return (
                <div key={leader.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 text-center font-bold ${rankColor}`}>
                      {index < 3 ? <Medal className="w-5 h-5 mx-auto" /> : `${index + 1}`}
                    </div>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar ? pb.files.getUrl(user, user.avatar) : ''} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {user.username?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.username}</span>
                  </div>
                  <div className="font-bold">{leader.currentRating || 1200}</div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
