
import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Loader2, Plus, Edit, Trash2, FileText, Image as ImageIcon } from 'lucide-react';

const FlierManagement = () => {
  const [fliers, setFliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '', title: '', description: '', link: '', date: '', status: 'draft', visibility: 'public'
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchFliers = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('fliers').getFullList({ sort: '-created', $autoCancel: false });
      setFliers(records);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load fliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFliers();
  }, []);

  const handleOpenModal = (flier = null) => {
    if (flier) {
      setFormData({
        id: flier.id, title: flier.title, description: flier.description || '',
        link: flier.link || '', date: flier.date ? flier.date.substring(0, 10) : '',
        status: flier.status || 'draft', visibility: flier.visibility || 'public'
      });
    } else {
      setFormData({ id: '', title: '', description: '', link: '', date: '', status: 'draft', visibility: 'public' });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('link', formData.link);
      data.append('status', formData.status);
      data.append('visibility', formData.visibility);
      if (formData.date) data.append('date', new Date(formData.date).toISOString());
      if (imageFile) data.append('image', imageFile);

      if (formData.id) {
        await pb.collection('fliers').update(formData.id, data, { $autoCancel: false });
        toast.success('Flier updated successfully');
      } else {
        await pb.collection('fliers').create(data, { $autoCancel: false });
        toast.success('Flier created successfully');
      }
      setIsModalOpen(false);
      fetchFliers();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save flier');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this flier?')) {
      try {
        await pb.collection('fliers').delete(id, { $autoCancel: false });
        toast.success('Flier deleted');
        fetchFliers();
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete flier');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-6 rounded-2xl shadow-sm border border-border">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2"><FileText className="text-primary w-6 h-6"/> Flier Management</h2>
          <p className="text-muted-foreground mt-1">Manage promotional materials and digital fliers</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary text-primary-foreground shadow-md transition-transform active:scale-95">
          <Plus className="w-4 h-4 mr-2" /> Create Flier
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg bg-card text-card-foreground border-border">
          <DialogTitle className="text-xl font-bold">{formData.id ? 'Edit Flier' : 'Create Flier'}</DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Flier Image (Max 20MB)</label>
              <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="bg-background text-foreground cursor-pointer" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Title</label>
              <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-background text-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Status</label>
                <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                  <SelectTrigger className="bg-background text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Visibility</label>
                <Select value={formData.visibility} onValueChange={v => setFormData({...formData, visibility: v})}>
                  <SelectTrigger className="bg-background text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Event Date / Deadline</label>
              <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Link URL (Optional)</label>
              <Input placeholder="https://..." value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Description</label>
              <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-background text-foreground" />
            </div>
            
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground">
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save Flier'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : fliers.length === 0 ? (
        <div className="bg-card rounded-2xl border p-12 text-center text-muted-foreground shadow-sm">No fliers found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fliers.map(flier => {
            const imageUrl = flier.image ? pb.files.getUrl(flier, flier.image) : null;
            return (
              <div key={flier.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
                <div className="aspect-[4/3] relative bg-muted">
                  {imageUrl ? (
                    <img src={imageUrl} alt={flier.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md shadow-sm ${
                      flier.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-muted text-foreground'
                    }`}>
                      {flier.status}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-foreground line-clamp-1">{flier.title}</h3>
                  {flier.date && <p className="text-sm text-primary font-medium mt-1">Due: {new Date(flier.date).toLocaleDateString()}</p>}
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{flier.description || 'No description provided.'}</p>
                  
                  <div className="mt-auto pt-4 flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(flier)} className="text-blue-500 hover:text-blue-700">
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(flier.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FlierManagement;
