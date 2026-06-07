
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Trophy, Plus, Settings2, Users, Save, Trash2, Calendar, LayoutList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import AdminAccessControl, { PERMISSIONS } from '@/components/AdminAccessControl.jsx';

export default function AdminTournamentManagement() {
  const [activeTab, setActiveTab] = useState('list');
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '', gameType: '', format: 'single_elimination', bracketType: 'single_elimination',
    size: 16, entryFee: 0, prizePool: 0, startDate: '', status: 'upcoming'
  });

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('tournament_presets').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setTournaments(records);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tournaments");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.gameType || !formData.startDate) {
        throw new Error("Missing required fields");
      }
      // Combine date and time to proper ISO if needed, simple save for now
      await pb.collection('tournament_presets').create({
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString()
      }, { $autoCancel: false });
      
      toast.success("Tournament created successfully");
      fetchTournaments();
      setActiveTab('list');
    } catch (err) {
      toast.error(err.message || "Creation failed");
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this tournament?")) return;
    try {
      await pb.collection('tournament_presets').delete(id, { $autoCancel: false });
      toast.success("Tournament deleted");
      fetchTournaments();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <AdminAccessControl requiredRoles={PERMISSIONS.ADMIN}>
      <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
        <Helmet><title>Tournament Management | Admin</title></Helmet>
        
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
            <Trophy className="w-8 h-8 text-primary" /> Tournament Management
          </h1>
          <p className="text-muted-foreground font-medium mt-1">Create, configure, and monitor platform tournaments.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-muted p-1 rounded-xl h-14 w-full justify-start overflow-x-auto">
            <TabsTrigger value="list" className="rounded-lg h-10 px-6 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">Overview</TabsTrigger>
            <TabsTrigger value="create" className="rounded-lg h-10 px-6 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">Create New</TabsTrigger>
            <TabsTrigger value="brackets" className="rounded-lg h-10 px-6 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">Bracket Generator</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <div className="p-12 text-center text-muted-foreground">Loading...</div>
              ) : tournaments.map(t => (
                <Card key={t.id} className="rounded-2xl border-border bg-card shadow-sm hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-center">
                    <div className="flex-1">
                      <div className="flex gap-2 items-center mb-2">
                        <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                          {t.gameType}
                        </span>
                        <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-muted text-muted-foreground border">
                          {t.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold">{t.name}</h3>
                      <p className="text-sm font-medium text-muted-foreground mt-1 line-clamp-1">{t.description}</p>
                    </div>
                    <div className="flex gap-6 items-center text-sm font-bold text-muted-foreground">
                      <div className="text-center"><div className="text-foreground text-lg tabular-nums">{t.size}</div>Max Players</div>
                      <div className="text-center"><div className="text-emerald-500 text-lg tabular-nums">${t.prizePool}</div>Prize</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="h-10 w-10 border-2 rounded-lg"><Settings2 className="w-4 h-4"/></Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(t.id)} className="h-10 w-10 border-2 rounded-lg text-destructive hover:bg-destructive hover:text-destructive-foreground"><Trash2 className="w-4 h-4"/></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="mt-6">
            <Card className="rounded-2xl border-border bg-card shadow-sm">
              <CardHeader className="bg-muted/30 border-b border-border pb-6">
                <CardTitle className="text-xl font-black">Configure New Tournament</CardTitle>
                <CardDescription className="font-medium">Define parameters, rules, and entry requirements.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleCreate} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="font-bold">Tournament Name</Label>
                      <Input value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="h-12 border-2 rounded-xl" required />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-bold">Game Category</Label>
                      <Select value={formData.gameType} onValueChange={v=>setFormData({...formData, gameType: v})}>
                        <SelectTrigger className="h-12 border-2 rounded-xl"><SelectValue placeholder="Select Game" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chess">Chess</SelectItem>
                          <SelectItem value="checkers_8x8">Checkers 8x8</SelectItem>
                          <SelectItem value="ludo">Ludo</SelectItem>
                          <SelectItem value="trivia_master">Trivia Master</SelectItem>
                          <SelectItem value="2048">2048</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="font-bold">Tournament Format</Label>
                      <Select value={formData.format} onValueChange={v=>setFormData({...formData, format: v, bracketType: v})}>
                        <SelectTrigger className="h-12 border-2 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single_elimination">Single Elimination</SelectItem>
                          <SelectItem value="double_elimination">Double Elimination</SelectItem>
                          <SelectItem value="round_robin">Round Robin</SelectItem>
                          <SelectItem value="swiss">Swiss System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="font-bold">Max Participants</Label>
                      <Input type="number" min="2" value={formData.size} onChange={e=>setFormData({...formData, size: parseInt(e.target.value)})} className="h-12 border-2 rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-bold">Prize Pool ($)</Label>
                      <Input type="number" min="0" value={formData.prizePool} onChange={e=>setFormData({...formData, prizePool: parseInt(e.target.value)})} className="h-12 border-2 rounded-xl" />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-bold">Start Date</Label>
                      <Input type="date" value={formData.startDate} onChange={e=>setFormData({...formData, startDate: e.target.value})} className="h-12 border-2 rounded-xl" required />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={()=>setActiveTab('list')} className="h-12 px-6 font-bold border-2 rounded-xl">Cancel</Button>
                    <Button type="submit" className="h-12 px-8 font-bold shadow-glow-primary rounded-xl"><Save className="w-4 h-4 mr-2" /> Save Tournament</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brackets" className="mt-6">
            <Card className="rounded-2xl border-border bg-card shadow-sm text-center py-24">
              <LayoutList className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-2xl font-black mb-2">Bracket Generator</h3>
              <p className="text-muted-foreground font-medium max-w-md mx-auto mb-6">Select an active tournament to auto-generate brackets based on participant rankings and format settings.</p>
              <Button disabled className="h-12 rounded-xl font-bold border-2">Select Tournament First</Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminAccessControl>
  );
}
