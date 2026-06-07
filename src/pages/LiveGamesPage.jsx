
import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LiveGameCard from '@/components/LiveGameCard.jsx';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Radio, Search, Filter, Hash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const LiveGamesPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  const [sortBy, setSortBy] = useState('viewers'); // viewers, duration

  const fetchLiveGames = async () => {
    try {
      const records = await pb.collection('game_sessions').getFullList({
        filter: 'is_live = true && privacy_setting = "public"',
        expand: 'userId',
        sort: sortBy === 'viewers' ? '-viewer_count,-startTime' : '-startTime',
        $autoCancel: false
      });
      setSessions(records);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveGames();
    const interval = setInterval(fetchLiveGames, 5000);
    return () => clearInterval(interval);
  }, [sortBy]); // Refetch if sort changes to apply at DB level

  const filteredSessions = sessions.filter(session => {
    if (gameFilter !== 'all' && session.gameType !== gameFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const userMatches = session.expand?.userId?.username?.toLowerCase().includes(q);
      const gameMatches = session.gameType?.toLowerCase().replace(/_/g, ' ').includes(q);
      return userMatches || gameMatches;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Live Games - NICD</title></Helmet>
      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 border-b border-border/50 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_15px_rgba(255,0,0,0.1)]">
              <Radio className="w-7 h-7 text-red-500 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Live Games</h1>
              <p className="text-muted-foreground font-medium mt-1">Watch community and tournament matches in real-time</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search games or players..." 
                className="pl-9 bg-card border-border w-full sm:w-[240px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={gameFilter} onValueChange={setGameFilter}>
              <SelectTrigger className="w-full sm:w-[160px] bg-card">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Games" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Games</SelectItem>
                <SelectItem value="checkers">Checkers</SelectItem>
                <SelectItem value="ludo">Ludo</SelectItem>
                <SelectItem value="trivia">Trivia</SelectItem>
                <SelectItem value="space_invaders">Space Invaders</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[160px] bg-card">
                <Hash className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewers">Most Viewers</SelectItem>
                <SelectItem value="duration">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="live-game-grid">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="flex flex-col gap-4 bg-card p-4 rounded-xl border border-border">
                <Skeleton className="w-full aspect-video rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <div className="mt-4 flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-32 bg-card/50 rounded-3xl border border-dashed border-border flex flex-col items-center">
            <Radio className="w-20 h-20 text-muted-foreground mb-6 opacity-30" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">No Active Matches Found</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-lg">
              {search || gameFilter !== 'all' 
                ? "Try adjusting your filters to see more results." 
                : "It's quiet right now. Start a public game yourself and it will appear here!"}
            </p>
          </div>
        ) : (
          <div className="live-game-grid">
            {filteredSessions.map(session => (
              <LiveGameCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default LiveGamesPage;
