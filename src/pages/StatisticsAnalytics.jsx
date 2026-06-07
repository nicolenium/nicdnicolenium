
import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function StatisticsAnalytics() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto text-center py-20">
      <BarChart3 className="w-16 h-16 text-primary mx-auto mb-6" />
      <h1 className="text-3xl font-black font-serif uppercase tracking-wider mb-4">Deep Analytics</h1>
      <p className="text-muted-foreground">Comprehensive platform analytics will populate here after 30 days of data collection.</p>
    </div>
  );
}
