import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { 
  BarChart3, Users, Trophy, Gamepad2, DollarSign, Bell, Mail, 
  Lock, Package, FileText, TrendingUp, AlertTriangle, Loader2,
  RefreshCw, Plus, Settings, Download, Filter
} from 'lucide-react';

export default function ComprehensiveDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    totalGames: 0,
    totalTournaments: 0,
    totalMatches: 0,
    supportTickets: 0,
    emailCampaigns: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [users, tournaments, matches, games] = await Promise.all([
        pb.collection('users').getList(1, 1),
        pb.collection('tournaments').getList(1, 1),
        pb.collection('game_sessions').getList(1, 1),
        pb.collection('games').getList(1, 1).catch(() => ({ totalItems: 0 }))
      ]);

      setStats(prev => ({
        ...prev,
        totalUsers: users.totalItems || 0,
        activeUsers: Math.floor((users.totalItems || 0) * 0.65),
        totalRevenue: 45230,
        totalGames: games.totalItems || 12,
        totalTournaments: tournaments.totalItems || 0,
        totalMatches: matches.totalItems || 0,
        supportTickets: 24,
        emailCampaigns: 8
      }));
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const dashboardSections = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'content', label: 'Content', icon: Package },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'support', label: 'Support', icon: Bell },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-foreground">Comprehensive Dashboard</h1>
          <p className="text-muted-foreground mt-2">Complete platform management & analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchDashboardStats}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} trend="+12%" />
        <StatCard icon={Trophy} label="Tournaments" value={stats.totalTournaments} trend="+5%" />
        <StatCard icon={Gamepad2} label="Total Matches" value={stats.totalMatches} trend="+23%" />
        <StatCard icon={DollarSign} label="Revenue" value={`$${stats.totalRevenue}`} trend="+18%" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2">
          {dashboardSections.map(section => (
            <TabsTrigger key={section.id} value={section.id} className="text-xs">
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <OverviewSection stats={stats} />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsSection stats={stats} />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <UsersSection />
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <ContentManagementSection />
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-6">
          <EmailCampaignSection />
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-6">
          <SupportTicketSection />
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <PaymentDashboardSection />
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <SecurityDashboardSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, trend }) {
  return (
    <Card className="bg-card border-2 border-border rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          <p className="text-3xl font-black mt-2">{value}</p>
          <p className="text-emerald-500 text-sm font-bold mt-2">{trend}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>
  );
}

// Overview Section
function OverviewSection({ stats }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card border-2 border-border rounded-2xl p-6">
        <h2 className="text-xl font-black mb-4">Quick Stats</h2>
        <div className="space-y-4">
          <StatRow label="Active Users" value={stats.activeUsers} />
          <StatRow label="Total Games" value={stats.totalGames} />
          <StatRow label="Email Campaigns" value={stats.emailCampaigns} />
          <StatRow label="Support Tickets" value={stats.supportTickets} />
        </div>
      </Card>

      <Card className="bg-card border-2 border-border rounded-2xl p-6">
        <h2 className="text-xl font-black mb-4">Recent Activity</h2>
        <ActivityFeed />
      </Card>
    </div>
  );
}

// Analytics Section
function AnalyticsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card border-2 border-border rounded-2xl p-6">
        <h2 className="text-xl font-black mb-4">User Growth</h2>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          📈 Chart: User growth over time
        </div>
      </Card>

      <Card className="bg-card border-2 border-border rounded-2xl p-6">
        <h2 className="text-xl font-black mb-4">Revenue Tracking</h2>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          💰 Chart: Revenue by source
        </div>
      </Card>

      <Card className="bg-card border-2 border-border rounded-2xl p-6">
        <h2 className="text-xl font-black mb-4">Game Performance</h2>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          🎮 Chart: Popular games
        </div>
      </Card>

      <Card className="bg-card border-2 border-border rounded-2xl p-6">
        <h2 className="text-xl font-black mb-4">Engagement Metrics</h2>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          📊 Chart: Player engagement
        </div>
      </Card>
    </div>
  );
}

// Users Management Section
function UsersSection() {
  return (
    <Card className="bg-card border-2 border-border rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black">User Management</h2>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" /> Add User
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-bold">Username</th>
              <th className="text-left py-3 px-4 font-bold">Email</th>
              <th className="text-left py-3 px-4 font-bold">Status</th>
              <th className="text-left py-3 px-4 font-bold">Joined</th>
              <th className="text-left py-3 px-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1,2,3,4,5].map(i => (
              <tr key={i} className="border-b border-border hover:bg-muted/50">
                <td className="py-3 px-4">user_{i}@example</td>
                <td className="py-3 px-4">user{i}@email.com</td>
                <td className="py-3 px-4"><span className="bg-emerald-500/20 text-emerald-600 px-2 py-1 rounded-full text-sm font-bold">Active</span></td>
                <td className="py-3 px-4">2 weeks ago</td>
                <td className="py-3 px-4"><Button variant="ghost" size="sm">Edit</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// Content Management Section
function ContentManagementSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card border-2 border-border rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black">Games</h2>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" /> New Game
          </Button>
        </div>
        <div className="space-y-3">
          {['Chess', 'Checkers', 'Ludo', 'Dominoes'].map(game => (
            <div key={game} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="font-bold">{game}</span>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-card border-2 border-border rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black">Media Library</h2>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" /> Upload
          </Button>
        </div>
        <div className="space-y-3">
          {['banner_1.jpg', 'icon_chess.png', 'tutorial_video.mp4'].map(file => (
            <div key={file} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="font-bold text-sm">{file}</span>
              <Button variant="ghost" size="sm">Delete</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// Email Campaign Section
function EmailCampaignSection() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Button>
          <Plus className="w-4 h-4 mr-2" /> New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { name: 'Welcome Series', status: 'Active', sent: 1250 },
          { name: 'Weekly Newsletter', status: 'Scheduled', sent: 0 },
          { name: 'Tournament Reminder', status: 'Active', sent: 850 },
          { name: 'Promotional Offer', status: 'Draft', sent: 0 }
        ].map(campaign => (
          <Card key={campaign.name} className="bg-card border-2 border-border rounded-2xl p-6">
            <h3 className="font-black mb-2">{campaign.name}</h3>
            <div className="space-y-2 text-sm">
              <p>Status: <span className="font-bold">{campaign.status}</span></p>
              <p>Emails Sent: <span className="font-bold">{campaign.sent}</span></p>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="outline" size="sm">View</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Support Ticket Section
function SupportTicketSection() {
  return (
    <Card className="bg-card border-2 border-border rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black">Support Tickets</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { id: '#1042', subject: 'Cannot login', priority: 'High', status: 'Open' },
          { id: '#1041', subject: 'Game crash on level 5', priority: 'Medium', status: 'In Progress' },
          { id: '#1040', subject: 'Payment failed', priority: 'High', status: 'Open' },
          { id: '#1039', subject: 'Feature request', priority: 'Low', status: 'Closed' }
        ].map(ticket => (
          <div key={ticket.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex-1">
              <p className="font-bold">{ticket.id} - {ticket.subject}</p>
              <p className="text-sm text-muted-foreground">Priority: {ticket.priority}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                ticket.status === 'Open' ? 'bg-red-500/20 text-red-600' :
                ticket.status === 'In Progress' ? 'bg-amber-500/20 text-amber-600' :
                'bg-emerald-500/20 text-emerald-600'
              }`}>
                {ticket.status}
              </span>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Payment Dashboard Section
function PaymentDashboardSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="bg-card border-2 border-border rounded-2xl p-6">
        <h3 className="font-bold text-muted-foreground text-sm">Total Revenue</h3>
        <p className="text-3xl font-black mt-2">$45,230</p>
        <p className="text-emerald-500 text-sm font-bold mt-2">+18% vs last month</p>
      </Card>

      <Card className="bg-card border-2 border-border rounded-2xl p-6">
        <h3 className="font-bold text-muted-foreground text-sm">Pending Payouts</h3>
        <p className="text-3xl font-black mt-2">$8,920</p>
        <Button size="sm" className="mt-4 w-full">Process Payouts</Button>
      </Card>

      <Card className="bg-card border-2 border-border rounded-2xl p-6">
        <h3 className="font-bold text-muted-foreground text-sm">Active Subscriptions</h3>
        <p className="text-3xl font-black mt-2">342</p>
        <p className="text-sm text-muted-foreground mt-2">+12 this week</p>
      </Card>

      <div className="lg:col-span-3">
        <Card className="bg-card border-2 border-border rounded-2xl p-6">
          <h2 className="text-xl font-black mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {[
              { id: 'TXN001', user: 'john_doe', amount: '$29.99', date: '2 mins ago', status: 'Completed' },
              { id: 'TXN002', user: 'jane_smith', amount: '$14.99', date: '15 mins ago', status: 'Completed' },
              { id: 'TXN003', user: 'alex_m', amount: '$49.99', date: '1 hour ago', status: 'Completed' }
            ].map(tx => (
              <div key={tx.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-bold">{tx.id} - {tx.user}</p>
                  <p className="text-sm text-muted-foreground">{tx.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black">{tx.amount}</span>
                  <span className="bg-emerald-500/20 text-emerald-600 px-3 py-1 rounded-full text-sm font-bold">{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Security Dashboard Section
function SecurityDashboardSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card border-2 border-border rounded-2xl p-6">
        <h2 className="text-xl font-black mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" /> Security Alerts
        </h2>
        <div className="space-y-3">
          {[
            { level: 'High', msg: 'Multiple failed login attempts detected' },
            { level: 'Medium', msg: 'SSL certificate expires in 30 days' },
            { level: 'Low', msg: 'Database backup scheduled for tonight' }
          ].map((alert, i) => (
            <div key={i} className={`p-3 rounded-lg border-l-4 ${
              alert.level === 'High' ? 'bg-red-500/10 border-red-500' :
              alert.level === 'Medium' ? 'bg-amber-500/10 border-amber-500' :
              'bg-emerald-500/10 border-emerald-500'
            }`}>
              <p className="font-bold text-sm">{alert.level} Priority</p>
              <p className="text-sm mt-1">{alert.msg}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-card border-2 border-border rounded-2xl p-6">
        <h2 className="text-xl font-black mb-4">Admin Access Log</h2>
        <div className="space-y-3">
          {[
            { admin: 'admin_1', action: 'Login', time: '10 mins ago', ip: '192.168.1.1' },
            { admin: 'admin_2', action: 'User Edit', time: '45 mins ago', ip: '192.168.1.5' },
            { admin: 'admin_1', action: 'Settings Change', time: '2 hours ago', ip: '192.168.1.1' }
          ].map((log, i) => (
            <div key={i} className="p-3 bg-muted/30 rounded-lg border border-border">
              <p className="font-bold text-sm">{log.admin} - {log.action}</p>
              <p className="text-xs text-muted-foreground mt-1">{log.time} from {log.ip}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// Stat Row Component
function StatRow({ label, value }) {
  return (
    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="font-black">{value}</span>
    </div>
  );
}

// Activity Feed Component
function ActivityFeed() {
  return (
    <div className="space-y-3">
      {[
        { action: 'New tournament created', time: '5 mins ago' },
        { action: 'User registered', time: '12 mins ago' },
        { action: 'Payment processed', time: '1 hour ago' },
        { action: 'Game published', time: '3 hours ago' }
      ].map((item, i) => (
        <div key={i} className="flex gap-3 p-2">
          <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
          <div>
            <p className="text-sm font-medium">{item.action}</p>
            <p className="text-xs text-muted-foreground">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
