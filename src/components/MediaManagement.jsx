
import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Loader2, Plus, Trash2, Image as ImageIcon, Video, File as FileIcon } from 'lucide-react';

const MediaManagement = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'pictures', tags: '', isFeatured: false
  });
  const [file, setFile] = useState(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('media').getFullList({ sort: '-created', $autoCancel: false });
      setMediaItems(records);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    if (file.size > 104857600) {
      toast.error('File size exceeds 100MB limit');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('tags', formData.tags);
      data.append('isFeatured', formData.isFeatured);
      data.append('file', file);
      
      await pb.collection('media').create(data, { $autoCancel: false });
      toast.success('Media uploaded successfully');
      
      setIsModalOpen(false);
      setFormData({ title: '', description: '', category: 'pictures', tags: '', isFeatured: false });
      setFile(null);
      fetchMedia();
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload media');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this media item?')) {
      try {
        await pb.collection('media').delete(id, { $autoCancel: false });
        toast.success('Media deleted');
        fetchMedia();
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete media');
      }
    }
  };

  const toggleFeatured = async (id, currentStatus) => {
    try {
      await pb.collection('media').update(id, { isFeatured: !currentStatus }, { $autoCancel: false });
      toast.success('Media status updated');
      fetchMedia();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-6 rounded-2xl shadow-sm border border-border">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2"><ImageIcon className="text-primary w-6 h-6"/> Media Gallery</h2>
          <p className="text-muted-foreground mt-1">Manage pictures and videos</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground shadow-md transition-transform active:scale-95">
          <Plus className="w-4 h-4 mr-2" /> Upload Media
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md bg-card text-card-foreground border-border">
          <DialogTitle className="text-xl font-bold">Upload Media</DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">File (Max 100MB)</label>
              <Input type="file" required onChange={e => setFile(e.target.files[0])} className="bg-background text-foreground cursor-pointer" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Title</label>
              <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Category</label>
              <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                <SelectTrigger className="bg-background text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pictures">Pictures</SelectItem>
                  <SelectItem value="videos">Videos</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Tags (comma separated)</label>
              <Input placeholder="e.g. tournament, 2026, final" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="bg-background text-foreground" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Description</label>
              <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-background text-foreground" />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Switch checked={formData.isFeatured} onCheckedChange={c => setFormData({...formData, isFeatured: c})} />
              <label className="text-sm font-medium text-foreground">Set as Featured</label>
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground">
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Upload'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : mediaItems.length === 0 ? (
        <div className="bg-card rounded-2xl border p-12 text-center text-muted-foreground shadow-sm">No media items found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mediaItems.map(item => {
            const fileUrl = pb.files.getUrl(item, item.file);
            const isVideo = item.category === 'videos' || item.file.match(/\.(mp4|webm)$/i);
            
            return (
              <div key={item.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden group flex flex-col transition-all hover:shadow-md">
                <div className="aspect-video relative bg-muted flex items-center justify-center overflow-hidden">
                  {isVideo ? (
                    <video src={fileUrl} className="w-full h-full object-cover" muted />
                  ) : item.category === 'pictures' ? (
                    <img src={fileUrl} alt={item.title || 'Media item'} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <FileIcon className="w-12 h-12 text-muted-foreground" />
                  )}
                  
                  <div className="absolute top-2 left-2 flex gap-2">
                    <Badge className="bg-black/60 text-white hover:bg-black/60 border-0 backdrop-blur-md">
                      {isVideo ? <Video className="w-3 h-3 mr-1"/> : <ImageIcon className="w-3 h-3 mr-1"/>} 
                      {item.category}
                    </Badge>
                    {item.isFeatured && <Badge className="bg-amber-500 text-white border-0">Featured</Badge>}
                  </div>
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)} className="rounded-full">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-foreground truncate">{item.title || 'Untitled'}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(item.created).toLocaleDateString()}</p>
                  <div className="mt-auto pt-4 flex justify-between items-center">
                    <div className="text-xs text-muted-foreground truncate">{item.tags}</div>
                    <Switch checked={item.isFeatured} onCheckedChange={() => toggleFeatured(item.id, item.isFeatured)} />
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

export default MediaManagement;
