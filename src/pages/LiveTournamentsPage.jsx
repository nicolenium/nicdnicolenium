
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Trophy, Users, Activity, ArrowLeft, Radio, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function LiveTournamentsPage() {
  const navigate = useNavigate();
  const { isAdminAuthenticated } = useAdminAuth();
  const [liveTournaments, setLiveTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveTournaments = async () => {
      try {
        const records = await pb.collection('tournaments').getFullList({
          filter: 'status = "active" && is_live = true',
          sort: '-created',
          $autoCancel: false
        });
        setLiveTournaments(records);
      } catch (error) {
        console.error('Error fetching live tournaments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveTournaments();

    // Subscribe to real-time updates
    pb.collection('tournaments').subscribe('*', function (e) {
      if (e.action === 'create' || e.action === 'update') {
        if (e.record.status === 'active' && e.record.is_live) {
          setLiveTournaments(prev => {
            const exists = prev.find(t => t.id === e.record.id);
            if (exists) {
              return prev.map(t => t.id === e.record.id ? e.record : t);
            }
            return [e.record, ...prev];
          });
        } else {
          // Remove if no longer active/live
          setLiveTournaments(prev => prev.filter(t => t.id !== e.record.id));
        }
      } else if (e.action === 'delete') {
        setLiveTournaments(prev => prev.filter(t => t.id !== e.record.id));
      }
    });

    return () => {
      pb.collection('tournaments').unsubscribe('*');
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground p-4 md:p-8 relative overflow-hidden">
      <Helmet><title>Live Tournaments | NICD</title></Helmet>
      
      {/* Background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/20 text-red-500 animate-pulse">
                <Radio className="w-5 h-5" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">Live Now</h1>
            </div>
            <p className="text-muted-foreground text-lg">Watch ongoing tournaments and real-time leaderboards.</p>
          </div>
          
          {isAdminAuthenticated && (
            <Button variant="outline" onClick={() => navigate('/admin')} className="border-white/10 hover:bg-white/5">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Admin
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="bg-card border-white/10 animate-pulse h-64" />
            ))}
          </div>
        ) : liveTournaments.length === 0 ? (
          <div className="text-center py-24 bg-card border border-white/10 rounded-3xl shadow-2xl">
            <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">No Live Tournaments</h2>
            <p className="text-muted-foreground">There are currently no active tournaments broadcasting live.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {liveTournaments.map(tournament => (
              <Card key={tournament.id} className="bg-slate-950/80 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden flex flex-col">
                <div className="h-2 bg-gradient-to-r from-red-500 to-orange-500" />
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">LIVE</span>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{tournament.gameType}</span>
                      </div>
                      <CardTitle className="text-2xl font-black">{tournament.name}</CardTitle>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Prize Pool</div>
                      <div className="text-xl font-black text-primary">${tournament.prizePool?.toLocaleString() || 0}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="text-xs text-muted-foreground font-bold uppercase">Players</div>
                        <div className="font-mono font-bold">{tournament.currentPlayers || 0} / {tournament.maxPlayers}</div>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="text-xs text-muted-foreground font-bold uppercase">Started</div>
                        <div className="font-mono font-bold text-sm">{new Date(tournament.startDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Mock Live Leaderboard / Match Updates */}
                  <div className="mt-auto border-t border-white/10 pt-6">
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-400" /> Top Contenders
                    </h4>
                    <div className="space-y-3">
                      {[1, 2, 3].map((pos) => (
                        <div key={pos} className="flex items-center justify-between bg-black/40 rounded-lg p-3 border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${pos === 1 ? 'bg-amber-500 text-black' : pos === 2 ? 'bg-slate-300 text-black' : 'bg-amber-700 text-black'}`}>
                              {pos}
                            </div>
                            <span className="font-medium text-sm">Player_{Math.floor(Math.random() * 9000) + 1000}</span>
                          </div>
                          <span className="font-mono text-sm text-primary font-bold">{Math.floor(Math.random() * 500) + 100} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full mt-6 font-bold bg-white/10 hover:bg-white/20 text-white" onClick={() => navigate(`/tournaments/${tournament.id}`)}>
                    View Full Bracket
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
