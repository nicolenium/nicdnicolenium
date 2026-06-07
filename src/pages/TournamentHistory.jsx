
import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TournamentHistory = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Tournament History - NICD PRODUCTIONS</title></Helmet>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold">Tournament History</h1>
          <Card>
            <CardHeader><CardTitle>Past Events</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Archive of past tournaments and results.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TournamentHistory;
