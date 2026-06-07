
import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LocationDisplay from '@/components/LocationDisplay.jsx';
import { Loader2, Trophy, Medal, Award } from 'lucide-react';

const TournamentLeaderboard = ({ tournamentId }) => {
  const { t } = useLanguage();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tournamentId) return;
    
    const fetchLeaderboard = async () => {
      try {
        const records = await pb.collection('tournament_leaderboard').getFullList({
          filter: `tournamentId="${tournamentId}"`,
          sort: '-score,-wins',
          $autoCancel: false
        });
        setLeaderboard(records);
      } catch (error) {
        console.error('Error fetching tournament leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();

    const subscribe = async () => {
      try {
        await pb.collection('tournament_leaderboard').subscribe('*', (e) => {
          if (e.record.tournamentId === tournamentId) {
            fetchLeaderboard(); // Re-fetch to maintain correct sorting
          }
        });
      } catch (err) {
        console.error('Subscription error:', err);
      }
    };

    subscribe();

    return () => {
      pb.collection('tournament_leaderboard').unsubscribe('*').catch(() => {});
    };
  }, [tournamentId]);

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-secondary drop-shadow-md" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-300 drop-shadow-md" />;
    if (index === 2) return <Award className="w-5 h-5 text-amber-600 drop-shadow-md" />;
    return <span className="text-muted-foreground font-bold text-sm w-5 text-center">{index + 1}</span>;
  };

  if (loading) {
    return <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (leaderboard.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">No players registered yet.</div>;
  }

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <div className="min-w-[600px] w-full border border-border bg-card rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-[60px_1fr_100px_100px_100px_100px] gap-4 p-3 bg-muted/50 border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <div className="text-center">Rank</div>
          <div>Player</div>
          <div className="text-center">Score</div>
          <div className="text-center">W</div>
          <div className="text-center">L</div>
          <div className="text-center">D</div>
        </div>
        <div className="divide-y divide-border/50">
          {leaderboard.map((entry, index) => (
            <div key={entry.id} className={`grid grid-cols-[60px_1fr_100px_100px_100px_100px] gap-4 p-3 items-center hover:bg-muted/20 transition-colors ${index === 0 ? 'bg-secondary/5' : ''}`}>
              <div className="flex justify-center">{getRankIcon(index)}</div>
              <div className="flex flex-col">
                <span className={`font-bold ${index === 0 ? 'text-primary' : 'text-foreground'}`}>{entry.username}</span>
                <LocationDisplay locationString={entry.location} privacy={entry.locationPrivacy} />
              </div>
              <div className={`text-center font-black text-lg ${index === 0 ? 'text-secondary drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]' : 'text-foreground'}`}>
                {entry.score}
              </div>
              <div className="text-center font-semibold text-green-500">{entry.wins}</div>
              <div className="text-center font-semibold text-red-500">{entry.losses}</div>
              <div className="text-center font-semibold text-muted-foreground">{entry.draws}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TournamentLeaderboard;
