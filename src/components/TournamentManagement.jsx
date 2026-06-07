
import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Loader2, Plus, Edit, Trash2, Trophy, Image as ImageIcon } from 'lucide-react';

const TournamentManagement = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    gameType: 'checkers',
    maxPlayers: 16,
    status: 'upcoming',
    prizePool: 0,
    rules: '',
    startDate: '',
    location: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('tournaments').getFullList({ sort: '-created', $autoCancel: false });
      setTournaments(records);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const resetForm = () => {
    setFormData({
      id: '', name: '', description: '', gameType: 'checkers', maxPlayers: 16, status: 'upcoming', prizePool: 0, rules: '', startDate: '', location: ''
    });
    setImageFile(null);
  };

  const handleOpenModal = (tournament = null) => {
    if (tournament) {
      setFormData({
        id: tournament.id,
        name: tournament.name || '',
        description: tournament.description || '',
        gameType: tournament.gameType || 'checkers',
        maxPlayers: tournament.maxPlayers || 16,
        status: tournament.status || 'upcoming',
        prizePool: tournament.prizePool || 0,
        rules: tournament.rules || '',
        startDate: tournament.startDate ? tournament.startDate.substring(0, 16) : '',
        location: tournament.location || ''
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('gameType', formData.gameType);
      data.append('maxPlayers', formData.maxPlayers);
      data.append('status', formData.status);
      data.append('prizePool', formData.prizePool);
      data.append('rules', formData.rules);
      data.append('location', formData.location);
      if (formData.startDate) data.append('startDate', new Date(formData.startDate).toISOString());
      if (imageFile) data.append('image', imageFile);

      if (formData.id) {
        await pb.collection('tournaments').update(formData.id, data, { $autoCancel: false });
        toast.success('Tournament updated successfully');
      } else {
        data.append('createdBy', pb.authStore.model.id);
        await pb.collection('tournaments').create(data, { $autoCancel: false });
        toast.success('Tournament created successfully');
      }
      setIsModalOpen(false);
      fetchTournaments();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save tournament');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      try {
        await pb.collection('tournaments').delete(id, { $autoCancel: false });
        toast.success('Tournament deleted');
        fetchTournaments();
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete tournament');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-6 rounded-2xl shadow-sm border border-border">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2"><Trophy className="text-primary w-6 h-6"/> Tournaments</h2>
          <p className="text-muted-foreground mt-1">Manage platform tournaments and competitions</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary text-primary-foreground shadow-md transition-transform active:scale-95">
          <Plus className="w-4 h-4 mr-2" /> New Tournament
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{formData.id ? 'Edit Tournament' : 'Create Tournament'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Name</label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-background text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Game Type</label>
                <Select value={formData.gameType} onValueChange={v => setFormData({...formData, gameType: v})}>
                  <SelectTrigger className="bg-background text-foreground"><SelectValue placeholder="Select Game" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checkers">Checkers</SelectItem>
                    <SelectItem value="ludo">Ludo</SelectItem>
                    <SelectItem value="trivia">Trivia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Max Players</label>
                <Input type="number" required min="2" value={formData.maxPlayers} onChange={e => setFormData({...formData, maxPlayers: e.target.value})} className="bg-background text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Prize Pool ($)</label>
                <Input type="number" value={formData.prizePool} onChange={e => setFormData({...formData, prizePool: e.target.value})} className="bg-background text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Status</label>
                <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                  <SelectTrigger className="bg-background text-foreground"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Start Date & Time</label>
                <Input type="datetime-local" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="bg-background text-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Location</label>
              <Input placeholder="Online or physical address" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="bg-background text-foreground" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Description</label>
              <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-background text-foreground min-h-[80px]" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Rules</label>
              <Textarea value={formData.rules} onChange={e => setFormData({...formData, rules: e.target.value})} className="bg-background text-foreground min-h-[80px]" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Banner Image</label>
              <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="bg-background text-foreground cursor-pointer" />
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground">
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save Tournament'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold text-foreground">Tournament</TableHead>
                <TableHead className="font-bold text-foreground">Game Type</TableHead>
                <TableHead className="font-bold text-foreground">Date</TableHead>
                <TableHead className="font-bold text-foreground">Players</TableHead>
                <TableHead className="font-bold text-foreground">Status</TableHead>
                <TableHead className="font-bold text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tournaments.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No tournaments found</TableCell></TableRow>
              ) : (
                tournaments.map((t) => (
                  <TableRow key={t.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell className="capitalize">{t.gameType}</TableCell>
                    <TableCell>{new Date(t.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{t.currentPlayers || 0} / {t.maxPlayers}</TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        t.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 
                        t.status === 'upcoming' ? 'bg-blue-500/10 text-blue-600' : 'bg-muted text-muted-foreground'
                      }`}>
                        {t.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(t)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
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
        )}
      </div>
    </div>
  );
};

export default TournamentManagement;
