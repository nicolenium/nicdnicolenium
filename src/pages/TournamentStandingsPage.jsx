import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download, Trophy, Medal } from 'lucide-react';
import { toast } from 'sonner';

const TournamentStandingsPage = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();

    pb.collection('tournament_standings').subscribe('*', function (e) {
      if (e.record.tournamentId === id) {
        fetchData(); // Simplest way to re-sort
      }
    });

    return () => pb.collection('tournament_standings').unsubscribe('*');
  }, [id]);

  const fetchData = async () => {
    try {
      const tData = await pb.collection('tournaments').getOne(id, { $autoCancel: false });
      setTournament(tData);

      const records = await pb.collection('tournament_standings').getFullList({
        filter: `tournamentId="${id}"`,
        sort: 'rank,-points,-wins',
        $autoCancel: false
      });
      setStandings(records);
    } catch (error) {
      console.error('Error fetching standings:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Rank', 'Player ID', 'Wins', 'Losses', 'Draws', 'Points'];
    const csv = [
      headers.join(','),
      ...standings.map(s => `${s.rank},${s.playerId},${s.wins},${s.losses},${s.draws},${s.points}`)
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tournament?.name}_standings.csv`;
    a.click();
    toast.success('Exported standings');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading standings...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Standings | {tournament?.name}</title></Helmet>
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Button variant="ghost" asChild className="-ml-4 mb-2">
              <Link to={`/tournaments/${id}`}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
            </Button>
            <h1 className="text-3xl font-bold">{tournament?.name} Standings</h1>
          </div>
          <Button onClick={exportCSV} variant="outline"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
        </div>

        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[hsl(var(--table-header))]">
                <TableRow>
                  <TableHead className="w-20">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-center">W</TableHead>
                  <TableHead className="text-center">L</TableHead>
                  <TableHead className="text-center">D</TableHead>
                  <TableHead className="text-center font-bold">PTS</TableHead>
                  <TableHead className="text-right">Win %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {standings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No standings available yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  standings.map((s, index) => {
                    const total = (s.wins || 0) + (s.losses || 0) + (s.draws || 0);
                    const winPct = total > 0 ? Math.round((s.wins / total) * 100) : 0;
                    
                    let rowClass = index % 2 === 0 ? 'bg-background' : 'bg-[hsl(var(--table-row-alt))]';
                    let Icon = null;
                    let iconColor = '';
                    
                    if (s.rank === 1) { rowClass = 'bg-yellow-500/10 font-medium'; Icon = Trophy; iconColor = 'text-yellow-500'; }
                    else if (s.rank === 2) { rowClass = 'bg-slate-400/10'; Icon = Medal; iconColor = 'text-slate-400'; }
                    else if (s.rank === 3) { rowClass = 'bg-amber-700/10'; Icon = Medal; iconColor = 'text-amber-700'; }

                    return (
                      <TableRow key={s.id} className={rowClass}>
                        <TableCell className="font-bold flex items-center gap-2">
                          {s.rank} {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
                        </TableCell>
                        <TableCell>{s.playerId} {/* Typically would expand to fetch actual player name */}</TableCell>
                        <TableCell className="text-center">{s.wins || 0}</TableCell>
                        <TableCell className="text-center">{s.losses || 0}</TableCell>
                        <TableCell className="text-center">{s.draws || 0}</TableCell>
                        <TableCell className="text-center font-bold text-primary">{s.points || 0}</TableCell>
                        <TableCell className="text-right">{winPct}%</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TournamentStandingsPage;