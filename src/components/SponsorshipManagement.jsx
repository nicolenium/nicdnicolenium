
import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Loader2, Plus, Edit, Trash2, Shield, ExternalLink, Image as ImageIcon } from 'lucide-react';

const SponsorshipManagement = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '', name: '', description: '', website: '', contactEmail: '', tier: 'bronze', status: 'active'
  });
  const [logoFile, setLogoFile] = useState(null);

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('sponsors').getFullList({ sort: '-created', $autoCancel: false });
      setSponsors(records);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load sponsors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleOpenModal = (sponsor = null) => {
    if (sponsor) {
      setFormData({
        id: sponsor.id, name: sponsor.name, description: sponsor.description || '',
        website: sponsor.website || '', contactEmail: sponsor.contactEmail || '',
        tier: sponsor.tier || 'bronze', status: sponsor.status || 'active'
      });
    } else {
      setFormData({ id: '', name: '', description: '', website: '', contactEmail: '', tier: 'bronze', status: 'active' });
    }
    setLogoFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('website', formData.website);
      data.append('contactEmail', formData.contactEmail);
      data.append('tier', formData.tier);
      data.append('status', formData.status);
      if (logoFile) data.append('logo', logoFile);

      if (formData.id) {
        await pb.collection('sponsors').update(formData.id, data, { $autoCancel: false });
        toast.success('Sponsor updated successfully');
      } else {
        await pb.collection('sponsors').create(data, { $autoCancel: false });
        toast.success('Sponsor created successfully');
      }
      setIsModalOpen(false);
      fetchSponsors();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save sponsor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this sponsor?')) {
      try {
        await pb.collection('sponsors').delete(id, { $autoCancel: false });
        toast.success('Sponsor removed');
        fetchSponsors();
      } catch (error) {
        console.error(error);
        toast.error('Failed to remove sponsor');
      }
    }
  };

  const getTierColor = (tier) => {
    switch(tier) {
      case 'gold': return 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400';
      case 'silver': return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300';
      case 'bronze': return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/40 dark:text-orange-400';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-6 rounded-2xl shadow-sm border border-border">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2"><Shield className="text-primary w-6 h-6"/> Sponsorships</h2>
          <p className="text-muted-foreground mt-1">Manage partners and corporate sponsors</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary text-primary-foreground shadow-md transition-transform active:scale-95">
          <Plus className="w-4 h-4 mr-2" /> Add Sponsor
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md bg-card text-card-foreground border-border">
          <DialogTitle className="text-xl font-bold">{formData.id ? 'Edit Sponsor' : 'Add Sponsor'}</DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Logo Upload</label>
              <Input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files[0])} className="bg-background text-foreground cursor-pointer" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Sponsor Name</label>
              <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-background text-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Tier Level</label>
                <Select value={formData.tier} onValueChange={v => setFormData({...formData, tier: v})}>
                  <SelectTrigger className="bg-background text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gold">Gold Partner</SelectItem>
                    <SelectItem value="silver">Silver Partner</SelectItem>
                    <SelectItem value="bronze">Bronze Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Status</label>
                <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                  <SelectTrigger className="bg-background text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Contact Email</label>
              <Input type="email" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Website URL</label>
              <Input placeholder="https://..." value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Description / Notes</label>
              <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-background text-foreground" />
            </div>
            
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground">
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save Sponsor'}
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
                <TableHead className="font-bold text-foreground">Sponsor</TableHead>
                <TableHead className="font-bold text-foreground">Tier</TableHead>
                <TableHead className="font-bold text-foreground">Status</TableHead>
                <TableHead className="font-bold text-foreground">Website</TableHead>
                <TableHead className="font-bold text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sponsors.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No sponsors found</TableCell></TableRow>
              ) : (
                sponsors.map((s) => (
                  <TableRow key={s.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-white border flex items-center justify-center overflow-hidden shrink-0">
                        {s.logo ? (
                          <img src={pb.files.getUrl(s, s.logo)} alt={s.name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <Shield className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      {s.name}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getTierColor(s.tier)}`}>
                        {s.tier}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${s.status === 'active' ? 'text-emerald-600 bg-emerald-500/10' : 'text-muted-foreground bg-muted'}`}>
                        {s.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {s.website ? (
                        <a href={s.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center text-sm">
                          Link <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(s)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
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

export default SponsorshipManagement;
