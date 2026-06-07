
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Helmet } from 'react-helmet';
import { Trophy, Target, TrendingUp, Clock, LogOut } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const PlayerDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [stats, setStats] = useState({
    totalGames: 0,
    totalScore: 0,
    averageScore: 0,
    bestScore: 0,
    trivia: 0,
    word_games: 0,
    puzzles: 0,
    team_competitions: 0
  });
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayerStats();
  }, []);

  const loadPlayerStats = async () => {
    try {
      const sessions = await pb.collection('game_sessions').getFullList({
        filter: `userId = "${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false
      });

      const totalGames = sessions.length;
      const totalScore = sessions.reduce((sum, s) => sum + s.score, 0);
      const averageScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
      const bestScore = sessions.length > 0 ? Math.max(...sessions.map(s => s.score)) : 0;

      const gameTypeScores = {
        trivia: sessions.filter(s => s.gameType === 'trivia').reduce((sum, s) => sum + s.score, 0),
        word_games: sessions.filter(s => s.gameType === 'word_games').reduce((sum, s) => sum + s.score, 0),
        puzzles: sessions.filter(s => s.gameType === 'puzzles').reduce((sum, s) => sum + s.score, 0),
        team_competitions: sessions.filter(s => s.gameType === 'team_competitions').reduce((sum, s) => sum + s.score, 0)
      };

      setStats({
        totalGames,
        totalScore,
        averageScore,
        bestScore,
        ...gameTypeScores
      });

      setRecentGames(sessions.slice(0, 10));
      setLoading(false);
    } catch (error) {
      console.error('Failed to load stats:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatGameType = (type) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Dashboard - NICD PRODUCTIONS</title>
        </Helmet>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - NICD PRODUCTIONS</title>
        <meta name="description" content="View your gaming stats and progress" />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Profile Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold">Welcome back, {currentUser?.username}</h1>
                <p className="text-muted-foreground mt-1">
                  Member since {formatDate(currentUser?.join_date || currentUser?.created)}
                </p>
              </div>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Games</CardTitle>
                  <Target className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stats.totalGames}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Score</CardTitle>
                  <Trophy className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stats.totalScore}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stats.averageScore}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Best Score</CardTitle>
                  <Trophy className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stats.bestScore}</div>
                </CardContent>
              </Card>
            </div>

            {/* Game Type Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Score by Game Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Trivia</p>
                    <p className="text-2xl font-bold text-primary">{stats.trivia}</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Word Games</p>
                    <p className="text-2xl font-bold text-primary">{stats.word_games}</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Puzzles</p>
                    <p className="text-2xl font-bold text-primary">{stats.puzzles}</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Team Competitions</p>
                    <p className="text-2xl font-bold text-primary">{stats.team_competitions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Games */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Games</CardTitle>
              </CardHeader>
              <CardContent>
                {recentGames.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No games played yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentGames.map((game) => (
                      <div key={game.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{formatGameType(game.gameType)}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(game.created)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">{game.score}</p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PlayerDashboard;
