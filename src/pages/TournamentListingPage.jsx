
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Search, Calendar, Users, Trophy, Filter, Lock } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { useGameTypeIcon } from '@/hooks/useGameTypeIcon.js';

const TournamentListingPage = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGameType, setFilterGameType] = useState('all');
  const [sortBy, setSortBy] = useState('date_asc');
  const { getGameTypeInfo } = useGameTypeIcon();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const records = await pb.collection('tournaments').getFullList({
        sort: 'startDate',
        $autoCancel: false
      });
      setTournaments(records);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTournaments = tournaments
    .filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(t => filterGameType === 'all' || (t.gameType || t.game_type) === filterGameType)
    .sort((a, b) => {
      if (sortBy === 'date_asc') return new Date(a.startDate) - new Date(b.startDate);
      if (sortBy === 'date_desc') return new Date(b.startDate) - new Date(a.startDate);
      if (sortBy === 'players') return (b.currentPlayers || 0) - (a.currentPlayers || 0);
      return 0;
    });

  const getStatusBadge = (status, current, max) => {
    if (current >= max) return <Badge variant="destructive" className="font-bold">{t('tournaments.full')}</Badge>;
    if (status === 'active') return <Badge className="bg-emerald-500 font-bold">{t('tournaments.active')}</Badge>;
    if (status === 'completed') return <Badge variant="secondary" className="font-bold">{t('tournaments.completed')}</Badge>;
    return <Badge variant="default" className="bg-blue-500 font-bold">{t('tournaments.upcoming')}</Badge>;
  };

  return (
    <div className="flex-1 container mx-auto px-4 py-16 md:py-24 max-w-7xl">
      <Helmet><title>{t('tournaments.title')} | NICD Productions</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{t('tournaments.title')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {t('tournaments.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border shadow-md">
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <Filter className="w-5 h-5" /> {t('common.filter')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder={t('tournaments.search')} 
                    className="pl-9 bg-background text-foreground"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">{t('tournaments.gameType')}</label>
                <Select value={filterGameType} onValueChange={setFilterGameType}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Games" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Games</SelectItem>
                    <SelectItem value="chess">Chess</SelectItem>
                    <SelectItem value="checkers_8x8">Checkers (8x8)</SelectItem>
                    <SelectItem value="checkers_10x10">Checkers (10x10)</SelectItem>
                    <SelectItem value="ludo">Ludo</SelectItem>
                    <SelectItem value="tictactoe">Tic Tac Toe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">{t('tournaments.sortBy')}</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_asc">Date (Earliest First)</SelectItem>
                    <SelectItem value="date_desc">Date (Latest First)</SelectItem>
                    <SelectItem value="players">Most Players</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tournament Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="animate-pulse bg-card border-border shadow-sm">
                  <CardHeader className="h-32 bg-muted/50 rounded-t-xl" />
                  <CardContent className="p-6 space-y-4">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTournaments.length === 0 ? (
            <div className="text-center py-24 bg-card rounded-2xl border border-dashed border-border">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="text-xl font-bold mb-2">{t('tournaments.noTournaments')}</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTournaments.map((tournament) => {
                const { icon: GameIcon, color, bg } = getGameTypeInfo(tournament.gameType || tournament.game_type);
                const currentPlayers = tournament.currentPlayers || 0;
                const fillPercentage = Math.min(100, (currentPlayers / tournament.maxPlayers) * 100);
                
                return (
                  <Card key={tournament.id} className="flex flex-col bg-card border-border shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${bg} ${color} border border-white/5 shadow-sm`}>
                          <GameIcon className="w-6 h-6" />
                        </div>
                        {getStatusBadge(tournament.status, currentPlayers, tournament.maxPlayers)}
                      </div>
                      <CardTitle className="text-xl line-clamp-1 leading-tight group-hover:text-primary transition-colors">{tournament.name}</CardTitle>
                      <div className="flex items-center text-xs font-bold text-muted-foreground mt-2 uppercase tracking-wider">
                        <Calendar className="w-3 h-3 mr-1.5" />
                        {new Date(tournament.startDate).toLocaleDateString(undefined, { 
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 pb-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="flex items-center text-muted-foreground">
                            <Users className="w-4 h-4 mr-1.5" /> {t('tournaments.spots')}
                          </span>
                          <span>{currentPlayers} / {tournament.maxPlayers}</span>
                        </div>
                        <Progress value={fillPercentage} className="h-2 bg-muted" />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4 border-t border-border/50 bg-muted/10">
                      <Button asChild className="w-full font-bold group/btn" variant="secondary">
                        <Link to={`/tournaments/${tournament.id}`}>
                          {t('tournaments.viewDetails')} 
                          {!isAuthenticated && <Lock className="w-3.5 h-3.5 ml-2 opacity-50" />}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentListingPage;
