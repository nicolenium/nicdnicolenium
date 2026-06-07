import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Trophy, Medal, Star, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import pb from '@/lib/pocketbaseClient';

const TournamentLeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameFilter, setGameFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, [gameFilter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      // Fetching from user_tournament_stats for global ranking
      const records = await pb.collection('user_tournament_stats').getList(1, 100, {
        sort: '-winRate,-totalWins',
        expand: 'userId',
        $autoCancel: false
      });
      setLeaderboard(records.items);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = leaderboard.filter(item => 
    item.expand?.userId?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background py-12">
      <Helmet><title>Global Leaderboard - NICD PRODUCTIONS</title></Helmet>
      
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Global Rankings</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The best players across all tournaments. Compete, win, and secure your spot at the top.
          </p>
        </div>

        <Card className="bg-card border-border shadow-xl overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search players..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background border-border"
              />
            </div>
            <Select value={gameFilter} onValueChange={setGameFilter}>
              <SelectTrigger className="w-full sm:w-[200px] bg-background border-border">
                <SelectValue placeholder="Filter by Game" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Games</SelectItem>
                <SelectItem value="checkers">Checkers</SelectItem>
                <SelectItem value="chess">Chess</SelectItem>
                <SelectItem value="ludo">Ludo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 space-y-4">
                {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="border-border">
                      <TableHead className="w-24 text-center text-muted-foreground">Rank</TableHead>
                      <TableHead className="text-muted-foreground">Player</TableHead>
                      <TableHead className="text-center text-muted-foreground">Tournaments</TableHead>
                      <TableHead className="text-center text-muted-foreground">Wins</TableHead>
                      <TableHead className="text-center text-muted-foreground">Win Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          No players found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((stat, index) => (
                        <TableRow key={stat.id} className="border-border hover:bg-muted/20 transition-colors">
                          <TableCell className="text-center font-bold">
                            {index === 0 ? <Medal className="w-6 h-6 text-yellow-500 mx-auto" /> :
                             index === 1 ? <Medal className="w-6 h-6 text-gray-400 mx-auto" /> :
                             index === 2 ? <Medal className="w-6 h-6 text-amber-700 mx-auto" /> :
                             <span className="text-muted-foreground">#{index + 1}</span>}
                          </TableCell>
                          <TableCell className="font-medium text-foreground flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground">
                              {stat.expand?.userId?.username?.substring(0, 2).toUpperCase() || 'UN'}
                            </div>
                            {stat.expand?.userId?.username || 'Unknown Player'}
                          </TableCell>
                          <TableCell className="text-center text-foreground">{stat.totalTournamentsJoined || 0}</TableCell>
                          <TableCell className="text-center text-foreground font-mono">{stat.totalWins || 0}</TableCell>
                          <TableCell className="text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              (stat.winRate || 0) >= 60 ? 'bg-primary/20 text-primary' :
                              (stat.winRate || 0) >= 40 ? 'bg-yellow-500/20 text-yellow-500' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {stat.winRate || 0}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TournamentLeaderboardPage;