
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Skeleton } from '@/components/ui/skeleton';

const ALL_ACHIEVEMENTS = [
  { id: 'first_win', name: 'First Blood', description: 'Win your first game', icon: '🎯' },
  { id: 'ten_wins', name: 'Contender', description: 'Win 10 games', icon: '🥉' },
  { id: 'fifty_wins', name: 'Master', description: 'Win 50 games', icon: '🥇' },
  { id: 'king_maker', name: 'King Maker', description: 'Promote 5 pieces in one game', icon: '👑' },
  { id: 'perfect_game', name: 'Flawless', description: 'Win without losing any pieces', icon: '⭐' }
];

const Achievements = () => {
  const { currentUser } = useAuth();
  const [earned, setEarned] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchAchievements = async () => {
      try {
        const records = await pb.collection('achievements').getFullList({
          filter: `userId = "${currentUser.id}"`,
          $autoCancel: false
        });
        setEarned(records.map(r => r.achievementType));
      } catch (err) {
        console.error('Error fetching achievements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [currentUser]);

  if (loading) return <Skeleton className="w-full h-48 rounded-xl" />;
  if (!currentUser) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Award className="w-5 h-5 mr-2 text-primary" /> Badges & Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {ALL_ACHIEVEMENTS.map(ach => {
            const isEarned = earned.includes(ach.id);
            return (
              <div 
                key={ach.id} 
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                  isEarned 
                    ? 'border-primary/30 bg-primary/5 shadow-sm' 
                    : 'border-border/50 bg-muted/20 opacity-60 grayscale'
                }`}
              >
                <div className="text-4xl mb-2">{ach.icon}</div>
                <div className="font-bold text-sm leading-tight">{ach.name}</div>
                <div className="text-[10px] text-muted-foreground mt-1 leading-tight">{ach.description}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Achievements;
