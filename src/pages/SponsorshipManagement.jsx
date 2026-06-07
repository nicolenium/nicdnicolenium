
import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Plus, Edit2, Trash2, Loader2, Shield, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function SponsorshipManagement() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState(null);

  const [formData, setFormData] = useState({
    id: '', name: '', tier: 'bronze', website: '', description: '', contactEmail: ''
  });

  const fetchSponsors = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('sponsors').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setSponsors(records);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
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
        id: sponsor.id,
        name: sponsor.name || '',
        tier: sponsor.tier || 'bronze',
        website: sponsor.website || '',
        description: sponsor.description || '',
        contactEmail: sponsor.contactEmail || ''
      });
    } else {
      setFormData({
        id: '', name: '', tier: 'bronze', website: '', description: '', contactEmail: ''
      });
    }
    setLogoFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Sponsor name is required');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('tier', formData.tier);
      data.append('website', formData.website);
      data.append('description', formData.description);
      data.append('contactEmail', formData.contactEmail);
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
      console.error('Submit error:', error);
      toast.error(error.message || 'Failed to save sponsor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sponsor?')) return;
    try {
      await pb.collection('sponsors').delete(id, { $autoCancel: false });
      toast.success('Sponsor deleted successfully');
      fetchSponsors();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete sponsor');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-2xl shadow-sm border border-border">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2"><Shield className="text-amber-500 w-6 h-6"/> Sponsorships</h1>
          <p className="text-muted-foreground mt-1">Manage brand partners and sponsors</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary text-primary-foreground shadow-md font-bold transition-transform active:scale-95">
          <Plus className="w-4 h-4 mr-2" /> Add Sponsor
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border-border">
          <DialogTitle className="text-xl font-bold">{formData.id ? 'Edit Sponsor' : 'Add Sponsor'}</DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Sponsor Name *</label>
              <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-background" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Tier</label>
                <Select value={formData.tier} onValueChange={v => setFormData({...formData, tier: v})}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bronze">Bronze</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Logo Upload</label>
                <Input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files[0])} className="bg-background cursor-pointer" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Website URL</label>
                <Input type="url" placeholder="https://" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Contact Email</label>
                <Input type="email" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} className="bg-background" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Description</label>
              <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-background min-h-[80px]" />
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
      
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border">
                  <TableHead className="w-[80px]">Logo</TableHead>
                  <TableHead className="font-bold">Sponsor Name</TableHead>
                  <TableHead className="font-bold">Tier</TableHead>
                  <TableHead className="font-bold">Website</TableHead>
                  <TableHead className="font-bold">Contact</TableHead>
                  <TableHead className="font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No sponsors found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sponsors.map((s) => {
                    const logoUrl = s.logo ? pb.files.getUrl(s, s.logo) : null;
                    return (
                      <TableRow key={s.id} className="border-border hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center overflow-hidden border border-border/50">
                            {logoUrl ? (
                              <img src={logoUrl} alt={s.name} className="w-full h-full object-contain p-1" />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-muted-foreground/50" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold">{s.name}</TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider ${
                            s.tier === 'gold' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-500' :
                            s.tier === 'silver' ? 'bg-slate-400/15 text-slate-600 dark:text-slate-400' :
                            'bg-orange-600/15 text-orange-700 dark:text-orange-500'
                          }`}>
                            {s.tier || 'bronze'}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground truncate max-w-[150px]">
                          {s.website ? <a href={s.website} target="_blank" rel="noreferrer" className="hover:underline">{s.website}</a> : '-'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{s.contactEmail || '-'}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenModal(s)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
