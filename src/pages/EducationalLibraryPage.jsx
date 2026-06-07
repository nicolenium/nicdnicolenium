
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import DocumentViewer from '@/components/DocumentViewer.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Search, BookOpen, Filter, FileText, ArrowRight, Layers, GraduationCap, ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils.js';

// Robust categorized fallback content to ensure full functionality and structure
const MOCK_LIBRARY = [
  // Chess
  { id: 'ch-1', title: 'Chess Openings Encyclopedia', category: 'Chess', topic: 'Strategy', content: 'The comprehensive guide to White and Black openings. \n\n1. Sicilian Defense\n2. Ruy Lopez\n3. French Defense\n\nStudy these patterns to dominate the early game.', difficulty: 'Advanced', language: 'English', created: '2025-03-01T00:00:00Z', size: '4.5 MB' },
  { id: 'ch-2', title: 'Endgame Fundamentals', category: 'Chess', topic: 'Tactics', content: 'Mastering the final stages of Chess. King and Pawn endings, Rook endgames, and mating patterns with minor pieces.', difficulty: 'Intermediate', language: 'English', created: '2025-03-05T00:00:00Z', size: '2.1 MB' },
  { id: 'ch-3', title: 'Aperturas de Ajedrez', category: 'Chess', topic: 'Strategy', content: 'Guía de aperturas fundamentales. Defensa Siciliana, Ruy López y Defensa Francesa.', difficulty: 'Advanced', language: 'Spanish', created: '2025-03-02T00:00:00Z', size: '4.5 MB' },
  
  // Checkers
  { id: 'ck-1', title: 'Checkers: Forced Capture Tactics', category: 'Checkers', topic: 'Tactics', content: 'Using mandatory captures to set traps. This guide covers the 2-for-1 sacrifice and bridge-building techniques.', difficulty: 'Intermediate', language: 'English', created: '2025-03-05T00:00:00Z', size: '1.5 MB' },
  { id: 'ck-2', title: '10x10 International Checkers Guide', category: 'Checkers', topic: 'Rules', content: 'Differences between 8x8 and 10x10 checkers. Understanding flying kings and maximal capture rules.', difficulty: 'Beginner', language: 'English', created: '2025-03-08T00:00:00Z', size: '1.8 MB' },

  // Ludo
  { id: 'ld-1', title: 'Ludo Probability Analysis', category: 'Ludo', topic: 'Theory', content: 'Mathematical analysis of dice rolls in Ludo and optimal piece movement strategies based on distance from base.', difficulty: 'Advanced', language: 'English', created: '2025-03-10T00:00:00Z', size: '2.0 MB' },
  { id: 'ld-2', title: 'Estrategias de Ludo', category: 'Ludo', topic: 'Theory', content: 'Análisis de probabilidad de dados en Ludo y movimiento óptimo.', difficulty: 'Advanced', language: 'Spanish', created: '2025-03-11T00:00:00Z', size: '2.0 MB' },

  // Dominoes
  { id: 'dm-1', title: 'Dominoes Scoring Guide', category: 'Dominoes', topic: 'Rules', content: 'How to calculate points efficiently in Draw and Block dominoes variations. Recognizing board ends.', difficulty: 'Beginner', language: 'English', created: '2025-03-12T00:00:00Z', size: '1.1 MB' },
  { id: 'dm-2', title: 'Advanced Domino Blocking', category: 'Dominoes', topic: 'Strategy', content: 'Techniques for locking the board and forcing opponent passes by reading their missing suits.', difficulty: 'Advanced', language: 'English', created: '2025-03-14T00:00:00Z', size: '1.9 MB' },

  // Connect Four
  { id: 'cf-1', title: 'Connect Four Center Control', category: 'Connect Four', topic: 'Strategy', content: 'Why the center column is the most important real estate in Connect Four and how to secure it early.', difficulty: 'Intermediate', language: 'English', created: '2025-03-15T00:00:00Z', size: '0.9 MB' },

  // Educational
  { id: 'ed-1', title: 'Spanish Phrasal Verbs Guide', category: 'Language', topic: 'Vocabulary', content: 'Comprehensive guide to mastering Spanish phrasal verbs. Common usage and examples...\n\n1. Echar de menos (To miss)\n2. Dar a luz (To give birth)\n3. Darse cuenta (To realize)', difficulty: 'Intermediate', language: 'Spanish', created: '2025-01-10T00:00:00Z', size: '2.4 MB' },
  { id: 'ed-2', title: 'Calculus Fundamentals', category: 'STEM', topic: 'Mathematics', content: 'Limits, derivatives, and integrals explained simply. Visualizing slopes and areas under curves.', difficulty: 'Intermediate', language: 'English', created: '2025-03-15T00:00:00Z', size: '6.2 MB' }
];

const CATEGORIES = ['All', 'Chess', 'Checkers', 'Ludo', 'Dominoes', 'Connect Four', 'Language', 'STEM'];
const LANGUAGES = ['All', 'English', 'Spanish', 'French', 'German'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const TOPICS = ['All', 'Strategy', 'Tactics', 'Rules', 'Theory', 'Vocabulary', 'Mathematics'];

export default function EducationalLibraryPage() {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters and Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLanguage, setActiveLanguage] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState('All');
  const [activeTopic, setActiveTopic] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const records = await pb.collection('game_guides').getFullList({
          sort: '-created',
          $autoCancel: false
        });
        
        if (records && records.length > 0) {
          // Robust deduplication based on Title + Language to prevent Dominoes flood
          const uniqueDocsMap = new Map();
          
          records.forEach(r => {
            const mappedCat = r.gameType || r.category || 'General';
            const mappedTopic = r.topic || r.section || 'Misc';
            const lang = r.language || 'English';
            const key = `${r.title?.trim()}-${lang}`;
            
            if (!uniqueDocsMap.has(key)) {
              uniqueDocsMap.set(key, {
                ...r,
                category: mappedCat.charAt(0).toUpperCase() + mappedCat.slice(1).replace('_', ' '),
                topic: mappedTopic.charAt(0).toUpperCase() + mappedTopic.slice(1).replace('_', ' '),
                language: lang,
                difficulty: r.difficulty ? (r.difficulty.charAt(0).toUpperCase() + r.difficulty.slice(1)) : 'Intermediate'
              });
            }
          });
          
          let deduplicated = Array.from(uniqueDocsMap.values());
          
          // Ensure diversity: if DB only has one category, merge with MOCK_LIBRARY
          const catsInDb = new Set(deduplicated.map(d => d.category));
          if (catsInDb.size < 3) {
            deduplicated = [...deduplicated, ...MOCK_LIBRARY.filter(m => !catsInDb.has(m.category))];
          }
          
          setDocuments(deduplicated);
        } else {
          setDocuments(MOCK_LIBRARY);
        }
      } catch (err) {
        console.error("Failed to load documents, using fallback:", err);
        setDocuments(MOCK_LIBRARY);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const filteredAndSortedDocs = useMemo(() => {
    let result = documents.filter(doc => {
      const matchSearch = !searchQuery || 
        doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content?.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchCategory = activeCategory === 'All' || doc.category === activeCategory;
      const matchTopic = activeTopic === 'All' || doc.topic === activeTopic;
      const matchLanguage = activeLanguage === 'All' || doc.language === activeLanguage;
      const matchDifficulty = activeDifficulty === 'All' || doc.difficulty === activeDifficulty;
      
      return matchSearch && matchCategory && matchTopic && matchLanguage && matchDifficulty;
    });

    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created || 0) - new Date(a.created || 0);
      if (sortBy === 'oldest') return new Date(a.created || 0) - new Date(b.created || 0);
      if (sortBy === 'name') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'difficulty') return (a.difficulty || '').localeCompare(b.difficulty || '');
      return 0;
    });

    return result;
  }, [documents, searchQuery, activeCategory, activeTopic, activeLanguage, activeDifficulty, sortBy]);

  // Derived available categories based on actual content to prevent empty states
  const availableCategories = useMemo(() => {
    const cats = new Set(documents.map(d => d.category));
    return ['All', ...Array.from(cats)].sort();
  }, [documents]);

  const availableTopics = useMemo(() => {
    let filtered = documents;
    if (activeCategory !== 'All') filtered = filtered.filter(d => d.category === activeCategory);
    const topics = new Set(filtered.map(d => d.topic).filter(Boolean));
    return ['All', ...Array.from(topics)].sort();
  }, [activeCategory, documents]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Educational Library | NICD</title></Helmet>
      <Header />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-muted/30 border-b border-border py-3">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center text-sm font-medium text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors flex items-center"><Home className="w-4 h-4 mr-1" /> Home</Link>
            <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
            <span className="text-foreground font-bold">Educational Library</span>
            {activeCategory !== 'All' && (
              <>
                <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
                <span className="text-primary font-bold">{activeCategory}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 py-12">
        
        {/* Page Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6 shadow-sm border border-primary/20">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-foreground">
              Knowledge Base
            </h1>
            <p className="text-lg text-muted-foreground font-medium text-balance">
              Explore our diverse library of rules, advanced strategy guides, and documentation across all games and subjects.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search guides..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card border-2 rounded-xl font-medium focus-visible:ring-primary shadow-sm h-12"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40 h-12 rounded-xl border-2 font-bold bg-card shadow-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="font-medium rounded-xl">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="bg-card border-2 border-border rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" /> Category
              </h3>
              <div className="space-y-1">
                {availableCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setActiveTopic('All'); }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl font-bold transition-all text-sm",
                      activeCategory === cat 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card border-2 border-border rounded-2xl p-5 shadow-sm space-y-6">
              <div>
                <h3 className="font-black text-sm uppercase tracking-wider mb-3 text-muted-foreground">Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTIES.map(diff => (
                    <button
                      key={diff}
                      onClick={() => setActiveDifficulty(diff)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                        activeDifficulty === diff 
                          ? "bg-secondary text-secondary-foreground border-secondary" 
                          : "bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                      )}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-black text-sm uppercase tracking-wider mb-3 text-muted-foreground">Language</h3>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      onClick={() => setActiveLanguage(lang)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                        activeLanguage === lang 
                          ? "bg-primary text-primary-foreground border-primary" 
                          : "bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {availableTopics.length > 1 && (
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider mb-3 text-muted-foreground">Topic</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableTopics.map(topic => (
                      <button
                        key={topic}
                        onClick={() => setActiveTopic(topic)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                          activeTopic === topic 
                            ? "bg-foreground text-background border-foreground" 
                            : "bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                        )}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-card rounded-3xl border-2 border-border animate-pulse p-6">
                    <div className="h-4 bg-muted rounded w-1/4 mb-4" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                    <div className="h-4 bg-muted rounded w-full mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : filteredAndSortedDocs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-20 text-center bg-card rounded-3xl border-2 border-dashed border-border/60 shadow-sm"
              >
                <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight">No resources found</h3>
                <p className="text-muted-foreground font-medium text-lg mb-8 max-w-md mx-auto">
                  Try clearing your search or selecting a different category/language.
                </p>
                <Button onClick={() => { setSearchQuery(''); setActiveCategory('All'); setActiveTopic('All'); setActiveLanguage('All'); setActiveDifficulty('All'); }} variant="outline" className="font-bold border-2 rounded-full h-12 px-8">
                  Reset All Filters
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredAndSortedDocs.map((doc, i) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: (i % 10) * 0.05 }}
                      key={`${doc.id}-${i}`}
                    >
                      <Card 
                        className="group flex flex-col h-full bg-card border-2 border-border shadow-sm hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden rounded-3xl"
                        onClick={() => setSelectedDoc(doc)}
                      >
                        <CardContent className="p-6 flex-1 flex flex-col relative">
                          {/* Decorative background element */}
                          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 pointer-events-none">
                            <BookOpen className="w-24 h-24 text-primary" />
                          </div>
                          
                          <div className="flex items-center gap-2 mb-4 relative z-10">
                            <Badge variant="outline" className="bg-background font-bold uppercase tracking-wider text-[10px]">
                              {doc.category}
                            </Badge>
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 font-bold uppercase tracking-wider text-[10px] border-transparent">
                              {doc.topic}
                            </Badge>
                          </div>
                          
                          <h3 className="font-black text-xl mb-3 leading-tight group-hover:text-primary transition-colors text-balance relative z-10">
                            {doc.title}
                          </h3>
                          
                          <p className="text-muted-foreground text-sm font-medium line-clamp-3 mb-6 leading-relaxed relative z-10">
                            {doc.content}
                          </p>
                          
                          <div className="mt-auto pt-4 border-t border-border/50 grid grid-cols-2 gap-y-2 text-xs font-bold text-muted-foreground relative z-10">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className={cn("w-2 h-2 rounded-full", doc.difficulty === 'Beginner' ? 'bg-emerald-500' : doc.difficulty === 'Advanced' ? 'bg-destructive' : 'bg-amber-500')}></span>
                              {doc.difficulty || 'All Levels'}
                            </div>
                            <div className="flex items-center justify-end gap-1.5 truncate">
                              {doc.language || 'English'}
                            </div>
                            <div className="flex items-center gap-1.5 opacity-70">
                              {doc.size || 'Text Document'}
                            </div>
                            <div className="flex items-center justify-end text-primary group-hover:translate-x-1 transition-transform">
                              Open <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />

      <DocumentViewer 
        docData={selectedDoc} 
        isOpen={!!selectedDoc} 
        onClose={() => setSelectedDoc(null)} 
      />
    </div>
  );
}
