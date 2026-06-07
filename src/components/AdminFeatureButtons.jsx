
import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Trophy, Swords, Medal, ListOrdered, Coins as HandCoins, Image, LineChart, Settings } from 'lucide-react';

const features = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard', desc: 'Platform overview', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { name: 'Users', icon: Users, path: '/admin/users', desc: 'Manage accounts', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { name: 'Tournaments', icon: Trophy, path: '/admin/tournaments', desc: 'Organize events', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { name: 'Matches', icon: Swords, path: '/admin/matches', desc: 'Live & past games', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { name: 'Results', icon: Medal, path: '/admin/results', desc: 'Match outcomes', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { name: 'Leaderboard', icon: ListOrdered, path: '/admin/leaderboard', desc: 'Global rankings', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { name: 'Sponsorship', icon: HandCoins, path: '/admin/sponsorship', desc: 'Manage partners', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { name: 'Media', icon: Image, path: '/admin/media', desc: 'Assets & content', color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { name: 'Reports', icon: LineChart, path: '/admin/reports', desc: 'Analytics & stats', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { name: 'Settings', icon: Settings, path: '/admin/settings', desc: 'Platform config', color: 'text-slate-500', bg: 'bg-slate-500/10' },
];

export default function AdminFeatureButtons() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {features.map((feature) => (
        <Link 
          key={feature.name} 
          to={feature.path}
          className="group relative bg-card border-2 border-border shadow-sm hover:shadow-md hover:border-primary/50 rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1"
        >
          <div className={`w-12 h-12 rounded-xl mb-3 flex items-center justify-center transition-transform group-hover:scale-110 ${feature.bg}`}>
            <feature.icon className={`w-6 h-6 ${feature.color}`} />
          </div>
          <h3 className="font-bold text-foreground mb-1">{feature.name}</h3>
          <p className="text-xs text-muted-foreground font-medium">{feature.desc}</p>
        </Link>
      ))}
    </div>
  );
}
