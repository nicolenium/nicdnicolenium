
import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Helmet } from 'react-helmet';
import { Trophy, Medal, Award, Gamepad2, Search, Filter, Clock, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { ALL_GAMES } from '@/config/gamePosterConfig.js';

const LeaderboardPage = () => {
  const { t } = useLanguage();
  const [leaderboards, setLeaderboards] = useState({ all: [] });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Advanced Filters
  const [modeFilter, setModeFilter] = useState('all');
  const [timeControlFilter, setTimeControlFilter] = useState('all');
  
  useEffect(() => {
    loadLeaderboards();
  }, [modeFilter, timeControlFilter]);

  const loadLeaderboards = async () => {
    setLoading(true);
    try {
      let filterStr = '';
      const filters = [];
      if (modeFilter !== 'all') filters.push(`mode = "${modeFilter}"`);
      if (timeControlFilter !== 'all') filters.push(`timeControl = "${timeControlFilter}"`);
      if (filters.length > 0) filterStr = filters.join(' && ');

      // Load standard games without expanding userId to prevent 400 errors
      const sessions = await pb.collection('game_sessions').getFullList({ 
        sort: '-score', 
        filter: filterStr,
        $autoCancel: false 
      });
      
      // Fetch users separately to map them
      const users = await pb.collection('users').getFullList({ $autoCancel: false });
      const userMap = {};
      users.forEach(u => userMap[u.id] = u);
      
      const userStats = {};
      
      sessions.forEach(s => {
        const uid = s.player1Id;
        if (!uid || !userMap[uid]) return; // Skip if not a valid registered user
        
        if (!userStats[uid]) {
          userStats[uid] = { 
            user: userMap[uid], 
            totalScore: 0, 
            gamesPlayed: 0, 
            totalMoves: 0, 
            totalTimeUsed: 0 
          };
        }
        userStats[uid].totalScore += (s.score || 0);
        userStats[uid].gamesPlayed += 1;
        userStats[uid].totalMoves += (s.moveCount || 0);
        userStats[uid].totalTimeUsed += (s.timeUsed || 0);
        
        const type = s.gameType;
        if (!userStats[uid][type]) userStats[uid][type] = 0;
        userStats[uid][type] += (s.score || 0);
      });

      const allScores = Object.values(userStats).map(item => ({
        id: item.user.id, 
        user: item.user, 
        username: item.user.username || item.user.name || 'Unknown Player', 
        totalScore: item.totalScore, 
        gamesPlayed: item.gamesPlayed,
        avgMoveTime: item.totalMoves > 0 ? (item.totalTimeUsed / item.totalMoves).toFixed(1) : 0,
        totalMoves: item.totalMoves,
        ...item
      }));

      const finalBoards = {
        all: allScores.sort((a, b) => b.totalScore - a.totalScore).slice(0, 100),
      };

      ALL_GAMES.forEach(g => {
        finalBoards[g.id] = allScores.sort((a, b) => (b[g.id]||0) - (a[g.id]||0)).filter(x => x[g.id] > 0).slice(0, 100);
      });

      setLeaderboards(finalBoards);
    } catch (error) { 
      console.error('Failed to load leaderboards:', error); 
    } finally { 
      setLoading(false); 
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-secondary drop-shadow-md" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300 drop-shadow-md" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600 drop-shadow-md" />;
    return <span className="text-muted-foreground font-bold w-6 text-center">{rank}</span>;
  };

  const LeaderboardTable = ({ data, scoreKey = 'totalScore' }) => {
    const filtered = data.filter(p => p.username?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return (
      <div className="space-y-3 mt-6">
        {filtered.length === 0 ? (
          <Card className="border-border bg-card/50">
            <CardContent className="py-16 text-center">
              <Gamepad2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">{t('leaderboard.noScores')}</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((player, index) => {
            const avatarUrl = player.user?.avatar 
              ? pb.files.getUrl(player.user, player.user.avatar) 
              : player.user?.profile_picture 
                ? pb.files.getUrl(player.user, player.user.profile_picture) 
                : null;

            return (
              <Card key={player.id || index} className={`bg-card transition-all ${index === 0 ? 'border-secondary shadow-glow-gold scale-[1.02] z-10 relative' : 'border-border hover:border-primary/30'}`}>
                <CardContent className="py-4 px-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-5 w-full md:w-auto">
                      <div className="w-8 flex justify-center">{getRankIcon(index + 1)}</div>
                      <Avatar className={`w-12 h-12 border-2 ${index === 0 ? 'border-secondary shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'border-border'}`}>
                        {avatarUrl ? (
                          <AvatarImage src={avatarUrl} />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">{player.username?.charAt(0).toUpperCase()}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className={`font-bold text-lg ${index === 0 ? 'text-primary' : 'text-foreground'}`}>{player.username}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
                          {player.gamesPlayed} games played
                        </p>
                      </div>
                    </div>
                    
                    {/* Advanced Stats Metrics */}
                    <div className="flex items-center gap-6 text-sm ml-12 md:ml-0 md:mr-6">
                      <div className="flex flex-col text-center">
                        <span className="text-muted-foreground text-[10px] uppercase font-bold flex items-center gap-1"><Activity className="w-3 h-3"/> {t('leaderboard.moves')}</span>
                        <span className="font-semibold">{player.totalMoves || 0}</span>
                      </div>
                      <div className="flex flex-col text-center">
                        <span className="text-muted-foreground text-[10px] uppercase font-bold flex items-center gap-1"><Clock className="w-3 h-3"/> {t('leaderboard.avgTime')}</span>
                        <span className="font-semibold">{player.avgMoveTime > 0 ? `${player.avgMoveTime}s` : '-'}</span>
                      </div>
                    </div>

                    <div className="text-right w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-none border-border/50">
                      <p className={`text-3xl font-black ${index === 0 ? 'text-secondary drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]' : 'text-foreground'}`}>{player[scoreKey] || player.score || 0}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">{t('leaderboard.points')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    );
  };

  return (
    <>
      <Helmet><title>NICD NICOLENIUM - {t('leaderboard.title')}</title></Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-5xl font-black text-primary uppercase tracking-tight">
                NICD NICOLENIUM {t('leaderboard.title')}
              </h1>
              <p className="text-secondary font-bold tracking-widest uppercase text-sm">
                {t('leaderboard.subtitle')}
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground rtl:right-3 rtl:left-auto" />
                <Input 
                  placeholder={t('common.search')} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rtl:pr-10 rtl:pl-3 bg-background border-border"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <Select value={modeFilter} onValueChange={setModeFilter}>
                  <SelectTrigger className="w-[180px] bg-background border-border">
                    <Filter className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    <SelectValue placeholder={t('leaderboard.gameMode')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="human_vs_human">Human vs Human</SelectItem>
                    <SelectItem value="human_vs_computer">Human vs Computer</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={timeControlFilter} onValueChange={setTimeControlFilter}>
                  <SelectTrigger className="w-[180px] bg-background border-border">
                    <Clock className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    <SelectValue placeholder={t('leaderboard.timeControl')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('leaderboard.timeControl')}</SelectItem>
                    <SelectItem value="blitz">Blitz</SelectItem>
                    <SelectItem value="rapid">Rapid</SelectItem>
                    <SelectItem value="classical">Classical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <div className="overflow-x-auto pb-4 hide-scrollbar">
                  <TabsList className="inline-flex w-max h-auto p-1 bg-muted/50 rounded-xl">
                    <TabsTrigger value="all" className="px-4 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-sm">
                      {t('leaderboard.all')}
                    </TabsTrigger>
                    {ALL_GAMES.map(g => (
                      <TabsTrigger key={g.id} value={g.id} className="px-4 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-sm whitespace-nowrap">
                        {g.name || g.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <TabsContent value="all"><LeaderboardTable data={leaderboards.all} scoreKey="totalScore" /></TabsContent>
                {ALL_GAMES.map(g => (
                  <TabsContent key={g.id} value={g.id}>
                    <LeaderboardTable data={leaderboards[g.id] || []} scoreKey={['flappy_bird', 'snake', 'pacman', '2048', 'space_invaders', 'breakout'].includes(g.id) ? 'totalScore' : g.id} />
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default LeaderboardPage;
