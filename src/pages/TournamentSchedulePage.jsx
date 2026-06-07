
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, Download } from 'lucide-react';

const TournamentSchedulePage = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const tData = await pb.collection('tournaments').getOne(id, { $autoCancel: false });
      setTournament(tData);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadICS = () => {
    if (!tournament) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${new Date(tournament.startDate).toISOString().replace(/-|:|\.\d+/g, '')}
SUMMARY:${tournament.name}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${tournament.name.replace(/\s+/g, '_')}_schedule.ics`;
    link.click();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading schedule...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Schedule | {tournament?.name}</title></Helmet>
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-12">
          <div>
            <Button variant="ghost" asChild className="-ml-4 mb-2">
              <Link to={`/tournaments/${id}`}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
            </Button>
            <h1 className="text-3xl font-bold">{tournament?.name} Schedule</h1>
          </div>
          <Button onClick={downloadICS} variant="outline"><Calendar className="w-4 h-4 mr-2" /> Add to Calendar</Button>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative border-l-2 border-primary/20 pl-8 ml-4 space-y-12">
            
            <div className="relative">
              <div className="absolute -left-10 w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Registration Closes</h3>
                  <p className="text-muted-foreground mb-2">All players must be registered and confirmed.</p>
                  <Badge variant="outline">{new Date(tournament.startDate).toLocaleDateString()}</Badge>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute -left-10 w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Tournament Begins</h3>
                  <p className="text-muted-foreground mb-2">Round 1 matches will become available.</p>
                  <Badge variant="outline">{new Date(tournament.startDate).toLocaleString()}</Badge>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute -left-10 w-4 h-4 rounded-full bg-muted border-2 border-primary ring-4 ring-background" />
              <Card className="opacity-70">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Finals</h3>
                  <p className="text-muted-foreground mb-2">Championship match and awards ceremony.</p>
                  <Badge variant="secondary">TBD based on progression</Badge>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Assuming Badge component is imported from shadcn/ui but we missed it in imports. 
// Adding a quick inline definition for the Badge just in case, but usually it's imported.
import { Badge } from '@/components/ui/badge';

export default TournamentSchedulePage;
