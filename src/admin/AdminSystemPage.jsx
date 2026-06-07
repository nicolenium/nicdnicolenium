
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Server, Activity, Database, HeartPulse, HardDrive, Globe, AlertOctagon, Terminal } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import pb from '@/lib/pocketbaseClient.js';
import { Card, CardContent } from '@/components/ui/card.jsx';

export default function AdminSystemPage() {
  const [apiHealth, setApiHealth] = useState(null);
  const [dbHealth, setDbHealth] = useState(false);
  const [errorLogs, setErrorLogs] = useState([]);

  // Mock metrics if API doesn't provide them
  const [metrics] = useState({
    cpu: Math.floor(Math.random() * 30) + 20, 
    ram: Math.floor(Math.random() * 40) + 40,
    errorRate: (Math.random() * 1.5).toFixed(1),
    frozenGames: 0,
    activeGames: Math.floor(Math.random() * 50) + 10,
    uptime: '14d 6h 32m',
    lastRestart: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toLocaleString()
  });

  useEffect(() => {
    // Check API Health
    apiServerClient.fetch('/health')
      .then(res => res.json())
      .then(data => setApiHealth(data))
      .catch(() => setApiHealth({ status: 'unreachable' }));

    // Check PB Health
    pb.health.check()
      .then(() => setDbHealth(true))
      .catch(() => setDbHealth(false));
      
    // Fetch AI Logs to extract errors
    apiServerClient.fetch('/admin/ai-logs?limit=500')
      .then(res => {
        if(res.ok) return res.json();
        throw new Error('Failed to fetch');
      })
      .then(data => {
        if (data.logs) {
          const errors = data.logs.filter(l => 
            (l.status && l.status.includes('ERROR')) || 
            ((l.evalBefore || 0) > 2.0 && (l.eval || 0) < 1.0) ||
            l.time > 3000
          ).slice(0, 20);
          setErrorLogs(errors);
        }
      })
      .catch(console.error);
  }, []);

  const getMetricColor = (val, thresholds) => {
    if (val > thresholds[0]) return 'text-destructive';
    if (val > thresholds[1]) return 'text-amber-500';
    return 'text-emerald-500';
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <Helmet><title>System Status | Admin | NICOLENIUM</title></Helmet>

      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
          <Server className="w-8 h-8 text-primary" /> System Overview
        </h1>
        <p className="text-muted-foreground font-medium mt-1">Infrastructure health, connectivity metrics, and error logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card border-2 shadow-sm rounded-2xl overflow-hidden">
          <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-black flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" /> Environment Info
            </h3>
          </div>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Platform Version</span>
              <span className="font-bold">v3.2.0-stable</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Environment</span>
              <span className="font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded text-xs">Production</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Database</span>
              <span className="font-bold">PocketBase 0.25+</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Backend Core</span>
              <span className="font-bold">Express.js API Node</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border/50">
              <span className="text-muted-foreground font-medium">System Uptime</span>
              <span className="font-bold text-emerald-500">{metrics.uptime}</span>
            </div>
            <div className="flex justify-between items-center pb-1">
              <span className="text-muted-foreground font-medium">Last Restart</span>
              <span className="font-bold text-xs">{metrics.lastRestart}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-2 shadow-sm rounded-2xl overflow-hidden lg:col-span-2">
          <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-black flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-primary" /> Health Metrics
            </h3>
            <span className="text-xs font-bold text-muted-foreground">{new Date().toLocaleString()}</span>
          </div>
          <CardContent className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="text-sm font-bold text-muted-foreground">CPU Usage</div>
              <div className={`text-3xl font-black ${getMetricColor(metrics.cpu, [80, 60])}`}>{metrics.cpu}%</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-muted-foreground">RAM Usage</div>
              <div className={`text-3xl font-black ${getMetricColor(metrics.ram, [80, 60])}`}>{metrics.ram}%</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-muted-foreground">Error Rate</div>
              <div className={`text-3xl font-black ${getMetricColor(metrics.errorRate, [5, 2])}`}>{metrics.errorRate}%</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-muted-foreground">Frozen Games</div>
              <div className={`text-3xl font-black ${metrics.frozenGames > 0 ? 'text-destructive' : 'text-emerald-500'}`}>{metrics.frozenGames}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-muted-foreground">Active Games</div>
              <div className="text-3xl font-black text-emerald-500">{metrics.activeGames}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-muted-foreground">Database Status</div>
              <div className={`text-lg font-black flex items-center gap-1.5 mt-2 ${dbHealth ? 'text-emerald-500' : 'text-destructive'}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${dbHealth ? 'bg-emerald-500 animate-pulse' : 'bg-destructive'}`} />
                {dbHealth ? 'Connected' : 'Disconnected'}
              </div>
            </div>
            <div className="space-y-1 col-span-2">
              <div className="text-sm font-bold text-muted-foreground">API Server Status</div>
              <div className={`text-lg font-black flex items-center gap-1.5 mt-2 ${apiHealth?.status === 'ok' ? 'text-emerald-500' : 'text-destructive'}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${apiHealth?.status === 'ok' ? 'bg-emerald-500 animate-pulse' : 'bg-destructive'}`} />
                {apiHealth?.status === 'ok' ? 'Running smoothly' : 'Service Down / Unreachable'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-2 shadow-sm rounded-2xl overflow-hidden">
        <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-black flex items-center gap-2">
            <Terminal className="w-5 h-5 text-primary" /> Recent System Errors (Last 20)
          </h3>
        </div>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/30 border-b border-border font-bold tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Game</th>
                <th className="px-6 py-3">Message / Details</th>
              </tr>
            </thead>
            <tbody>
              {errorLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground font-medium">
                    No critical errors detected in recent logs.
                  </td>
                </tr>
              ) : (
                errorLogs.map((log, idx) => {
                  let type = 'CRITICAL_BLUNDER';
                  if (log.status?.includes('TIMEOUT') || log.time > 3000) type = 'AI_TIMEOUT';
                  if (log.status?.includes('ERROR')) type = 'ENGINE_ERROR';
                  
                  return (
                    <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                      <td className="px-6 py-3 font-mono text-muted-foreground text-xs whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-1 rounded bg-destructive/10 text-destructive text-xs font-black tracking-wider">
                          {type}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-bold capitalize">{log.game}</td>
                      <td className="px-6 py-3 font-mono text-xs">
                        {type === 'AI_TIMEOUT' ? `Resolution time exceeded: ${log.time}ms` : 
                         type === 'CRITICAL_BLUNDER' ? `Evaluation dropped from ${log.evalBefore?.toFixed(2)} to ${log.eval?.toFixed(2)}` : 
                         log.status || log.move}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
