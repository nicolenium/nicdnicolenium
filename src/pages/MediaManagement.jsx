
import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon, Video, FolderOpen, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function MediaManagement() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);

  const [formData, setFormData] = useState({
    id: '', title: '', description: '', category: 'pictures', tags: '', isFeatured: false
  });

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('media').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setMediaItems(records);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast.error('Failed to load media assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        category: item.category || 'pictures',
        tags: item.tags || '',
        isFeatured: !!item.isFeatured
      });
    } else {
      setFormData({
        id: '', title: '', description: '', category: 'pictures', tags: '', isFeatured: false
      });
    }
    setMediaFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id && !mediaFile) {
      toast.error('Please select a file to upload');
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
      
      if (mediaFile) {
        data.append('file', mediaFile);
      }

      if (formData.id) {
        await pb.collection('media').update(formData.id, data, { $autoCancel: false });
        toast.success('Media updated successfully');
      } else {
        await pb.collection('media').create(data, { $autoCancel: false });
        toast.success('Media uploaded successfully');
      }
      
      setIsModalOpen(false);
      fetchMedia();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Failed to save media');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media asset?')) return;
    try {
      await pb.collection('media').delete(id, { $autoCancel: false });
      toast.success('Media deleted successfully');
      fetchMedia();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete media');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-2xl shadow-sm border border-border">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2"><FolderOpen className="text-primary w-6 h-6"/> Media Library</h1>
          <p className="text-muted-foreground mt-1">Manage platform images, videos, and visual assets</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary text-primary-foreground font-bold shadow-md transition-transform active:scale-95">
          <Plus className="w-4 h-4 mr-2" /> Upload Asset
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg bg-card text-card-foreground border-border">
          <DialogTitle className="text-xl font-bold">{formData.id ? 'Edit Media Asset' : 'Upload New Asset'}</DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2"><ImageIcon className="w-4 h-4"/> File {formData.id ? '(Optional replacement)' : '*'}</label>
              <Input 
                type="file" 
                accept={formData.category === 'videos' ? 'video/*' : formData.category === 'pictures' ? 'image/*' : '*/*'}
                onChange={e => setMediaFile(e.target.files[0])} 
                className="bg-background cursor-pointer" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold">Title</label>
              <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-background" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Category</label>
                <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pictures">Pictures</SelectItem>
                    <SelectItem value="videos">Videos</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Tags</label>
                <Input placeholder="comma separated" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="bg-background" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Description</label>
              <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-background min-h-[80px]" />
            </div>

            <div className="flex items-center space-x-2 py-2">
              <Checkbox 
                id="isFeatured" 
                checked={formData.isFeatured} 
                onCheckedChange={(checked) => setFormData({...formData, isFeatured: !!checked})} 
              />
              <label htmlFor="isFeatured" className="text-sm font-medium leading-none cursor-pointer">
                Mark as Featured Asset
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground">
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save Media'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground shadow-sm">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No media assets found. Upload one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mediaItems.map(item => {
            const fileUrl = item.file ? pb.files.getUrl(item, item.file) : null;
            const isVideo = item.category === 'videos' || (item.file && item.file.match(/\.(mp4|webm|ogg)$/i));
            
            return (
              <div key={item.id} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col group">
                <div className="aspect-video bg-muted relative flex items-center justify-center overflow-hidden">
                  {fileUrl ? (
                    isVideo ? (
                      <div className="w-full h-full relative">
                        <video src={fileUrl} className="w-full h-full object-cover" muted />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Video className="w-8 h-8 text-white drop-shadow-md" />
                        </div>
                      </div>
                    ) : (
                      <img src={fileUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    )
                  ) : (
                    <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                  )}
                  
                  {item.isFeatured && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white p-1 rounded-md shadow-sm">
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm uppercase tracking-wide">
                    {item.category}
                  </div>
                </div>
                
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-foreground line-clamp-1" title={item.title}>{item.title || 'Untitled Asset'}</h3>
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {item.tags ? item.tags.split(',').slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm truncate max-w-[80px]">
                        {tag.trim()}
                      </span>
                    )) : <span className="text-[10px] text-transparent select-none">none</span>}
                  </div>
                  
                  <div className="mt-auto pt-4 flex gap-2 justify-end opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(item)} className="h-8 flex-1 text-blue-500 hover:text-blue-700">
                      <Edit2 className="w-3 h-3 mr-1.5" /> Edit
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-3 h-3" />
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
}
