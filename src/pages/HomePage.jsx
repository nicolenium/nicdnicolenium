import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>NICD NICOLENIUM | Premium Gaming Platform</title>
        <meta name="description" content="Play 38 Amazing Games in 34 Languages on NICD NICOLENIUM." />
      </Helmet>

      <main className="flex-1">
        <section className="relative py-24 lg:py-32 overflow-hidden flex items-center min-h [80vh]">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary font-bold text-sm mb-8">
                <Zap className="w-4 h-4" /> Play 38 Amazing Games in 34 Languages
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1] mb-6">
                NICD NICOLENIUM<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Play Now</span>
              </h1>
              <p className="text-xl text-muted-foreground font-medium mb-10 max-w-2xl leading-relaxed">
                The ultimate collection of board games, puzzles, and educational challenges.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/games" className="h-16 px-10 text-xl font-black rounded-full shadow-lg bg-primary text-white flex items-center justify-center hover:scale-105 transition-transform">
                  Play Now <Play className="w-6 h-6 ml-2 fill-current" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
