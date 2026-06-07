
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

const TournamentBracketPage = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [bracket, setBracket] = useState(null);
  const [loading, setLoading] = useState(true);
  const bracketRef = useRef(null);

  useEffect(() => {
    fetchData();
    
    // Real-time subscription
    pb.collection('tournament_brackets').subscribe('*', function (e) {
      if (e.action === 'update' && e.record.tournamentId === id) {
        setBracket(e.record);
        toast.info('Bracket updated live');
      }
    });

    return () => {
      pb.collection('tournament_brackets').unsubscribe('*');
    };
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const tData = await pb.collection('tournaments').getOne(id, { $autoCancel: false });
      setTournament(tData);

      const bData = await pb.collection('tournament_brackets').getFirstListItem(`tournamentId="${id}"`, { $autoCancel: false });
      setBracket(bData);
    } catch (error) {
      console.error('Error fetching bracket:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportBracket = async () => {
    if (!bracketRef.current) return;
    try {
      const canvas = await html2canvas(bracketRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape' });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${tournament?.name}_bracket.pdf`);
    } catch (err) {
      toast.error('Failed to export bracket');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading bracket...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Bracket | {tournament?.name}</title></Helmet>
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-24 overflow-x-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Button variant="ghost" asChild className="-ml-4 mb-2">
              <Link to={`/tournaments/${id}`}><ArrowLeft className="w-4 h-4 mr-2" /> Back to Details</Link>
            </Button>
            <h1 className="text-3xl font-bold">{tournament?.name} Bracket</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchData}><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
            <Button onClick={exportBracket}><Download className="w-4 h-4 mr-2" /> Export PDF</Button>
          </div>
        </div>

        {!bracket || !bracket.bracketData ? (
          <div className="py-24 text-center border rounded-2xl bg-muted/20">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold">Bracket Not Generated</h3>
            <p className="text-muted-foreground">The organizer has not generated the bracket for this tournament yet.</p>
          </div>
        ) : (
          <div ref={bracketRef} className="bg-card p-8 rounded-2xl border shadow-sm min-w-max">
            {bracket.format === 'single_elimination' && (
              <div className="flex gap-12">
                {bracket.bracketData.rounds.map((round, rIdx) => (
                  <div key={rIdx} className="flex flex-col justify-around gap-6">
                    <h4 className="text-center font-bold text-muted-foreground mb-4">Round {round.round}</h4>
                    {round.matches.map((match, mIdx) => (
                      <Card key={match.id} className="w-64 p-3 relative bg-[hsl(var(--bracket-primary))] border-[hsl(var(--bracket-secondary))]">
                        {rIdx < bracket.bracketData.rounds.length - 1 && (
                          <div className="absolute top-1/2 -right-12 w-12 h-px bg-border z-0" />
                        )}
                        <div className="space-y-2 relative z-10">
                          <div className={`flex justify-between p-2 rounded ${match.winner?.id === match.player1?.id ? 'bg-primary/20 font-bold' : 'bg-muted/50'}`}>
                            <span className="truncate">{match.player1?.player_name || 'TBD'}</span>
                            <span>{match.status === 'completed' && match.player1 ? '—' : ''}</span>
                          </div>
                          <div className={`flex justify-between p-2 rounded ${match.winner?.id === match.player2?.id ? 'bg-primary/20 font-bold' : 'bg-muted/50'}`}>
                            <span className="truncate">{match.player2 === null ? '(BYE)' : match.player2?.player_name || 'TBD'}</span>
                            <span>{match.status === 'completed' && match.player2 ? '—' : ''}</span>
                          </div>
                        </div>
                        {match.status === 'live' && (
                          <Badge className="absolute -top-2 -right-2 bg-red-500 animate-pulse">LIVE</Badge>
                        )}
                      </Card>
                    ))}
                  </div>
                ))}
              </div>
            )}
            
            {bracket.format === 'round_robin' && (
              <div className="space-y-8">
                {bracket.bracketData.rounds.map((round, rIdx) => (
                  <div key={rIdx}>
                    <h4 className="font-bold border-b pb-2 mb-4">Round {round.round}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {round.matches.map(match => (
                        <Card key={match.id} className="p-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{match.player1?.player_name}</span>
                            <span className="text-muted-foreground text-xs mx-2">VS</span>
                            <span className="font-medium">{match.player2?.player_name}</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TournamentBracketPage;
