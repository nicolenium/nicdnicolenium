
import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Plus, Search, Edit2, Trash2, Loader2, Trophy, Image as ImageIcon, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { TOURNAMENT_PRESETS } from '@/utils/TournamentPresets.js';

export default function TournamentManagement() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const defaultRules = {
    gameRules: '', timeControls: '', pairingsSystem: '',
    scoringSystem: '', tiebreakRules: '', eliminationRules: '', prizeDistribution: ''
  };

  const [formData, setFormData] = useState({
    id: '', name: '', game_type: 'chess', tournament_format: 'Swiss System',
    maxPlayers: 16, currentPlayers: 0, prizePool: 0, 
    startDate: '', endDate: '', status: 'upcoming', 
    description: '', location: '', rules: defaultRules
  });

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('tournaments').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setTournaments(records);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      toast.error('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const applyPreset = (presetKey) => {
    const preset = TOURNAMENT_PRESETS[presetKey];
    if (!preset) return;
    setFormData(prev => ({
      ...prev,
      game_type: preset.id,
      tournament_format: preset.format,
      rules: { ...preset.rules }
    }));
    toast.info(`${preset.name} preset loaded`);
  };

  const handleOpenModal = (tournament = null) => {
    if (tournament) {
      let parsedRules = defaultRules;
      if (tournament.rules) {
        if (typeof tournament.rules === 'string') {
          try { parsedRules = JSON.parse(tournament.rules); } catch(e) { parsedRules.gameRules = tournament.rules; }
        } else {
          parsedRules = { ...defaultRules, ...tournament.rules };
        }
      }
      
      setFormData({
        id: tournament.id,
        name: tournament.name || '',
        game_type: tournament.game_type || tournament.gameType || 'chess',
        tournament_format: tournament.tournament_format || 'Swiss System',
        maxPlayers: tournament.maxPlayers || 16,
        currentPlayers: tournament.currentPlayers || 0,
        prizePool: tournament.prizePool || 0,
        startDate: tournament.startDate ? tournament.startDate.substring(0, 16) : '',
        endDate: tournament.endDate ? tournament.endDate.substring(0, 16) : '',
        status: tournament.status || 'upcoming',
        description: tournament.description || '',
        location: tournament.location || '',
        rules: parsedRules
      });
    } else {
      setFormData({
        id: '', name: '', game_type: 'chess', tournament_format: 'Swiss System',
        maxPlayers: 16, currentPlayers: 0, prizePool: 0, 
        startDate: '', endDate: '', status: 'upcoming', 
        description: '', location: '', rules: { ...defaultRules }
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const updateRule = (key, value) => {
    setFormData(prev => ({
      ...prev,
      rules: { ...prev.rules, [key]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.startDate) {
      toast.error('Name and Start Date are required');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('game_type', formData.game_type);
      data.append('gameType', formData.game_type); // Backup for legacy usage
      data.append('tournament_format', formData.tournament_format);
      data.append('maxPlayers', formData.maxPlayers);
      data.append('currentPlayers', formData.currentPlayers);
      data.append('prizePool', formData.prizePool);
      data.append('status', formData.status);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('rules', JSON.stringify(formData.rules));
      
      if (formData.startDate) data.append('startDate', new Date(formData.startDate).toISOString());
      if (formData.endDate) data.append('endDate', new Date(formData.endDate).toISOString());
      if (imageFile) data.append('image', imageFile);

      if (formData.id) {
        await pb.collection('tournaments').update(formData.id, data, { $autoCancel: false });
        toast.success('Tournament updated successfully');
      } else {
        data.append('createdBy', pb.authStore.model?.id || '');
        const record = await pb.collection('tournaments').create(data, { $autoCancel: false });
        
        // Auto-generate shareable link after creation
        const shareLink = `/tournament/${record.id}`;
        await pb.collection('tournaments').update(record.id, { shareable_link: shareLink }, { $autoCancel: false });
        
        toast.success('Tournament created with shareable link: ' + shareLink);
      }
      
      setIsModalOpen(false);
      fetchTournaments();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Failed to save tournament');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) return;
    try {
      await pb.collection('tournaments').delete(id, { $autoCancel: false });
      toast.success('Tournament deleted successfully');
      fetchTournaments();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete tournament');
    }
  };

  const filteredTournaments = tournaments.filter(t => 
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.game_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-2xl shadow-sm border border-border">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2"><Trophy className="text-primary w-6 h-6"/> Tournaments Arena</h1>
          <p className="text-muted-foreground mt-1">Manage competitions, rules, and brackets.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary text-primary-foreground shadow-md font-bold transition-transform active:scale-95">
          <Plus className="w-4 h-4 mr-2" /> New Tournament
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-card text-card-foreground border-border p-0 rounded-2xl">
          <DialogHeader className="px-6 py-4 border-b border-border bg-muted/20">
            <DialogTitle className="text-xl font-bold">{formData.id ? 'Configure Tournament' : 'Create Tournament'}</DialogTitle>
            <DialogDescription>Setup format, game rules, and schedule. Use presets for quick configuration.</DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {!formData.id && (
              <div className="mb-6 p-4 border border-primary/20 bg-primary/5 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
                <span className="text-sm font-bold text-primary">Load Quick Preset:</span>
                <div className="flex gap-2 flex-wrap">
                  {Object.values(TOURNAMENT_PRESETS).map(preset => (
                    <Button key={preset.id} variant="outline" size="sm" onClick={() => applyPreset(preset.id)} className="text-xs font-bold border-primary/30 hover:bg-primary hover:text-primary-foreground">
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <form id="tournament-form" onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 mb-6">
                  <TabsTrigger value="general">General Info</TabsTrigger>
                  <TabsTrigger value="rules">Rules & Format</TabsTrigger>
                  <TabsTrigger value="media">Media & Extra</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Tournament Name *</label>
                      <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Game Type</label>
                      <Select value={formData.game_type} onValueChange={v => setFormData({...formData, game_type: v})}>
                        <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chess">Chess</SelectItem>
                          <SelectItem value="checkers_8x8">Checkers 8x8</SelectItem>
                          <SelectItem value="checkers_10x10">Checkers 10x10</SelectItem>
                          <SelectItem value="ludo">Ludo</SelectItem>
                          <SelectItem value="tictactoe">Tic Tac Toe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Tournament Format</label>
                      <Input required value={formData.tournament_format} onChange={e => setFormData({...formData, tournament_format: e.target.value})} className="bg-background" placeholder="e.g. Swiss System, Knockout" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Status</label>
                      <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                        <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Start Date & Time *</label>
                      <Input type="datetime-local" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">End Date & Time</label>
                      <Input type="datetime-local" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Max Players</label>
                      <Input type="number" min="2" value={formData.maxPlayers} onChange={e => setFormData({...formData, maxPlayers: e.target.value})} className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Prize Pool ($)</label>
                      <Input type="number" min="0" value={formData.prizePool} onChange={e => setFormData({...formData, prizePool: e.target.value})} className="bg-background" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Description / Overview</label>
                    <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-background min-h-[100px]" placeholder="General tournament information..." />
                  </div>
                </TabsContent>

                <TabsContent value="rules" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-blue-500">Game Rules</label>
                      <Textarea value={formData.rules.gameRules} onChange={e => updateRule('gameRules', e.target.value)} className="bg-background min-h-[80px]" placeholder="Specific in-game rules (e.g. Touch-move applies)" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-amber-500">Time Controls</label>
                      <Textarea value={formData.rules.timeControls} onChange={e => updateRule('timeControls', e.target.value)} className="bg-background min-h-[80px]" placeholder="e.g. 5 mins + 0s increment" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-emerald-500">Pairings System</label>
                      <Textarea value={formData.rules.pairingsSystem} onChange={e => updateRule('pairingsSystem', e.target.value)} className="bg-background min-h-[80px]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-purple-500">Scoring System</label>
                      <Textarea value={formData.rules.scoringSystem} onChange={e => updateRule('scoringSystem', e.target.value)} className="bg-background min-h-[80px]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-pink-500">Tiebreak Rules</label>
                      <Textarea value={formData.rules.tiebreakRules} onChange={e => updateRule('tiebreakRules', e.target.value)} className="bg-background min-h-[80px]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-red-500">Elimination Rules</label>
                      <Textarea value={formData.rules.eliminationRules} onChange={e => updateRule('eliminationRules', e.target.value)} className="bg-background min-h-[80px]" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-yellow-500">Prize Distribution</label>
                      <Textarea value={formData.rules.prizeDistribution} onChange={e => updateRule('prizeDistribution', e.target.value)} className="bg-background min-h-[80px]" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Cover Image</label>
                    <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="bg-background cursor-pointer" />
                  </div>
                  {formData.id && (
                    <div className="space-y-2 pt-4 border-t border-border">
                      <label className="text-sm font-bold">Shareable Link Reference</label>
                      <div className="flex gap-2">
                        <Input readOnly value={`/tournament/${formData.id}`} className="bg-muted font-mono" />
                        <Button type="button" variant="secondary" onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/tournament/${formData.id}`);
                          toast.success("Link copied!");
                        }}><Copy className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </form>
          </div>
          
          <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="tournament-form" disabled={submitting} className="bg-primary text-primary-foreground font-bold shadow-md">
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : formData.id ? 'Save Changes' : 'Create & Generate Link'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search tournaments..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background border-border" 
            />
          </div>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border">
                  <TableHead className="font-bold">Name</TableHead>
                  <TableHead className="font-bold">Game</TableHead>
                  <TableHead className="font-bold">Format</TableHead>
                  <TableHead className="font-bold">Start Date</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTournaments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      <div className="flex flex-col items-center gap-3">
                        <Trophy className="w-12 h-12 text-muted-foreground/30" />
                        <p>No tournaments found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTournaments.map((t) => (
                    <TableRow key={t.id} className="border-border hover:bg-muted/30 transition-colors">
                      <TableCell className="font-bold text-foreground">{t.name}</TableCell>
                      <TableCell className="text-muted-foreground capitalize">{(t.game_type || t.gameType)?.replace('_', ' ')}</TableCell>
                      <TableCell className="text-muted-foreground">{t.tournament_format || '-'}</TableCell>
                      <TableCell className="whitespace-nowrap">{t.startDate ? new Date(t.startDate).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${
                          t.status === 'active' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 
                          t.status === 'completed' ? 'bg-slate-500/15 text-slate-600 dark:text-slate-400' : 
                          'bg-primary/15 text-primary'
                        }`}>
                          {t.status || 'upcoming'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(t)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
