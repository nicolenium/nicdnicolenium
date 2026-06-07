
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Gamepad2, BookOpen, BrainCircuit } from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import GamePosterCard from '@/components/GamePosterCard.jsx';
import CombinedGameSetupModal from '@/components/CombinedGameSetupModal.jsx';
import { ALL_GAMES } from '@/config/gamePosterConfig.js';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { toast } from 'sonner';

const CATEGORIES = ['All', ...new Set(ALL_GAMES.map(g => g.category))];
const TIERS = ['All', 'Tier 1 (Most Popular)', 'Tier 2 (Popular)', 'Tier 3 (Moderate)', 'Tier 4 (Niche)'];

export default function GameHubPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTier, setSelectedTier] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  
  const [selectedGame, setSelectedGame] = useState(null);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  const filteredGames = useMemo(() => {
    let result = ALL_GAMES;

    if (selectedCategory !== 'All') {
      result = result.filter(g => g.category === selectedCategory);
    }

    if (selectedTier !== 'All') {
      const tierNum = parseInt(selectedTier.match(/\d+/)[0], 10);
      result = result.filter(g => g.tier === tierNum);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(g => (g.name || g.title).toLowerCase().includes(q) || g.category.toLowerCase().includes(q) || (g.description && g.description.toLowerCase().includes(q)));
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'popularity') return a.popularityRank - b.popularityRank;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'name_asc') return (a.name || a.title).localeCompare(b.name || b.title);
      if (sortBy === 'name_desc') return (b.name || b.title).localeCompare(a.name || a.title);
      return 0;
    });

    return result;
  }, [searchQuery, selectedCategory, selectedTier, sortBy]);

  const handleGameClick = (game) => {
    setSelectedGame(game);
    setIsSetupModalOpen(true);
  };

  const handleStartGame = (config) => {
    setIsSetupModalOpen(false);
    toast.success(`Starting ${selectedGame.name || selectedGame.title}...`);
    
    const targetPath = selectedGame.path || `/${selectedGame.id}`;
    navigate(targetPath, { state: { gameConfig: config } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>{t('games.title')} | NICOLENIUM</title></Helmet>
      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-[1400px] mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card p-8 rounded-3xl border-2 border-border shadow-sm">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{t('games.title')}</h1>
              <p className="text-lg text-muted-foreground font-medium max-w-2xl">{t('games.subtitle')}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => navigate('/learning')} variant="outline" className="font-bold border-2 h-12 px-6"><BookOpen className="w-4 h-4 mr-2"/> {t('games.learning')}</Button>
              <Button onClick={() => navigate('/quizzes')} variant="outline" className="font-bold border-2 h-12 px-6"><BrainCircuit className="w-4 h-4 mr-2"/> {t('games.quizzes')}</Button>
            </div>
          </div>

          <div className="bg-card border-2 border-border/50 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder={t('common.search')} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-background border-2 h-14 rounded-xl text-lg font-medium"
              />
            </div>
            
            <div className="flex flex-wrap gap-3 w-full lg:w-auto items-center">
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger className="w-[180px] bg-background border-2 rounded-xl h-12 font-bold">
                  <SelectValue placeholder="Filter by Tier" />
                </SelectTrigger>
                <SelectContent>
                  {TIERS.map(tier => <SelectItem key={tier} value={tier}>{tier}</SelectItem>)}
                </SelectContent>
              </Select>

              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide max-w-[300px] sm:max-w-full">
                {CATEGORIES.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap rounded-xl font-bold h-12 px-6 ${selectedCategory === cat ? 'bg-primary text-primary-foreground shadow-glow-primary border-transparent' : 'border-2'}`}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] bg-background border-2 rounded-xl h-12 font-bold">
                  <Filter className="w-4 h-4 mr-2 text-primary" />
                  <SelectValue placeholder={t('common.sort')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="name_asc">A-Z</SelectItem>
                  <SelectItem value="name_desc">Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}
                  className="h-full relative"
                >
                  <div className="absolute top-3 right-3 z-10 bg-background/90 backdrop-blur-sm border border-border px-2 py-1 rounded-md text-xs font-black shadow-sm">
                    #{game.popularityRank}
                  </div>
                  <GamePosterCard 
                    game={game}
                    onClick={() => handleGameClick(game)}
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
              <h3 className="text-3xl font-black text-foreground mb-3 tracking-tight">{t('games.noGames')}</h3>
              <Button variant="outline" onClick={() => {setSearchQuery(''); setSelectedCategory('All'); setSelectedTier('All');}} className="mt-8 rounded-full font-bold border-2 h-14 px-8 text-lg hover:bg-primary hover:text-primary-foreground">
                {t('games.reset')}
              </Button>
            </motion.div>
          )}

        </div>
      </main>
      <Footer />

      <CombinedGameSetupModal 
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        game={selectedGame}
        onGameStart={handleStartGame}
      />
    </div>
  );
}
