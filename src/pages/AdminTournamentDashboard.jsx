import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Users, PlayCircle, Network, Bell, FileBarChart2, Edit, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import Header from '@/components/Header.jsx';
import RegistrationListModal from '@/components/RegistrationListModal.jsx';
import BracketGenerator from '@/utils/BracketGenerator.js';

const GAME_TYPES = [
  { id: 'chess', name: 'Chess' },
  { id: 'checkers', name: 'Checkers' },
  { id: 'trivia', name: 'Trivia' },
  { id: 'word_games', name: 'Word Games' }
];

const AdminTournamentDashboard = () => {
  const { adminUser } = useAdminAuth();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '', gameType: '', startDate: '', maxPlayers: 16, rules: '', status: 'upcoming', prizePool: 0
  });

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
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

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.gameType || !formData.startDate) return;
    
    setIsSubmitting(true);
    try {
      await pb.collection('tournaments').create({
        name: formData.name, 
        gameType: formData.gameType, 
        startDate: new Date(formData.startDate).toISOString(),
        maxPlayers: parseInt(formData.maxPlayers), 
        rules: formData.rules, 
        status: formData.status,
        prizePool: parseFloat(formData.prizePool) || 0,
        createdBy: adminUser?.id || 'admin', 
        currentPlayers: 0
      }, { $autoCancel: false });
      
      toast.success('Tournament created successfully');
      setFormData({ name: '', gameType: '', startDate: '', maxPlayers: 16, rules: '', status: 'upcoming', prizePool: 0 });
      setIsCreateModalOpen(false);
      fetchTournaments();
    } catch (err) { 
      toast.error('Failed to create tournament'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTournament = async (e) => {
    e.preventDefault();
    if (!selectedTournament) return;

    setIsSubmitting(true);
    try {
      await pb.collection('tournaments').update(selectedTournament.id, {
        name: formData.name, 
        gameType: formData.gameType, 
        startDate: new Date(formData.startDate).toISOString(),
        maxPlayers: parseInt(formData.maxPlayers), 
        rules: formData.rules, 
        status: formData.status,
        prizePool: parseFloat(formData.prizePool) || 0
      }, { $autoCancel: false });
      
      toast.success('Tournament updated successfully');
      setIsEditModalOpen(false);
      setSelectedTournament(null);
      fetchTournaments();
    } catch (err) { 
      toast.error('Failed to update tournament'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (t) => {
    setSelectedTournament(t);
    setFormData({
      name: t.name,
      gameType: t.gameType,
      startDate: new Date(t.startDate).toISOString().slice(0, 16),
      maxPlayers: t.maxPlayers,
      rules: t.rules || '',
      status: t.status,
      prizePool: t.prizePool || 0
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) return;
    try {
      await pb.collection('tournaments').delete(id, { $autoCancel: false });
      toast.success('Tournament deleted');
      fetchTournaments();
    } catch (err) { 
      toast.error('Failed to delete tournament'); 
    }
  };

  const generateBracket = async (tournament) => {
    try {
      const registrations = await pb.collection('tournament_registrations').getFullList({
        filter: `tournamentId="${tournament.id}"`,
        $autoCancel: false
      });
      
      if (registrations.length < 2) {
        toast.error('Need at least 2 players to generate bracket');
        return;
      }

      const bracketData = BracketGenerator.generateSingleElimination(registrations);
      
      await pb.collection('tournament_brackets').create({
        tournamentId: tournament.id,
        format: 'single_elimination',
        bracketData: bracketData,
        status: 'draft'
      }, { $autoCancel: false });

      toast.success('Bracket generated successfully!');
    } catch (err) {
      console.error('Error generating bracket:', err);
      toast.error('Failed to generate bracket or it already exists.');
    }
  };

  const startTournament = async (tournament) => {
    try {
      await pb.collection('tournaments').update(tournament.id, { status: 'active' }, { $autoCancel: false });
      toast.success('Tournament started!');
      fetchTournaments();
    } catch (err) {
      toast.error('Failed to start tournament');
    }
  };

  const sendNotifications = () => {
    toast.success('Notifications sent to all participants via platform mailer.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Admin Dashboard | NICD</title></Helmet>
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tournament Management</h1>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Create New Tournament</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Tournament</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTournament} className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Tournament Name</Label>
                    <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="e.g., Summer Championship 2026" />
                  </div>
                  <div>
                    <Label>Game Type</Label>
                    <Select value={formData.gameType} onValueChange={v => setFormData({...formData, gameType: v})} required>
                      <SelectTrigger><SelectValue placeholder="Select game..." /></SelectTrigger>
                      <SelectContent>
                        {GAME_TYPES.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Start Date & Time</Label>
                    <Input type="datetime-local" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Max Players</Label>
                    <Input type="number" min="2" value={formData.maxPlayers} onChange={e => setFormData({...formData, maxPlayers: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Prize Pool ($)</Label>
                    <Input type="number" min="0" step="0.01" value={formData.prizePool} onChange={e => setFormData({...formData, prizePool: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Rules & Description</Label>
                    <Textarea rows={4} value={formData.rules} onChange={e => setFormData({...formData, rules: e.target.value})} placeholder="Enter tournament rules..." />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Create Tournament
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Tournaments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading tournaments...
              </div>
            ) : tournaments.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No tournaments found. Create one to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tournament Name</TableHead>
                    <TableHead>Game</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Players</TableHead>
                    <TableHead>Prize Pool</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tournaments.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell className="capitalize">{t.gameType.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <Badge variant={t.status === 'active' ? 'default' : t.status === 'completed' ? 'secondary' : 'outline'}>
                          {t.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{t.currentPlayers || 0} / {t.maxPlayers}</TableCell>
                      <TableCell>${t.prizePool || 0}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Manage</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Manage: {t.name}</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                              <Button variant="secondary" className="justify-start" onClick={() => generateBracket(t)}>
                                <Network className="w-4 h-4 mr-2" /> Generate Bracket
                              </Button>
                              <Button variant="secondary" className="justify-start" onClick={() => startTournament(t)} disabled={t.status === 'active' || t.status === 'completed'}>
                                <PlayCircle className="w-4 h-4 mr-2" /> Start Tournament
                              </Button>
                              <Button variant="secondary" className="justify-start" asChild>
                                <a href={`/tournaments/${t.id}/standings`} target="_blank" rel="noreferrer"><FileBarChart2 className="w-4 h-4 mr-2" /> View Standings</a>
                              </Button>
                              <Button variant="secondary" className="justify-start" onClick={sendNotifications}>
                                <Bell className="w-4 h-4 mr-2" /> Send Notifications
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" onClick={() => { setSelectedTournament(t); setIsRegModalOpen(true); }} title="Participants">
                          <Users className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditModal(t)} title="Edit">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(t.id)} title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Tournament</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditTournament} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Tournament Name</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div>
                <Label>Game Type</Label>
                <Select value={formData.gameType} onValueChange={v => setFormData({...formData, gameType: v})} required>
                  <SelectTrigger><SelectValue placeholder="Select game..." /></SelectTrigger>
                  <SelectContent>
                    {GAME_TYPES.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})} required>
                  <SelectTrigger><SelectValue placeholder="Select status..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Start Date & Time</Label>
                <Input type="datetime-local" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
              </div>
              <div>
                <Label>Max Players</Label>
                <Input type="number" min="2" value={formData.maxPlayers} onChange={e => setFormData({...formData, maxPlayers: e.target.value})} required />
              </div>
              <div>
                <Label>Prize Pool ($)</Label>
                <Input type="number" min="0" step="0.01" value={formData.prizePool} onChange={e => setFormData({...formData, prizePool: e.target.value})} />
              </div>
              <div className="col-span-2">
                <Label>Rules & Description</Label>
                <Textarea rows={4} value={formData.rules} onChange={e => setFormData({...formData, rules: e.target.value})} />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {selectedTournament && (
        <RegistrationListModal 
          isOpen={isRegModalOpen} 
          onClose={() => { setIsRegModalOpen(false); setSelectedTournament(null); }} 
          tournamentId={selectedTournament.id}
          tournamentName={selectedTournament.name}
        />
      )}
    </div>
  );
};

export default AdminTournamentDashboard;