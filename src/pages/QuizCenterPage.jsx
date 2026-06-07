
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import QuizComponent from '@/components/QuizComponent.jsx';
import { gameRegistry } from '@/utils/GameRegistry.js';
import { GameIntegrationConfig } from '@/config/GameIntegrationConfig.js';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Search, BrainCircuit, Filter } from 'lucide-react';
import EducationalDocumentation from '@/components/EducationalDocumentation.jsx';

export default function QuizCenterPage() {
  const allGames = gameRegistry.getAllGames();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = useMemo(() => {
    if (!searchQuery) return allGames;
    const q = searchQuery.toLowerCase();
    return allGames.filter(g => g.name.toLowerCase().includes(q));
  }, [allGames, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Quiz Center | NICD NICOLENIUM</title></Helmet>
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-foreground">
            Quiz Center
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium mb-10 leading-relaxed">
            Test your knowledge of game rules, history, and advanced tactics to earn badges and climb the educational leaderboards.
          </p>
          
          <div className="relative max-w-xl mx-auto flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search quizzes by game..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-card border-2 h-14 rounded-xl text-lg font-medium w-full"
              />
            </div>
            <Button variant="outline" className="h-14 px-6 rounded-xl border-2 font-bold hidden sm:flex">
              <Filter className="w-5 h-5 mr-2" /> Filters
            </Button>
          </div>
        </div>

        <div className="mb-16">
          <EducationalDocumentation />
        </div>

        <div className="space-y-12">
          <AnimatePresence mode="popLayout">
            {filteredGames.map(game => {
              const config = GameIntegrationConfig[game.id];
              if (!config || !config.quizzes || config.quizzes.length === 0) return null;

              return (
                <motion.section 
                  key={game.id} 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="bg-card p-6 md:p-8 rounded-3xl border-2 border-border shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border/50">
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center overflow-hidden border-2 border-border shrink-0">
                      <img src={game.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">{game.name} Quizzes</h2>
                      <p className="text-muted-foreground font-medium text-sm uppercase tracking-wider mt-1">{game.category}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-8">
                    {config.quizzes.map(quiz => (
                      <QuizComponent key={quiz.id} quiz={quiz} />
                    ))}
                  </div>
                </motion.section>
              );
            })}
          </AnimatePresence>
          
          {filteredGames.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-24 bg-card rounded-3xl border-2 border-dashed border-border"
            >
              <BrainCircuit className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-foreground mb-2">No quizzes found</h3>
              <p className="text-muted-foreground font-medium text-lg">Try adjusting your search terms to find what you're looking for.</p>
              <Button variant="outline" onClick={() => setSearchQuery('')} className="mt-6 rounded-full font-bold border-2">
                Clear Search
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
