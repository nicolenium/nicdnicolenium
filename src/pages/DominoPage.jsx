
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, BookOpen, Trophy, Users, BrainCircuit } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function DominoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Dominoes | NICOLENIUM</title></Helmet>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden bg-card border-b border-border">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593450383434-21f11b0a3e84?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          
          <div className="container max-w-7xl mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black font-serif mb-6"
              >
                Classic <span className="text-primary">Dominoes</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-muted-foreground mb-10 leading-relaxed"
              >
                Experience the timeless tile-based game. Play against our advanced AI or challenge friends in real-time multiplayer matches.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-4"
              >
                <Button asChild size="lg" className="rounded-full h-14 px-8 text-lg font-bold">
                  <Link to="/domino-setup"><Play className="w-5 h-5 mr-2 fill-current" /> Play Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full h-14 px-8 text-lg font-bold">
                  <Link to="/how-to-play"><BookOpen className="w-5 h-5 mr-2" /> Read Rules</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-muted/50 border-none shadow-none rounded-3xl">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <BrainCircuit className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Smart AI Opponent</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Practice against our Minimax-powered AI with three difficulty levels. Perfect for honing your strategy.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50 border-none shadow-none rounded-3xl">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Live Multiplayer</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect instantly with players worldwide using our low-latency WebSocket infrastructure.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/50 border-none shadow-none rounded-3xl">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Trophy className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Global Leaderboards</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Climb the ranks, earn achievements, and prove you're the ultimate Dominoes master.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
