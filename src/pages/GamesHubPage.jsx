
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Gamepad2 } from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import GamePosterCard from '@/components/GamePosterCard.jsx';
import { ALL_GAMES } from '@/config/gamePosterConfig.js';

const CATEGORIES = ['All', 'Board Games', 'Educational Games', 'Quiz Games'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard', 'Expert'];

export default function GamesHubPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const filteredGames = useMemo(() => {
    let result = ALL_GAMES;

    if (selectedCategory !== 'All') {
      result = result.filter(g => g.category === selectedCategory);
    }

    if (selectedDifficulty !== 'All') {
      result = result.filter(g => g.difficulty === selectedDifficulty);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(g => (g.name || g.title).toLowerCase().includes(q) || g.category.toLowerCase().includes(q) || g.description.toLowerCase().includes(q));
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'popular') return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      return 0;
    });

    return result;
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  const handleGameClick = (path) => {
    if (path) navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Game Hub | NICOLENIUM</title></Helmet>
      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-[1400px] mx-auto space-y-10">
          
          <div className="text-center space-y-4 pt-6">
            <h1 className="text-5xl md:text-7xl font-black text-foreground uppercase tracking-tight">
              Game <span className="text-primary">Hub</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
              Explore 21 premium experiences spanning strategy, puzzles, education, and trivia.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-card border-2 border-border rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between z-20 relative">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search games..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-background border-2 h-12 rounded-xl font-bold"
              />
            </div>
            
            <div className="flex flex-wrap gap-3 w-full lg:w-auto items-center">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] bg-background border-2 rounded-xl h-12 font-bold">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-[140px] bg-background border-2 rounded-xl h-12 font-bold">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map(diff => <SelectItem key={diff} value={diff}>{diff}</SelectItem>)}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] bg-background border-2 rounded-xl h-12 font-bold">
                  <Filter className="w-4 h-4 mr-2 text-primary" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="name_asc">A-Z</SelectItem>
                  <SelectItem value="name_desc">Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="h-full"
                >
                  <GamePosterCard 
                    game={game}
                    onClick={() => handleGameClick(game.path)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredGames.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-32 bg-card rounded-3xl border-2 border-dashed border-border"
            >
              <Gamepad2 className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
              <h3 className="text-3xl font-black text-foreground mb-3 tracking-tight">No games found</h3>
              <p className="text-muted-foreground font-medium text-lg max-w-md mx-auto">We couldn't find any games matching your current search criteria.</p>
              <Button variant="outline" onClick={() => {setSearchQuery(''); setSelectedCategory('All'); setSelectedDifficulty('All');}} className="mt-8 rounded-full font-bold border-2 h-14 px-8 text-lg hover:bg-primary hover:text-primary-foreground">
                Reset Filters
              </Button>
            </motion.div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
