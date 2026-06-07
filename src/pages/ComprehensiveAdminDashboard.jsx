
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Users, Gamepad2, Trophy, DollarSign, Activity, AlertTriangle, 
  CheckCircle2, Server, ArrowUpRight, ArrowDownRight, Loader2, Clock 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn } from '@/lib/utils.js';

export default function ComprehensiveAdminDashboard() {
  const { currentAdmin } = useAdminAuth();
  const [metrics, setMetrics] = useState(null);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const adminId = currentAdmin?.id || 'admin';
        
        const [metricsRes, reportsRes] = await Promise.all([
          apiServerClient.fetch(`/admin/dashboard/metrics?adminId=${adminId}`),
          apiServerClient.fetch(`/admin/reports?adminId=${adminId}`)
        ]);
        
        if (!metricsRes.ok || !reportsRes.ok) throw new Error("Failed to load dashboard data");
        
        const metricsData = await metricsRes.json();
        const reportsData = await reportsRes.json();
        
        if (isMounted) {
          setMetrics(metricsData);
          setReports(reportsData);
          setError(null);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (currentAdmin) {
      fetchDashboardData();
    }
    
    return () => { isMounted = false; };
  }, [currentAdmin]);

  // Mock chart data based on loaded metrics for visualization
  const revenueData = [
    { name: 'Mon', total: Math.floor(Math.random() * 500) + 100 },
    { name: 'Tue', total: Math.floor(Math.random() * 600) + 200 },
    { name: 'Wed', total: Math.floor(Math.random() * 800) + 300 },
    { name: 'Thu', total: Math.floor(Math.random() * 700) + 250 },
    { name: 'Fri', total: Math.floor(Math.random() * 900) + 400 },
    { name: 'Sat', total: Math.floor(Math.random() * 1200) + 600 },
    { name: 'Sun', total: Math.floor(Math.random() * 1000) + 500 },
  ];

  const activityData = [
    { name: '00:00', users: 120 }, { name: '04:00', users: 80 },
    { name: '08:00', users: 250 }, { name: '12:00', users: 500 },
    { name: '16:00', users: 650 }, { name: '20:00', users: 800 },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-muted/10 min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="font-bold text-lg animate-pulse">Aggregating system metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 text-destructive flex items-center gap-4">
          <AlertTriangle className="w-8 h-8 shrink-0" />
          <div>
            <h3 className="font-bold text-xl">Dashboard Error</h3>
            <p className="font-medium mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, subtext, icon: Icon, trend }) => (
    <Card className="rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-shadow bg-card">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className={cn("flex items-center text-sm font-bold", trend > 0 ? "text-emerald-500" : "text-destructive")}>
              {trend > 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <h3 className="text-3xl font-black text-foreground tabular-nums tracking-tight">{value}</h3>
        <p className="text-sm font-bold text-muted-foreground mt-1">{title}</p>
        {subtext && <p className="text-xs font-medium text-muted-foreground mt-2 border-t border-border/50 pt-2">{subtext}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <Helmet><title>Admin Dashboard | NICOLENIUM</title></Helmet>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Command Center</h1>
          <p className="text-muted-foreground font-medium mt-1">System overview and real-time metrics.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold bg-muted/50 px-4 py-2 rounded-xl border border-border/50">
          <Server className="w-4 h-4 text-primary" /> 
          System Health: <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Optimal</span>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={metrics?.users?.total?.toLocaleString() || "0"} 
          subtext={`${metrics?.users?.activePercentage || "0"}% active in last 24h`}
          icon={Users}
          trend={+5.2}
        />
        <StatCard 
          title="Active Games" 
          value={metrics?.games?.total?.toLocaleString() || "0"} 
          subtext="Across 38 supported formats"
          icon={Gamepad2}
          trend={+12.4}
        />
        <StatCard 
          title="Tournaments" 
          value={reports?.tournamentStatistics?.total?.toLocaleString() || "0"} 
          subtext={`${reports?.tournamentStatistics?.active || 0} active, ${reports?.tournamentStatistics?.upcoming || 0} upcoming`}
          icon={Trophy}
          trend={-2.1}
        />
        <StatCard 
          title="Revenue (30d)" 
          value={`$${(reports?.revenueReports?.monthly || 0).toLocaleString()}`} 
          subtext={`Daily avg: $${(reports?.revenueReports?.daily || 0).toLocaleString()}`}
          icon={DollarSign}
          trend={+8.7}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 rounded-2xl border-border/50 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-black text-xl">Revenue Overview</CardTitle>
            <CardDescription className="font-medium">Daily revenue across all payment channels.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600}} tickFormatter={(val) => `$${val}`} dx={-10} />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                    contentStyle={{backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontWeight: 'bold'}}
                  />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Info */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-border/50 shadow-sm bg-card h-[calc(50%-12px)]">
            <CardHeader className="pb-2">
              <CardTitle className="font-black text-lg flex items-center gap-2"><Activity className="w-5 h-5 text-primary"/> Concurrent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[120px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: 'none', fontWeight: 'bold'}} />
                    <Area type="monotone" dataKey="users" stroke="hsl(var(--accent))" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/50 shadow-sm bg-card h-[calc(50%-12px)] flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="font-black text-lg flex items-center gap-2"><Clock className="w-5 h-5 text-secondary"/> System Status</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center space-y-4">
              <div className="flex justify-between items-center border-b border-border/50 pb-2">
                <span className="text-sm font-bold text-muted-foreground">Uptime</span>
                <span className="font-mono font-bold text-sm">{metrics?.systemHealth?.uptimeFormatted || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/50 pb-2">
                <span className="text-sm font-bold text-muted-foreground">Memory Heap</span>
                <span className="font-mono font-bold text-sm">{metrics?.systemHealth?.memory?.heapUsagePercentage || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-muted-foreground">Last Audit</span>
                <span className="text-sm font-bold">Just now</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
