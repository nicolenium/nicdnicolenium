
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Users, Search } from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient.js';
import PlayerProfileCard from '@/components/PlayerProfileCard.jsx';

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const records = await pb.collection('users').getFullList({
          sort: '-created',
          $autoCancel: false
        });
        setPlayers(records);
      } catch (err) {
        console.error("Error fetching players:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const filteredPlayers = players.filter(p => 
    p.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Players Directory | NICD Games</title></Helmet>
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-serif flex items-center gap-3">
              <Users className="w-10 h-10 text-primary" /> Players Directory
            </h1>
            <p className="text-muted-foreground text-lg mt-2">Find opponents and build your network.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search players..." 
              className="pl-10 h-12 rounded-xl bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPlayers.map(player => (
              <PlayerProfileCard key={player.id} player={player} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
