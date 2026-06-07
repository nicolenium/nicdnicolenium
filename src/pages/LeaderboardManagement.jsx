
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Loader2, Search, ListOrdered, Trophy } from 'lucide-react';

export default function LeaderboardManagement() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const records = await pb.collection('leaderboard').getList(1, 50, {
          sort: '-currentRating,-wins',
          $autoCancel: false
        });
        setLeaders(records.items);
      } catch (error) {
        console.error("Failed to load leaders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  const filteredLeaders = leaders.filter(l => 
    l.username?.toLowerCase().includes(search.toLowerCase()) || l.gameType?.includes(search)
  );

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto p-4 md:p-8">
      <Helmet><title>Leaderboard Management | Admin</title></Helmet>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-2xl shadow-sm border border-border">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2"><ListOrdered className="text-cyan-500 w-6 h-6"/> Global Leaderboard</h1>
          <p className="text-muted-foreground mt-1">Manage and review top rankings</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search player or game..." 
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
                  <TableHead className="font-bold w-[80px]">Rank</TableHead>
                  <TableHead className="font-bold">Player</TableHead>
                  <TableHead className="font-bold">Category</TableHead>
                  <TableHead className="font-bold text-right">Rating</TableHead>
                  <TableHead className="font-bold text-right">W / L / D</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaders.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No rankings found.</TableCell></TableRow>
                ) : (
                  filteredLeaders.map((l, i) => (
                    <TableRow key={l.id}>
                      <TableCell className="font-black text-lg">
                        {i === 0 ? <Trophy className="w-5 h-5 text-amber-500" /> : 
                         i === 1 ? <Trophy className="w-5 h-5 text-slate-400" /> :
                         i === 2 ? <Trophy className="w-5 h-5 text-orange-600" /> : `#${i + 1}`}
                      </TableCell>
                      <TableCell className="font-bold">{l.username || 'Unknown'}</TableCell>
                      <TableCell className="capitalize text-muted-foreground">{l.gameType?.replace(/_/g, ' ') || 'Global'}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary">{l.currentRating || l.eloRating || 0}</TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground text-sm">
                        {l.wins || 0} / {l.losses || 0} / {l.draws || 0}
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
