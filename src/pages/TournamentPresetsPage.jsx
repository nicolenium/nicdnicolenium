
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Filter, Trophy, Users, Clock, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function TournamentPresetsPage() {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedPreset, setSelectedPreset] = useState(null);

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const records = await pb.collection('tournament_presets').getFullList({
          sort: 'name',
          $autoCancel: false
        });
        setPresets(records);
      } catch (error) {
        console.error("Failed to load tournament presets:", error);
        toast.error("Could not load tournaments. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPresets();
  }, []);

  const gameTypes = useMemo(() => {
    const types = new Set(presets.map(p => p.gameType));
    return ['all', ...Array.from(types).sort()];
  }, [presets]);

  const filteredPresets = useMemo(() => {
    return presets.filter(preset => {
      const matchesSearch = preset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            preset.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGame = selectedGame === 'all' || preset.gameType === selectedGame;
      const matchesDiff = selectedDifficulty === 'all' || preset.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesGame && matchesDiff;
    });
  }, [presets, searchQuery, selectedGame, selectedDifficulty]);

  const handleRegister = () => {
    toast.success(`Registration request sent for ${selectedPreset?.name}`);
    setSelectedPreset(null);
  };

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'easy': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'hard': return 'text-destructive bg-destructive/10 border-destructive/20';
      default: return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Official Tournaments | NICOLENIUM</title></Helmet>
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="bg-card border-2 border-border shadow-sm rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-foreground">Official Tournaments</h1>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">Join officially sanctioned NICOLENIUM tournaments across 38 distinct game categories. Compete for global rankings, prizes, and exclusive badges.</p>
            </div>
            <div className="relative z-10 w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary/20 shrink-0">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
          </div>

          <div className="bg-card border-2 border-border/50 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search tournaments..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-background border-2 h-14 rounded-xl text-lg font-medium"
              />
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger className="w-full md:w-[180px] bg-background border-2 rounded-xl h-14 font-bold">
                  <Filter className="w-4 h-4 mr-2 text-primary" />
                  <SelectValue placeholder="Game Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Games</SelectItem>
                  {gameTypes.filter(t => t !== 'all').map(t => (
                    <SelectItem key={t} value={t}>{t.replace(/_/g, ' ').toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full md:w-[160px] bg-background border-2 rounded-xl h-14 font-bold">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="easy">Beginner</SelectItem>
                  <SelectItem value="medium">Intermediate</SelectItem>
                  <SelectItem value="hard">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-xl font-bold text-muted-foreground">Loading tournaments...</p>
            </div>
          ) : filteredPresets.length === 0 ? (
            <div className="py-24 text-center bg-card rounded-3xl border-2 border-dashed border-border">
              <Trophy className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-foreground mb-2">No tournaments found</h3>
              <p className="text-muted-foreground font-medium">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPresets.map(preset => (
                <Card key={preset.id} className="rounded-2xl border-2 border-border shadow-sm bg-card hover:border-primary transition-colors flex flex-col h-full overflow-hidden">
                  <div className="h-2 w-full bg-gradient-to-r from-primary to-secondary" />
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                        {preset.gameType.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${getDifficultyColor(preset.difficulty)}`}>
                        {preset.difficulty || 'Open'}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-black leading-tight mb-2 text-foreground">{preset.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium mb-6 line-clamp-2">{preset.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-auto mb-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <Users className="w-4 h-4 text-muted-foreground" /> {preset.size || 'Open'} Max
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <Clock className="w-4 h-4 text-muted-foreground" /> {preset.format.replace(/_/g, ' ')}
                      </div>
                    </div>
                    
                    <Button onClick={() => setSelectedPreset(preset)} className="w-full h-12 rounded-xl font-bold border-2">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      <Dialog open={!!selectedPreset} onOpenChange={(open) => !open && setSelectedPreset(null)}>
        {selectedPreset && (
          <DialogContent className="sm:max-w-2xl bg-card border-2 border-border rounded-3xl p-0 overflow-hidden">
            <div className="bg-muted p-8 border-b border-border relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 pointer-events-none" />
              <DialogTitle className="text-3xl font-black text-foreground relative z-10">{selectedPreset.name}</DialogTitle>
              <div className="flex flex-wrap gap-2 mt-4 relative z-10">
                <span className="text-xs font-bold uppercase tracking-widest bg-background border px-3 py-1 rounded-full">{selectedPreset.gameType.replace(/_/g, ' ')}</span>
                <span className="text-xs font-bold uppercase tracking-widest bg-background border px-3 py-1 rounded-full">{selectedPreset.format.replace(/_/g, ' ')}</span>
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${getDifficultyColor(selectedPreset.difficulty)}`}>{selectedPreset.difficulty}</span>
              </div>
            </div>
            
            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-8">
              <section>
                <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">About Tournament</h4>
                <p className="text-base text-foreground font-medium leading-relaxed">{selectedPreset.description}</p>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <section className="bg-muted/50 p-4 rounded-xl border border-border/50">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2"><Trophy className="w-4 h-4"/> Competition Details</h4>
                  <ul className="space-y-2 text-sm font-medium">
                    <li className="flex justify-between"><span className="text-muted-foreground">Format:</span> <span>{selectedPreset.format.replace(/_/g, ' ')}</span></li>
                    <li className="flex justify-between"><span className="text-muted-foreground">Bracket:</span> <span>{selectedPreset.bracketType.replace(/_/g, ' ')}</span></li>
                    <li className="flex justify-between"><span className="text-muted-foreground">Max Players:</span> <span>{selectedPreset.size}</span></li>
                    {presetDate(selectedPreset.startDate) && <li className="flex justify-between"><span className="text-muted-foreground">Starts:</span> <span>{presetDate(selectedPreset.startDate)}</span></li>}
                  </ul>
                </section>
                
                <section className="bg-muted/50 p-4 rounded-xl border border-border/50">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Rules & Regulations</h4>
                  <p className="text-sm font-medium leading-relaxed line-clamp-4">{selectedPreset.rules || 'Standard rules apply.'}</p>
                </section>
              </div>

              {selectedPreset.prizePool > 0 && (
                <section className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-xl text-center">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-1">Prize Pool</h4>
                  <p className="text-4xl font-black text-emerald-600">${selectedPreset.prizePool.toLocaleString()}</p>
                </section>
              )}
            </div>

            <DialogFooter className="bg-muted p-6 border-t border-border sm:justify-between items-center">
              <p className="text-sm font-bold text-muted-foreground hidden sm:block">
                Entry Fee: {selectedPreset.entryFee > 0 ? `$${selectedPreset.entryFee}` : 'Free'}
              </p>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button variant="outline" onClick={() => setSelectedPreset(null)} className="h-12 px-6 font-bold border-2 rounded-xl flex-1 sm:flex-none">Cancel</Button>
                <Button onClick={handleRegister} className="h-12 px-8 font-bold shadow-glow-primary rounded-xl flex-1 sm:flex-none">
                  Register Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

function presetDate(dateStr) {
  if (!dateStr) return null;
  try {
    return format(new Date(dateStr), 'MMM d, yyyy');
  } catch(e) {
    return null;
  }
}
