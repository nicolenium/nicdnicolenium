
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Cpu, RefreshCcw, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { Button } from '@/components/ui/button.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';

export default function AiDebugPanel() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameFilter, setGameFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  const fetchLogs = async () => {
    try {
      const response = await apiServerClient.fetch('/admin/ai-logs?limit=100');
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Failed to fetch AI logs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchGame = gameFilter === 'all' || (log.game && log.game.toLowerCase().replace(/[^a-z0-9]/g, '') === gameFilter.toLowerCase().replace(/[^a-z0-9]/g, ''));
    const matchLevel = levelFilter === 'all' || (log.level && log.level.toLowerCase() === levelFilter.toLowerCase());
    return matchGame && matchLevel;
  });

  const analyzeLog = (log) => {
    let isFail = false;
    let reasons = [];
    const gameNorm = log.game?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
    const levelNorm = log.level?.toLowerCase() || '';

    if (levelNorm === 'hard') {
      if (['chess', 'ludo', 'connectfour', 'dominoes'].includes(gameNorm) && log.depth < 6) {
        isFail = true; reasons.push(`Depth < 6 (${log.depth})`);
      }
      if (gameNorm === 'checkers10x10' && log.depth < 8) {
        isFail = true; reasons.push(`Depth < 8 (${log.depth})`);
      }
      if (gameNorm === 'checkers8x8' && log.depth < 10) {
        isFail = true; reasons.push(`Depth < 10 (${log.depth})`);
      }
    }
    if (log.time > 2000) {
      isFail = true; reasons.push(`Time > 2s (${log.time}ms)`);
    }
    const evalDrop = (log.evalBefore || 0) - (log.eval || 0);
    if (evalDrop > 3.0) {
      isFail = true; reasons.push(`Eval drop > 3 (${evalDrop.toFixed(1)})`);
    }
    if ((log.evalBefore || 0) > 2.0 && (log.eval || 0) < 1.0) {
      isFail = true; reasons.push(`Critical blunder`);
    }
    if (log.status?.includes('ERROR')) {
      isFail = true; reasons.push(log.status);
    }

    return { isFail, reasons };
  };

  const avgDepth = logs.length ? (logs.reduce((acc, l) => acc + (l.depth || 0), 0) / logs.length).toFixed(1) : 0;
  const avgEval = logs.length ? (logs.reduce((acc, l) => acc + (l.eval || 0), 0) / logs.length).toFixed(2) : 0;
  const avgTime = logs.length ? (logs.reduce((acc, l) => acc + (l.time || 0), 0) / logs.length).toFixed(0) : 0;

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <Helmet><title>AI Debug Panel | Admin | NICOLENIUM</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Cpu className="w-8 h-8 text-primary" /> AI Debug Panel
          </h1>
          <p className="text-muted-foreground font-medium mt-1">Real-time telemetry and engine performance tracking.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={gameFilter} onValueChange={setGameFilter}>
            <SelectTrigger className="w-full sm:w-[160px] font-bold border-2"><SelectValue placeholder="All Games" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Games</SelectItem>
              <SelectItem value="chess">Chess</SelectItem>
              <SelectItem value="checkers8x8">Checkers 8x8</SelectItem>
              <SelectItem value="checkers10x10">Checkers 10x10</SelectItem>
              <SelectItem value="ludo">Ludo</SelectItem>
              <SelectItem value="connectfour">Connect Four</SelectItem>
              <SelectItem value="tictactoe">Tic Tac Toe</SelectItem>
              <SelectItem value="dominoes">Dominoes</SelectItem>
            </SelectContent>
          </Select>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full sm:w-[140px] font-bold border-2"><SelectValue placeholder="All Levels" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
              <SelectItem value="impossible">Impossible</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchLogs} variant="outline" size="icon" className="shrink-0 border-2 rounded-xl">
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-2 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">Total Moves</div>
            <div className="text-3xl font-black text-foreground">{logs.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-2 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">Avg Depth</div>
            <div className="text-3xl font-black text-primary flex items-center gap-2">
              {avgDepth} <span className="text-sm opacity-60 font-medium">ply</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-2 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">Avg Eval</div>
            <div className="text-3xl font-black text-foreground">
              {avgEval}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-2 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">Avg Time</div>
            <div className="text-3xl font-black text-foreground flex items-center gap-2">
              {avgTime} <span className="text-sm opacity-60 font-medium">ms</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden h-[600px] flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/80 border-b border-border font-bold tracking-wider text-muted-foreground sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Game</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Depth</th>
                <th className="px-4 py-3">Eval (B &rarr; A)</th>
                <th className="px-4 py-3">Time(s)</th>
                <th className="px-4 py-3">Move</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-muted-foreground font-medium">
                    {loading ? 'Connecting to telemetry stream...' : 'No AI moves logged in this scope.'}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, idx) => {
                  const analysis = analyzeLog(log);
                  return (
                    <tr key={idx} className={`border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors ${analysis.isFail ? 'bg-destructive/10' : ''}`}>
                      <td className="px-4 py-3 font-mono text-muted-foreground whitespace-nowrap text-xs">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second:'2-digit' })}
                      </td>
                      <td className="px-4 py-3 font-bold capitalize whitespace-nowrap">{log.game}</td>
                      <td className="px-4 py-3 font-bold">
                        <span className="bg-muted px-2 py-1 rounded-md text-xs">{log.level}</span>
                      </td>
                      <td className="px-4 py-3 font-bold tabular-nums">
                        {log.depth}
                      </td>
                      <td className="px-4 py-3 font-bold tabular-nums text-primary whitespace-nowrap">
                        <span className="opacity-60 text-xs">{log.evalBefore ? log.evalBefore.toFixed(2) : '0.00'} &rarr;</span> {log.eval ? log.eval.toFixed(2) : '0.00'}
                      </td>
                      <td className={`px-4 py-3 font-bold tabular-nums flex items-center gap-1 ${log.time > 2000 ? 'text-destructive' : ''}`}>
                        {(log.time / 1000).toFixed(2)}s
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-foreground text-xs max-w-[150px] truncate" title={log.move}>
                        {log.move}
                      </td>
                      <td className="px-4 py-3 text-xs font-bold">
                        {analysis.isFail ? (
                          <span className="text-destructive flex flex-col gap-0.5">
                            {analysis.reasons.map((r, i) => <span key={i}>⚠️ {r}</span>)}
                          </span>
                        ) : (
                          <span className="text-emerald-500">✅ {log.status || 'OK'}</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
