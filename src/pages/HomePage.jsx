
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import FeaturesSection from '@/components/FeaturesSection.jsx';
import LanguageSupportSection from '@/components/LanguageSupportSection.jsx';
import { ALL_GAMES } from '@/config/gamePosterConfig.js';
import VisitorAccessGuard from '@/components/VisitorAccessGuard.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>NICD NICOLENIUM | Premium Gaming Platform</title>
        <meta name="description" content="Play 38 Amazing Games in 34 Languages on NICD NICOLENIUM." />
      </Helmet>
      
      <Header />
      
      <VisitorAccessGuard>
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-24 lg:py-32 overflow-hidden flex items-center min-h-[80vh]">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none" />
            </div>
            
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary font-bold text-sm mb-8 border border-primary/30 backdrop-blur-sm">
                  <Zap className="w-4 h-4" /> Play 38 Amazing Games in 34 Languages
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1] mb-6">
                  NICD NICOLENIUM<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{t('home.heroTitle') || 'Play & Learn'}</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium mb-10 max-w-2xl leading-relaxed">
                  {t('home.heroSubtitle') || 'The ultimate collection of board games, puzzles, and educational challenges.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="h-16 px-10 text-xl font-black rounded-full shadow-glow-primary transition-transform hover:scale-105">
                    <Link to="/games">
                      {t('common.playNow') || 'Play Now'} <Play className="w-6 h-6 ml-2 fill-current" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <FeaturesSection />
          
          {/* Featured Games Grid Section */}
          <section className="py-24 bg-muted/10 border-y border-border/50">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-foreground">{t('home.featured') || 'Featured Games'}</h2>
                  <p className="text-lg text-muted-foreground font-medium">{t('home.featuredSub') || 'Discover our most popular games.'}</p>
                </div>
                <Button asChild variant="outline" className="rounded-full border-2 font-bold h-12 px-6 hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
                  <Link to="/games">{t('home.allGames') || 'All Games'} <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {ALL_GAMES.filter(g => g.tier === 1 || g.tier === 2).slice(0, 12).map((game) => {
                  return (
                    <Link 
                      key={game.id} 
                      to={game.path} 
                      className="flex flex-col items-center p-4 bg-card rounded-3xl border-2 border-border shadow-sm hover:border-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-primary group outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <div className="w-full aspect-[4/3] rounded-xl bg-muted overflow-hidden mb-4 relative">
                        <img 
                          src={game.image} 
                          alt={game.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-300" />
                        
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <div className="w-8 h-8 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center backdrop-blur-sm shadow-md transform group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-4 h-4 ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <h3 className="font-bold text-center text-sm sm:text-base leading-tight mb-2 text-foreground group-hover:text-primary transition-colors">{game.name}</h3>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground mt-auto">
                        {game.category?.split(' ')[0] || 'Game'}
                      </span>
                    </Link>
                  );
                })}
              </div>
              
              <div className="mt-16 text-center">
                <Button asChild size="lg" className="rounded-full font-bold h-16 px-10 text-xl shadow-glow-primary hover:scale-105 transition-transform">
                  <Link to="/games">{t('home.allGames') || 'Explore All Games'}</Link>
                </Button>
              </div>
            </div>
          </section>

          <LanguageSupportSection />

          {/* CTA Section */}
          <section className="py-24 relative overflow-hidden border-t border-border bg-background">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary)/0.15),transparent_50%)] pointer-events-none" />
            <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">{t('home.ctaTitle') || 'Ready to start playing?'}</h2>
              <p className="text-xl text-muted-foreground mb-10 font-medium">{t('home.ctaSub') || 'Join thousands of players worldwide.'}</p>
              <Button asChild size="lg" className="h-16 px-10 text-xl font-black rounded-full shadow-glow-primary hover:scale-105 transition-transform">
                <Link to="/signup">
                  {t('menu.signup') || 'Sign Up Now'} <ArrowRight className="w-6 h-6 ml-2" />
                </Link>
              </Button>
            </div>
          </section>
        </main>
      </VisitorAccessGuard>
      
      <Footer />
    </div>
  );
}
