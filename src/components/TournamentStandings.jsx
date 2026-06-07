
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const TournamentStandings = ({ tournamentId }) => {
  const [standings, setStandings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const records = await pb.collection('tournament_leaderboard').getFullList({
          filter: `tournamentId = "${tournamentId}"`,
          sort: '-score, -wins',
          $autoCancel: false
        });
        setStandings(records);
      } catch (error) {
        console.error("Error fetching standings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStandings();

    // Subscribe to realtime updates
    const unsubscribe = pb.collection('tournament_leaderboard').subscribe('*', function (e) {
      if (e.record.tournamentId === tournamentId) {
        fetchStandings(); // Refetch to maintain correct sorting easily
      }
    });

    return () => {
      pb.collection('tournament_leaderboard').unsubscribe('*');
    };
  }, [tournamentId]);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center rounded-xl bg-card border border-border">
        <p className="text-muted-foreground animate-pulse">Loading standings...</p>
      </div>
    );
  }

  if (standings.length === 0) {
    return (
      <div className="w-full p-12 flex flex-col items-center justify-center rounded-xl bg-card border border-border text-center">
        <Trophy className="w-12 h-12 text-muted-foreground opacity-30 mb-4" />
        <h3 className="text-lg font-bold">No Standings Yet</h3>
        <p className="text-muted-foreground">The leaderboard will update once matches are played.</p>
      </div>
    );
  }

  return (
    <Card className="border-border shadow-sm overflow-hidden bg-card text-card-foreground">
      <CardHeader className="bg-muted/30 border-b border-border">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" /> Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 text-muted-foreground uppercase tracking-wider text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Player</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">W-L-D</th>
                <th className="px-6 py-4 text-right">Win %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {standings.map((player, index) => (
                <tr key={player.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold">#{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{player.username}</td>
                  <td className="px-6 py-4 font-bold text-primary">{player.score || 0}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {player.wins || 0} - {player.losses || 0} - {player.draws || 0}
                  </td>
                  <td className="px-6 py-4 text-right font-mono">
                    {player.wins ? Math.round((player.wins / (player.wins + player.losses + player.draws)) * 100) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentStandings;
