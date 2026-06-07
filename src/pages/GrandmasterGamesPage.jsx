
import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const GrandmasterGamesPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Grandmaster Games - NICD</title></Helmet>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-black text-primary mb-6">Grandmaster Database</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Study classic matches from world championships, annotated by professional players.
        </p>
      </main>
      <Footer />
    </div>
  );
};
export default GrandmasterGamesPage;
