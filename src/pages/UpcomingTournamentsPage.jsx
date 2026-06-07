
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, MapPin, Calendar, Users, Loader2 } from 'lucide-react';
import TournamentCountdown from '@/components/TournamentCountdown.jsx';

const UpcomingTournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const records = await pb.collection('tournaments').getFullList({
          filter: 'status = "upcoming"',
          sort: 'startDate',
          $autoCancel: false
        });
        setTournaments(records);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  const featured = tournaments.length > 0 ? tournaments[0] : null;
  const others = tournaments.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Upcoming Tournaments - NICD</title></Helmet>
      <Header />
      <main className="flex-1">
        
        {/* Hero Section / Featured */}
        <section className="relative py-20 lg:py-32 border-b border-border bg-card/50 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
            ) : featured ? (
              <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
                <div className="flex-1 space-y-6">
                  <span className="badge-base bg-primary/20 text-primary border border-primary/30"><Trophy className="w-4 h-4 mr-1" /> Featured Event</span>
                  <h1 className="text-4xl lg:text-6xl font-black text-foreground leading-tight text-balance">{featured.name}</h1>
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                    {featured.description || `Join the ultimate ${featured.gameType?.replace('_', ' ')} competition. Test your skills and win amazing prizes.`}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="flex items-center gap-3 text-foreground"><Calendar className="w-5 h-5 text-primary" /> <span className="font-medium">{new Date(featured.startDate).toLocaleDateString()}</span></div>
                    <div className="flex items-center gap-3 text-foreground"><MapPin className="w-5 h-5 text-primary" /> <span className="font-medium">{featured.location || "Online"}</span></div>
                    <div className="flex items-center gap-3 text-foreground"><Users className="w-5 h-5 text-primary" /> <span className="font-medium">Max {featured.maxPlayers} Players</span></div>
                    <div className="flex items-center gap-3 text-foreground"><Trophy className="w-5 h-5 text-amber-500" /> <span className="font-medium">${featured.prizePool || 0} Pool</span></div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-6">
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8">
                      <Link to={`/tournaments/${featured.id}`}>Register Now</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="px-8 border-border">
                      <Link to={`/tournaments/${featured.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>

                <div className="flex-1 w-full max-w-md">
                  <Card className="card-base border-primary/30 shadow-glow bg-background overflow-hidden relative">
                    <CardContent className="p-8 flex flex-col items-center text-center space-y-8">
                      <h3 className="font-bold text-muted-foreground uppercase tracking-widest text-sm">Tournament Starts In</h3>
                      <TournamentCountdown targetDate={featured.startDate} />
                      <div className="w-full h-px bg-border/50"></div>
                      <div className="w-full flex justify-between text-sm font-medium">
                        <span className="text-muted-foreground">Format</span>
                        <span className="uppercase text-foreground">{featured.format?.replace('_', ' ')}</span>
                      </div>
                      <div className="w-full flex justify-between text-sm font-medium">
                        <span className="text-muted-foreground">Time Control</span>
                        <span className="uppercase text-foreground">{featured.timeControl}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
               <div className="text-center py-20">
                 <h2 className="text-3xl font-bold mb-4">No Upcoming Tournaments</h2>
                 <p className="text-muted-foreground">Check back later for new events.</p>
               </div>
            )}
          </div>
        </section>

        {/* List Section */}
        {others.length > 0 && (
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 className="text-3xl font-black mb-10">More Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {others.map(t => (
                  <Card key={t.id} className="card-base group hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1">
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="p-6 border-b border-border/50 bg-muted/20">
                        <span className="badge-base bg-secondary/10 text-secondary border border-secondary/20 mb-4">{t.gameType?.replace('_', ' ')}</span>
                        <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{t.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                          <Calendar className="w-4 h-4" /> {new Date(t.startDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Format</span>
                            <span className="font-medium capitalize">{t.format?.replace('_', ' ')}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Prize Pool</span>
                            <span className="font-medium text-amber-500">${t.prizePool || 0}</span>
                          </div>
                        </div>
                        <Button asChild variant="outline" className="w-full mt-auto border-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                          <Link to={`/tournaments/${t.id}`}>View Tournament</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default UpcomingTournamentsPage;
