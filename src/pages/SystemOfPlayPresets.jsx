
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useSystemOfPlay } from '@/hooks/useSystemOfPlay.js';
import SystemOfPlayModal from '@/components/SystemOfPlayModal.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { ChevronRight, Settings2, SlidersHorizontal, Gamepad2, Brain, Calculator, Trophy, SpellCheck, Globe } from 'lucide-react';

const getGameIcon = (gameName) => {
  const name = gameName.toLowerCase();
  if (name.includes('chess') || name.includes('checkers')) return <Trophy className="w-8 h-8 text-primary" />;
  if (name.includes('math') || name.includes('science')) return <Calculator className="w-8 h-8 text-accent" />;
  if (name.includes('brain') || name.includes('logic') || name.includes('memory')) return <Brain className="w-8 h-8 text-secondary" />;
  if (name.includes('language') || name.includes('pronunciation') || name.includes('spell') || name.includes('vocab')) return <SpellCheck className="w-8 h-8 text-primary" />;
  if (name.includes('geo') || name.includes('history')) return <Globe className="w-8 h-8 text-accent" />;
  return <Gamepad2 className="w-8 h-8 text-muted-foreground" />;
};

export default function SystemOfPlayPresets() {
  const { presets, loading, fetchPresets } = useSystemOfPlay();
  const [selectedGame, setSelectedGame] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfigureClick = (game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const handleSaveSuccess = () => {
    fetchPresets();
  };

  return (
    <div className="space-y-6 lg:space-y-8 pb-12 animate-in fade-in duration-500">
      <Helmet><title>System of Play | NICD Admin</title></Helmet>
      
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center text-sm text-muted-foreground font-medium mb-2">
            <Link to="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-foreground">System of Play</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <SlidersHorizontal className="w-8 h-8 text-primary" /> System of Play Configurations
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Manage official rulesets, regulations, and match formats for every game on the platform.
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border-border/40 bg-card overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-muted animate-pulse" />
                  <Skeleton className="w-24 h-6 rounded-full" />
                </div>
                <div className="space-y-2 mt-4">
                  <Skeleton className="w-3/4 h-5" />
                  <Skeleton className="w-full h-4" />
                </div>
                <Skeleton className="w-full h-11 mt-6 rounded-xl" />
              </CardContent>
            </Card>
          ))
        ) : (
          presets.map((game) => (
            <Card key={game.gameName} className="rounded-2xl border-border/40 bg-card shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col group">
              <CardContent className="p-6 flex-1 flex flex-col">
                
                <div className="flex justify-between items-start mb-5">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-muted/50 to-muted border border-border/50 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                    {getGameIcon(game.gameName)}
                  </div>
                  <Badge variant={game.selectedVariant ? "default" : "outline"} className="shrink-0 font-bold px-3 py-1">
                    {game.selectedVariant || 'Unconfigured'}
                  </Badge>
                </div>

                <div className="mb-6 flex-1">
                  <h3 className="font-black text-xl leading-tight text-foreground mb-2">
                    {game.gameName}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {game.rules ? game.rules : "No official ruleset loaded. Please configure the system of play."}
                  </p>
                </div>

                <div className="mt-auto">
                  <Button 
                    variant="secondary" 
                    className="w-full rounded-xl font-bold text-secondary-foreground hover:bg-secondary/90 transition-all active:scale-[0.98] border border-border/50"
                    onClick={() => handleConfigureClick(game)}
                  >
                    <Settings2 className="w-4 h-4 mr-2" /> Configure Ruleset
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <SystemOfPlayModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        game={selectedGame} 
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
}
