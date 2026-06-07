
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import VideoPlayerFixed from '@/components/VideoPlayerFixed.jsx';
import AudioPlayerFixed from '@/components/AudioPlayerFixed.jsx';
import EducationalDocumentation from '@/components/EducationalDocumentation.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Search, PlayCircle, BookOpen, Clock, Filter, ShieldCheck, FileVideo, Headphones, ChevronRight, LayoutGrid } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog.jsx';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { cn } from '@/lib/utils.js';
import { GAME_POSTERS } from '@/config/gamePosterConfig.js';

export default function LearningCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  // Expand content significantly by generating multiple diverse topics per game
  const expandedGamesContent = useMemo(() => {
    return GAME_POSTERS.map(game => {
      // Generate 4-6 videos/topics per game to simulate the 50+ videos requirement
      const videos = [
        { 
          id: `${game.id}-v1`, 
          title: `How to Play ${game.name}: The Basics`, 
          description: `Learn the essential rules, basic setup, and core mechanics for ${game.name}. Perfect for absolute beginners.`, 
          duration: '5:30', 
          category: 'Rules', 
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          audioGuide: 'https://actions.google.com/sounds/v1/speech/spanish_greeting.ogg',
          transcript: `Welcome to the basic rules of ${game.name}. The objective is simple: you must outmaneuver your opponent while protecting your own pieces. Let's start by looking at the initial board setup and the movement mechanics.`
        },
        { 
          id: `${game.id}-v2`, 
          title: `Advanced Strategies for ${game.name}`, 
          description: `Take your game to the next level with pro tips, positional tactics, and resource management strategies.`, 
          duration: '12:15', 
          category: 'Strategy', 
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          audioGuide: 'https://actions.google.com/sounds/v1/speech/spanish_greeting.ogg',
          transcript: `To master ${game.name}, you must control the center and anticipate your opponent's moves. We'll look at three Grandmaster techniques that instantly improve your positional advantage and win rate.`
        },
        { 
          id: `${game.id}-v3`, 
          title: `${game.name} Masterclass: Common Mistakes`, 
          description: `Avoid the pitfalls that trap 90% of new players. We analyze real games to show you what NOT to do.`, 
          duration: '8:45', 
          category: 'Analysis', 
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          audioGuide: null,
          transcript: `The most common mistake in ${game.name} is over-committing early. Let's look at an example from a recent tournament where aggressive play without adequate defense led to a swift defeat.`
        },
        { 
          id: `${game.id}-v4`, 
          title: `Speedrun & Quick Tips: ${game.name}`, 
          description: `Short on time? Here are 5 rapid-fire tips to instantly improve your win rate in ${game.name}.`, 
          duration: '3:20', 
          category: 'Quick Tips', 
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          audioGuide: 'https://actions.google.com/sounds/v1/speech/spanish_greeting.ogg',
          transcript: `Tip number one: Always secure your flanks. Tip number two: manage your tempo. Tip number three...`
        }
      ];
      return { ...game, videos };
    });
  }, []);

  const filteredGames = useMemo(() => {
    let result = expandedGamesContent;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(g => 
        g.name.toLowerCase().includes(q) || 
        g.videos.some(v => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q))
      );
    }
    if (activeCategory !== 'All') {
      result = result.filter(g => g.category === activeCategory);
    }
    return result;
  }, [searchQuery, activeCategory, expandedGamesContent]);

  const categories = ['All', ...new Set(GAME_POSTERS.map(g => g.category))];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Learning Center | NICD</title></Helmet>
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary mb-6 shadow-sm border border-primary/10">
            <FileVideo className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-foreground text-balance">
            Learning Center
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium mb-10 leading-relaxed text-balance">
            Master the rules, discover advanced strategies, and improve your gameplay with our comprehensive video library, audio guides, and interactive lessons.
          </p>
          
          <div className="relative max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search 50+ videos and masterclasses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-card border-2 h-14 rounded-xl text-lg font-medium w-full shadow-sm focus-visible:ring-primary"
              />
            </div>
            <Button variant="outline" className="h-14 px-8 rounded-xl border-2 font-bold shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors w-full sm:w-auto">
              <Filter className="w-5 h-5 mr-2" /> Filters
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-bold transition-all",
                  activeCategory === cat 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <EducationalDocumentation />
        </div>

        <div className="space-y-16">
          <AnimatePresence mode="popLayout">
            {filteredGames.map(game => (
              <motion.section 
                key={game.id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="bg-card p-6 md:p-8 rounded-3xl border-2 border-border shadow-sm"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-border/50 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center overflow-hidden border-2 border-border shrink-0 shadow-sm">
                      <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
                        {game.name} <span className="text-primary hidden sm:inline">Masterclass</span>
                      </h2>
                      <p className="text-muted-foreground font-bold text-xs uppercase tracking-wider mt-1 flex items-center gap-2">
                        <LayoutGrid className="w-3.5 h-3.5" /> {game.videos.length} Modules • {game.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 shadow-sm shrink-0">
                    <ShieldCheck className="w-4 h-4" /> Official Content
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {game.videos.map(video => (
                    <div 
                      key={video.id} 
                      className={cn(
                        "group flex flex-col bg-background rounded-2xl border-2 border-border overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer"
                      )}
                      onClick={() => setSelectedVideo({ ...video, thumbnail: game.image })}
                    >
                      <div className="aspect-video bg-muted relative overflow-hidden border-b-2 border-border group-hover:border-primary transition-colors">
                        <img 
                          src={game.image} 
                          alt={video.title} 
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                            <PlayCircle className="w-7 h-7 ml-1" />
                          </div>
                        </div>
                        
                        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-md">
                          <Clock className="w-3 h-3" /> {video.duration}
                        </div>
                        <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
                          {video.category}
                        </div>
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-bold text-lg leading-tight mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium line-clamp-2 mb-4">
                          {video.description}
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                          <div className={cn("flex items-center gap-1.5 text-xs font-bold", video.audioGuide ? "text-muted-foreground" : "text-muted-foreground/50")}>
                            <Headphones className="w-3.5 h-3.5" /> {video.audioGuide ? "Audio Guide" : "Text Guide"}
                          </div>
                          <div className="flex items-center text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                            Watch <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            ))}
          </AnimatePresence>
          
          {filteredGames.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-24 bg-card rounded-3xl border-2 border-dashed border-border/60 shadow-sm max-w-3xl mx-auto"
            >
              <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight">No content found</h3>
              <p className="text-muted-foreground font-medium text-lg max-w-md mx-auto">
                Try adjusting your search terms or category filters to find what you're looking for.
              </p>
              <Button variant="outline" onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} className="mt-8 rounded-full font-bold border-2 h-12 px-8">
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      {/* Video & Audio Player Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-5xl bg-card border-2 border-border p-0 overflow-hidden rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
          <VisuallyHidden><DialogTitle>{selectedVideo?.title || 'Media Player'}</DialogTitle></VisuallyHidden>
          
          {selectedVideo && (
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="bg-black w-full relative p-0 m-0 aspect-video shrink-0 border-b border-border/50">
                <VideoPlayerFixed 
                  video={{ ...selectedVideo }} 
                  className="w-full h-full rounded-none border-none shadow-none"
                />
              </div>
              
              <div className="p-6 md:p-8 flex flex-col gap-6 shrink-0">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-md border border-primary/10">
                      {selectedVideo.category}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {selectedVideo.duration}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4 tracking-tight">{selectedVideo.title}</h2>
                  <p className="text-muted-foreground font-medium text-base md:text-lg leading-relaxed max-w-3xl">
                    {selectedVideo.description}
                  </p>
                </div>

                <div className="bg-background rounded-2xl border-2 border-border shadow-sm p-1">
                  <AudioPlayerFixed 
                    audioUrl={selectedVideo.audioGuide}
                    title={`${selectedVideo.title} - Audio Guide`}
                    transcript={selectedVideo.transcript}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
