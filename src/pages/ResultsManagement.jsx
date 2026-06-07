
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Loader2, Search, Medal } from 'lucide-react';

export default function ResultsManagement() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const records = await pb.collection('game_history').getList(1, 50, {
          sort: '-created',
          expand: 'userId',
          $autoCancel: false
        });
        setResults(records.items);
      } catch (error) {
        console.error("Failed to load results", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const filteredResults = results.filter(r => 
    r.gameType?.includes(search) || r.expand?.userId?.username?.includes(search)
  );

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto p-4 md:p-8">
      <Helmet><title>Results Management | Admin</title></Helmet>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-2xl shadow-sm border border-border">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2"><Medal className="text-purple-500 w-6 h-6"/> Results</h1>
          <p className="text-muted-foreground mt-1">Review game outcomes and history</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search game or player..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold">Player</TableHead>
                  <TableHead className="font-bold">Game</TableHead>
                  <TableHead className="font-bold">Opponent</TableHead>
                  <TableHead className="font-bold">Result</TableHead>
                  <TableHead className="font-bold text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No results found.</TableCell></TableRow>
                ) : (
                  filteredResults.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-bold">{r.expand?.userId?.username || 'Unknown'}</TableCell>
                      <TableCell className="capitalize text-muted-foreground">{r.gameType?.replace(/_/g, ' ') || 'Unknown'}</TableCell>
                      <TableCell className="text-muted-foreground">{r.opponent || 'AI'}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-md font-bold uppercase ${
                          r.result === 'win' ? 'bg-emerald-500/15 text-emerald-600' :
                          r.result === 'loss' ? 'bg-rose-500/15 text-rose-600' :
                          'bg-slate-500/15 text-slate-600'
                        }`}>{r.result || 'draw'}</span>
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold">
                        {r.score || 0}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
