
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FlaskConical, Play, Download, CheckCircle, XCircle, Loader2, RotateCcw } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { toast } from 'sonner';

const GAMES_LIST = [
  { id: 'chess', name: 'Chess', minDepth: 6 },
  { id: 'checkers8x8', name: 'Checkers 8x8', minDepth: 10 },
  { id: 'checkers10x10', name: 'Checkers 10x10', minDepth: 8 },
  { id: 'ludo', name: 'Ludo', minDepth: 4 },
  { id: 'connectfour', name: 'Connect Four', minDepth: 6 },
  { id: 'tictactoe', name: 'Tic Tac Toe', minDepth: 9 },
  { id: 'dominoes', name: 'Dominoes', minDepth: 4 }
];

export default function GameTestSuite() {
  const [running, setRunning] = useState(null); 
  const [results, setResults] = useState({});

  const runBenchmark = async (gameId) => {
    setRunning(gameId);
    try {
      const response = await apiServerClient.fetch('/admin/run-ai-benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: gameId,
          player1: 'Hard',
          player2: 'Medium',
          games: 20
        })
      });
      if (!response.ok) throw new Error('Benchmark failed to start');
      const data = await response.json();
      
      setResults(prev => ({ ...prev, [gameId]: data }));
      toast.success(`${gameId} benchmark completed.`);
    } catch (error) {
      console.error('Benchmark error:', error);
      toast.error(`Benchmark failed for ${gameId}. Check logs.`);
    } finally {
      setRunning(null);
    }
  };

  const clearResult = (gameId) => {
    setResults(prev => {
      const newRes = { ...prev };
      delete newRes[gameId];
      return newRes;
    });
  };

  const downloadPgn = (gameId) => {
    const result = results[gameId];
    if (!result || !result.pgns) return;
    const content = result.pgns.join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gameId}_benchmark_${new Date().getTime()}.pgn`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatus = (gameId) => {
    const res = results[gameId];
    if (!res) return 'NOT RUN';
    const config = GAMES_LIST.find(g => g.id === gameId);
    const isPass = parseFloat(res.hardWinRate) >= 70 && res.timeouts === 0 && res.blunders === 0 && parseFloat(res.avgDepthHard) >= config.minDepth;
    return isPass ? 'PASS' : 'FAIL';
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <Helmet><title>Game Test Suite | Admin | NICOLENIUM</title></Helmet>

      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
          <FlaskConical className="w-8 h-8 text-primary" /> 20-Game Benchmark Suite
        </h1>
        <p className="text-muted-foreground font-medium mt-1">Run simulated games (Hard vs Medium) to verify AI stability and strength.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {GAMES_LIST.map(game => {
          const res = results[game.id];
          const isRunning = running === game.id;
          const status = getStatus(game.id);
          
          return (
            <Card key={game.id} className={`bg-card border-2 shadow-sm rounded-2xl overflow-hidden transition-colors ${status === 'PASS' ? 'border-emerald-500/30' : status === 'FAIL' ? 'border-destructive/30' : ''}`}>
              <div className={`px-6 py-4 border-b border-border flex items-center justify-between ${status === 'PASS' ? 'bg-emerald-500/5' : status === 'FAIL' ? 'bg-destructive/5' : 'bg-muted/30'}`}>
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-black">{game.name}</h2>
                  {status === 'NOT RUN' && <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-muted text-muted-foreground">NOT RUN</span>}
                  {status === 'PASS' && <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> PASS</span>}
                  {status === 'FAIL' && <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-destructive/20 text-destructive border border-destructive/30 flex items-center gap-1"><XCircle className="w-3 h-3" /> FAIL</span>}
                </div>
                <div className="flex gap-2">
                  {res && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => downloadPgn(game.id)} className="rounded-lg font-bold">
                        <Download className="w-4 h-4 mr-2" /> PGNs
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => clearResult(game.id)} className="rounded-lg font-bold hover:text-destructive">
                        <RotateCcw className="w-4 h-4 mr-2" /> Clear
                      </Button>
                    </>
                  )}
                  {!res && (
                    <Button 
                      onClick={() => runBenchmark(game.id)} 
                      disabled={running !== null} 
                      className="rounded-lg font-bold bg-primary text-primary-foreground"
                    >
                      {isRunning ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running (1-3m)</>
                      ) : (
                        <><Play className="w-4 h-4 mr-2 fill-current" /> Run 20 Games</>
                      )}
                    </Button>
                  )}
                </div>
              </div>
              
              <CardContent className="p-0">
                {res && (
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted/20 border-b border-border font-bold text-muted-foreground">
                      <tr>
                        <th className="px-6 py-3">Hard AI Wins</th>
                        <th className="px-6 py-3">Win Rate %</th>
                        <th className="px-6 py-3">Avg Depth Hard</th>
                        <th className="px-6 py-3">Avg Depth Medium</th>
                        <th className="px-6 py-3">Timeouts</th>
                        <th className="px-6 py-3">1-Move Blunders</th>
                        <th className="px-6 py-3">Avg Moves</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className={`px-6 py-4 font-black text-lg ${res.hardWins >= 14 ? 'text-emerald-500' : 'text-destructive'}`}>
                          {res.hardWins}/20
                        </td>
                        <td className={`px-6 py-4 font-black text-lg ${parseFloat(res.hardWinRate) >= 70 ? 'text-emerald-500' : 'text-destructive'}`}>
                          {res.hardWinRate}%
                        </td>
                        <td className={`px-6 py-4 font-black text-lg ${parseFloat(res.avgDepthHard) >= game.minDepth ? 'text-emerald-500' : 'text-destructive'}`}>
                          {res.avgDepthHard} <span className="text-xs opacity-60 font-medium">ply (Min: {game.minDepth})</span>
                        </td>
                        <td className="px-6 py-4 font-black text-lg text-foreground">
                          {res.avgDepthMedium} <span className="text-xs opacity-60 font-medium">ply</span>
                        </td>
                        <td className={`px-6 py-4 font-black text-lg ${res.timeouts === 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                          {res.timeouts}
                        </td>
                        <td className={`px-6 py-4 font-black text-lg ${res.blunders === 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                          {res.blunders}
                        </td>
                        <td className="px-6 py-4 font-black text-lg text-foreground">
                          {res.avgMoves}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
                {!res && !isRunning && (
                  <div className="px-6 py-8 text-center text-muted-foreground text-sm font-medium">
                    Test not executed. Click 'Run 20 Games' to begin benchmark.
                  </div>
                )}
                {isRunning && (
                  <div className="px-6 py-8 flex flex-col items-center justify-center space-y-3 bg-muted/10">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="font-bold text-foreground">Simulating 20 full games...</p>
                    <p className="text-xs text-muted-foreground max-w-md text-center">This process pits Hard AI vs Medium AI to verify win rates, enforce depth minimums, and check for timeouts or blunders across thousands of moves.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
