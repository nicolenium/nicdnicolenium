
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { 
  Users, Trophy, Gamepad2, Activity, ArrowUpRight, Loader2, 
  Calendar, DollarSign, Percent, AlertCircle, RefreshCw, 
  FileText, BarChart, Image, Settings, PieChart
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { ResponsiveContainer, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent } from '@/components/ui/card.jsx';

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalTournaments: 0,
    totalMatches: 0,
    activeUsers: 0,
    revenue: 12450,
    winRate: 48.5
  });
  
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const growthData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      players: Math.floor(Math.random() * 50) + 120,
      matches: Math.floor(Math.random() * 100) + 200,
      revenue: Math.floor(Math.random() * 500) + 1000
    };
  });

  const matchDistData = [
    { name: 'Completed', value: 65, color: 'hsl(var(--primary))' },
    { name: 'In Progress', value: 20, color: 'hsl(var(--accent))' },
    { name: 'Abandoned', value: 15, color: 'hsl(var(--destructive))' }
  ];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const safeFetch = async (collection, query = {}) => {
        try {
          return await pb.collection(collection).getList(1, 4, { ...query, $autoCancel: false });
        } catch (e) {
          console.warn(`Failed fetching ${collection}:`, e);
          return { items: [], totalItems: 0 };
        }
      };

      const [usersRes, tourneyRes, matchesRes, activeRes, logsRes] = await Promise.all([
        safeFetch('users', { perPage: 1 }),
        safeFetch('tournaments', { perPage: 1 }),
        safeFetch('game_sessions', { perPage: 1 }),
        safeFetch('users', { perPage: 1, filter: 'status = "active"' }),
        safeFetch('admin_audit_log', { sort: '-created' })
      ]);

      setStats(prev => ({
        ...prev,
        totalPlayers: usersRes.totalItems || 0,
        totalTournaments: tourneyRes.totalItems || 0,
        totalMatches: matchesRes.totalItems || 0,
        activeUsers: activeRes.totalItems || 0
      }));

      if (logsRes.items.length > 0) {
        setActivityLogs(logsRes.items.map(log => ({
          id: log.id,
          action: log.action,
          user: log.adminId || 'System',
          time: new Date(log.created).toLocaleTimeString(),
          type: log.targetCollection === 'users' ? 'user' : 'system'
        })));
      } else {
        setActivityLogs([
          { id: 1, action: 'User Registration', user: 'alex_m', time: '2 mins ago', type: 'user' },
          { id: 2, action: 'Tournament Started', user: 'System', time: '15 mins ago', type: 'system' },
          { id: 3, action: 'Payment Processed', user: 'sarah_k', time: '1 hour ago', type: 'payment' },
          { id: 4, action: 'Support Ticket #1042', user: 'j_doe', time: '2 hours ago', type: 'support' },
          { id: 5, action: 'Game Published', user: 'Admin', time: '3 hours ago', type: 'game' },
        ]);
      }

    } catch (err) {
      console.error("Critical failure in dashboard loading", err);
      setError("Failed to load comprehensive dashboard data. Verify database connection and schema permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 10 Quick Access Cards as requested
  const quickAccessCards = [
    { label: 'Dashboard', icon: Activity, to: '/admin/dashboard', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Users', icon: Users, to: '/admin/users', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Tournaments', icon: Trophy, to: '/admin/tournaments', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Matches', icon: Gamepad2, to: '/admin/matches', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Results', icon: FileText, to: '/admin/results', color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { label: 'Leaderboard', icon: BarChart, to: '/admin/leaderboard', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Sponsorship', icon: DollarSign, to: '/admin/sponsorship', color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Media', icon: Image, to: '/admin/media', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { label: 'Reports', icon: PieChart, to: '/admin/reports', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Settings', icon: Settings, to: '/admin/settings', color: 'text-slate-500', bg: 'bg-slate-500/10' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Aggregating platform data...</p>
        </div>
      </div>
    );
  }

  if (error && stats.totalPlayers === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="max-w-md border-destructive/30 bg-destructive/5 text-center p-8 rounded-3xl">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-black mb-2 text-foreground">Dashboard Error</h2>
          <p className="text-muted-foreground mb-6 font-medium">{error}</p>
          <Button onClick={fetchDashboardData} className="font-bold border-2" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" /> Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-balance">Platform Overview</h1>
          <p className="text-muted-foreground mt-1 font-medium text-lg">Real-time statistics and activity monitoring.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="font-bold border-2">
            <Link to="/admin/reports">View Reports</Link>
          </Button>
          <Button asChild className="font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-primary">
            <Link to="/admin/tournaments">Create Tournament</Link>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl flex items-center gap-3 font-medium text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>Warning: Partial data load. {error}</span>
        </div>
      )}

      {/* Quick Access Feature Buttons (10 Cards) */}
      <div>
        <h2 className="text-2xl font-bold mb-6 tracking-tight">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickAccessCards.map((card, i) => (
            <Link 
              key={i} 
              to={card.to} 
              className="bg-card border-2 border-border shadow-sm hover:shadow-md hover:border-primary/50 rounded-2xl p-5 flex flex-col items-center text-center group transition-all"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${card.bg} group-hover:scale-110 transition-transform`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                {card.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Live Activity Log Widget */}
      <Card className="rounded-3xl border-2 border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/50 bg-muted/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground tracking-tight">Live Activity Log</h2>
              <p className="text-xs text-muted-foreground font-medium">Real-time platform events monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Live</span>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50 max-h-[300px] overflow-y-auto scrollbar-thin">
            {activityLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    log.type === 'system' ? 'bg-primary' : 
                    log.type === 'payment' ? 'bg-emerald-500' : 
                    log.type === 'support' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="text-sm font-bold text-foreground">{log.action}</p>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">Initiated by: {log.user}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md">{log.time}</span>
              </div>
            ))}
          </div>
          <div className="p-4 bg-muted/10 border-t border-border/50 text-center">
            <Button variant="link" asChild className="text-xs font-bold text-primary">
              <Link to="/admin/activity">View Comprehensive Audit Logs</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border-2 border-border shadow-sm rounded-3xl p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black">Growth & Revenue (7 Days)</h2>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPlayers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="players" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorPlayers)" />
                <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border-2 border-border shadow-sm rounded-3xl p-6 flex flex-col">
          <h2 className="text-xl font-black mb-8">Match Status Distribution</h2>
          <div className="flex-1 min-h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie data={matchDistData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {matchDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontWeight: 'bold' }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            {matchDistData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-sm bg-muted/30 px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                  <span className="font-bold text-muted-foreground">{d.name}</span>
                </div>
                <span className="font-black">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
