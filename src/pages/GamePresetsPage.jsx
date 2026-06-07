
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useGamePresets } from '@/hooks/useGamePresets.js';
import GamePresetModal from '@/components/GamePresetModal.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { ChevronRight, Settings2, Clock, DollarSign, Trophy, FileText, AlertCircle } from 'lucide-react';

export default function GamePresetsPage() {
  const { presets, loading, error, fetchGamePresets } = useGamePresets();
  const [selectedGame, setSelectedGame] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfigureClick = (game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const handleSaveSuccess = () => {
    fetchGamePresets();
  };

  return (
    <div className="space-y-6 lg:space-y-8 pb-12 animate-in fade-in duration-500">
      <Helmet><title>Game Presets | NICD Admin</title></Helmet>
      
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center text-sm text-muted-foreground font-medium mb-2">
            <Link to="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-foreground">Game Presets</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <Settings2 className="w-8 h-8 text-primary" /> Game Presets & Rules
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Configure default rulesets, entry fees, prize pools, and time limits for all platform games globally.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive-foreground p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <div>
            <p className="font-bold text-destructive">Failed to load presets.</p>
            <p className="text-sm text-destructive/90">{error}</p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto bg-transparent border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={fetchGamePresets}>Retry</Button>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border-border/40 bg-card overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="w-1/2 h-6" />
                  <Skeleton className="w-20 h-5 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-2/3 h-4" />
                </div>
                <Skeleton className="w-full h-10 mt-4 rounded-xl" />
              </CardContent>
            </Card>
          ))
        ) : (
          presets.map((game) => (
            <Card key={game.id} className="rounded-2xl border-border/40 bg-card shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col">
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg leading-tight text-foreground truncate pr-2" title={game.gameName}>
                    {game.gameName}
                  </h3>
                  <Badge variant={game.rules ? "default" : "secondary"} className="shrink-0 font-medium">
                    {game.selectedPreset || 'Standard'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5 flex-1 content-start">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg border border-border/20">
                    <DollarSign className="w-4 h-4 shrink-0 text-secondary" />
                    <span className="truncate">Fee: {game.entryFee !== null ? `$${game.entryFee}` : 'Free'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg border border-border/20">
                    <Trophy className="w-4 h-4 shrink-0 text-accent" />
                    <span className="truncate">Prize: {game.prizeAmount !== null ? `$${game.prizeAmount}` : 'None'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg border border-border/20 col-span-2">
                    <Clock className="w-4 h-4 shrink-0 text-primary" />
                    <span className="truncate">Time Limit: {game.timeLimit || 'Unlimited'}</span>
                  </div>
                </div>

                <div className="mt-auto flex gap-2">
                  <Button 
                    variant="default" 
                    className="w-full rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                    onClick={() => handleConfigureClick(game)}
                  >
                    <Settings2 className="w-4 h-4 mr-2" /> Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <GamePresetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        game={selectedGame} 
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
}
