
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Trophy, Search, Filter, Users, Calendar, Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const TournamentsListPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: ['upcoming', 'active'],
    type: []
  });

  useEffect(() => {
    fetchTournaments();
  }, [filters]);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      let filterString = '';
      const conditions = [];

      if (filters.status.length > 0) {
        conditions.push(`(${filters.status.map(s => `status="${s}"`).join(' || ')})`);
      }
      if (filters.type.length > 0) {
        conditions.push(`(${filters.type.map(t => `tournament_format="${t}"`).join(' || ')})`);
      }

      if (conditions.length > 0) {
        filterString = conditions.join(' && ');
      }

      const records = await pb.collection('tournaments').getList(1, 50, {
        filter: filterString,
        sort: '-created',
        expand: 'hostId',
        $autoCancel: false
      });
      setTournaments(records.items);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (category, value) => {
    setFilters(prev => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const filteredTournaments = tournaments.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.gameType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return 'bg-[hsl(var(--tournament-upcoming))/0.2] text-[hsl(var(--tournament-upcoming))] border-[hsl(var(--tournament-upcoming))/30]';
      case 'active': return 'bg-[hsl(var(--tournament-ongoing))/0.2] text-[hsl(var(--tournament-ongoing))] border-[hsl(var(--tournament-ongoing))/30]';
      case 'completed': return 'bg-[hsl(var(--tournament-completed))/0.2] text-[hsl(var(--tournament-completed))] border-[hsl(var(--tournament-completed))/30]';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet><title>Tournaments - NICD PRODUCTIONS</title></Helmet>
      
      <div className="bg-card border-b border-border py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.1)_0%,transparent_40%)] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Tournaments</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">Compete against players worldwide, climb the leaderboards, and win prizes.</p>
            </div>
            {isAuthenticated && (
              <Button size="lg" onClick={() => navigate('/tournaments/create')} className="shrink-0 shadow-lg shadow-primary/20">
                <Plus className="w-5 h-5 mr-2" /> Create Tournament
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search tournaments..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-border text-foreground"
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Filter className="w-4 h-4" /> Status
            </h3>
            <div className="space-y-2">
              {['upcoming', 'active', 'completed'].map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`status-${status}`} 
                    checked={filters.status.includes(status)}
                    onCheckedChange={() => handleFilterChange('status', status)}
                  />
                  <Label htmlFor={`status-${status}`} className="capitalize text-muted-foreground cursor-pointer">{status}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Format
            </h3>
            <div className="space-y-2">
              {['Public', 'Invite-Only', 'Friends/Family', 'Registered Users'].map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`type-${type}`} 
                    checked={filters.type.includes(type)}
                    onCheckedChange={() => handleFilterChange('type', type)}
                  />
                  <Label htmlFor={`type-${type}`} className="text-muted-foreground cursor-pointer">{type}</Label>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="bg-card border-border overflow-hidden">
                  <CardHeader className="pb-4"><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2" /></CardHeader>
                  <CardContent className="space-y-4"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /></CardContent>
                  <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredTournaments.length === 0 ? (
            <div className="text-center py-24 bg-card border border-border rounded-2xl">
              <Trophy className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No tournaments found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or search query.</p>
              <Button variant="outline" onClick={() => {setSearchQuery(''); setFilters({status: [], type: []});}}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTournaments.map(tournament => (
                <Card key={tournament.id} className="bg-card border-border hover:border-primary/50 transition-all duration-300 flex flex-col h-full group">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-secondary text-secondary-foreground border-border capitalize">
                        {tournament.gameType.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className={`capitalize border ${getStatusColor(tournament.status)}`}>
                        {tournament.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {tournament.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2 h-10">
                      {tournament.description || 'No description provided.'}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3 flex-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2 text-primary/70" />
                      <span>{tournament.currentPlayers || 0} / {tournament.maxPlayers} Players</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2 text-primary/70" />
                      <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Trophy className="w-4 h-4 mr-2 text-primary/70" />
                      <span>{tournament.tournament_format}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-border mt-auto">
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                      <Link to={`/tournaments/${tournament.id}`}>
                        View Details <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TournamentsListPage;
