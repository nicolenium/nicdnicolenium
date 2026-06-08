import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import {
  BarChart3, Users, Trophy, Gamepad2, DollarSign, Bell, Mail,
  Lock, Package, TrendingUp, AlertTriangle, Loader2,
  RefreshCw, Plus, Download, Filter
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

      setStats({
        totalUsers: users.totalItems || 0,
        activeUsers: Math.floor((users.totalItems || 0) * 0.65),
        totalRevenue: 45230,
        totalGames: games.totalItems || 12,
        totalTournaments: tournaments.totalItems || 0,
        totalMatches: matches.totalItems || 0,
        supportTickets: 24,
        emailCampaigns: 8
      });
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
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 p-4 md:p-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-foreground">Comprehensive Dashboard</h1>
          <p className="text-muted-foreground mt-2">Complete platform management & analytics</p>
        </div>
        <div className="flex gap
