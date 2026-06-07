
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Loader2, Search, Swords } from 'lucide-react';

export default function MatchManagement() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const records = await pb.collection('game_sessions').getList(1, 50, {
          sort: '-created',
          expand: 'player1Id,player2Id',
          $autoCancel: false
        });
        setMatches(records.items);
      } catch (error) {
        console.error("Failed to load matches", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const filteredMatches = matches.filter(m => 
    m.id.includes(search) || m.gameType?.includes(search)
  );

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto p-4 md:p-8">
      <Helmet><title>Match Management | Admin</title></Helmet>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-2xl shadow-sm border border-border">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2"><Swords className="text-rose-500 w-6 h-6"/> Matches</h1>
          <p className="text-muted-foreground mt-1">Monitor active and past game sessions</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search match ID or type..." 
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
                  <TableHead className="font-bold">Match ID</TableHead>
                  <TableHead className="font-bold">Game Type</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Players</TableHead>
                  <TableHead className="font-bold text-right">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMatches.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No matches found.</TableCell></TableRow>
                ) : (
                  filteredMatches.map(match => (
                    <TableRow key={match.id}>
                      <TableCell className="font-mono text-xs">{match.id}</TableCell>
                      <TableCell className="font-bold capitalize">{match.gameType?.replace(/_/g, ' ') || 'Unknown'}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-md font-bold uppercase ${
                          match.status === 'completed' ? 'bg-emerald-500/15 text-emerald-600' :
                          match.status === 'in_progress' ? 'bg-blue-500/15 text-blue-600' :
                          'bg-amber-500/15 text-amber-600'
                        }`}>{match.status}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {match.expand?.player1Id?.username || match.player1Id} vs {match.expand?.player2Id?.username || match.player2Id || 'AI'}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {new Date(match.created).toLocaleDateString()}
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
