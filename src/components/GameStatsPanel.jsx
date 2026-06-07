
import React from 'react';
import { Trophy, TrendingUp, Clock, Crosshair } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';

const GameStatsPanel = () => {
  const stats = [
    { label: "Win Rate", value: "64%", icon: Trophy, color: "text-yellow-500" },
    { label: "Current ELO", value: "1450", icon: TrendingUp, color: "text-blue-500" },
    { label: "Avg Duration", value: "12m 40s", icon: Clock, color: "text-green-500" },
    { label: "Best Tactic", value: "Double Jump", icon: Crosshair, color: "text-purple-500" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, i) => (
        <Card key={i}>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
            <stat.icon className={`w-8 h-8 mb-2 ${stat.color}`} />
            <div className="text-2xl font-bold tabular-nums">{stat.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GameStatsPanel;
