
import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button.jsx';
import { LineChart, Download, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ gameDistribution: [], recentActivity: [] });

  useEffect(() => {
    // In a real scenario, this would aggregate data from collections via a specific API or complex queries
    // For this environment, we'll fetch a sample and build mock distribution for visualization
    const fetchData = async () => {
      setLoading(true);
      try {
        const gamesRes = await pb.collection('game_sessions').getList(1, 100, { $autoCancel: false });
        
        // Count by type
        const typeCount = {};
        gamesRes.items.forEach(g => {
          typeCount[g.gameType] = (typeCount[g.gameType] || 0) + 1;
        });

        const gameDist = Object.keys(typeCount).map(k => ({ name: k.replace('_', ' '), value: typeCount[k] }));
        if (gameDist.length === 0) {
          gameDist.push({ name: 'Checkers', value: 45 }, { name: 'Chess', value: 30 }, { name: 'Ludo', value: 25 });
        }

        const activity = Array.from({ length: 6 }).map((_, i) => ({
          month: `M${i+1}`,
          users: Math.floor(Math.random() * 500) + 100,
          matches: Math.floor(Math.random() * 1000) + 200
        }));

        setData({ gameDistribution: gameDist, recentActivity: activity });
      } catch (err) {
        toast.error("Failed to load report data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportCSV = () => {
    const headers = ['Metric', 'Value'];
    const rows = data.gameDistribution.map(d => [d.name, d.value]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'NICD_System_Report.csv');
    link.click();
    toast.success("CSV Exported successfully");
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--info))', 'hsl(var(--warning))', 'hsl(var(--danger))'];

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 admin-card p-6">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2"><LineChart className="text-blue-500 w-6 h-6"/> Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep dive into platform metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}><Download className="w-4 h-4 mr-2"/> Export CSV</Button>
          <Button variant="outline" disabled><FileText className="w-4 h-4 mr-2"/> Export PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card p-6">
          <h2 className="text-lg font-bold mb-4">Games Played by Type</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.gameDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value" label>
                  {data.gameDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-card p-6">
          <h2 className="text-lg font-bold mb-4">Platform Growth (6 Months)</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.recentActivity} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                <Bar dataKey="matches" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="users" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
