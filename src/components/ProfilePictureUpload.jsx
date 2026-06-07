
import React, { useState, useRef } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Upload, Image as ImageIcon } from 'lucide-react';

const ProfilePictureUpload = ({ open, onOpenChange }) => {
  const { currentUser } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    
    if (selected.size > 5 * 1024 * 1024) {
      toast.error('File too large (max 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 200;
        
        // Simple cover crop
        const scale = Math.max(200 / img.width, 200 / img.height);
        const x = (200 / scale - img.width) / 2;
        const y = (200 / scale - img.height) / 2;
        
        ctx.drawImage(img, x, y, img.width, img.height, 0, 0, 200, 200);
        setPreview(canvas.toDataURL('image/jpeg', 0.9));
        
        canvas.toBlob((blob) => {
          setFile(new File([blob], 'avatar.jpg', { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.9);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(selected);
  };

  const handleUpload = async () => {
    if (!file || !currentUser) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
      
      await pb.collection('users').update(currentUser.id, formData, { $autoCancel: false });
      toast.success('Profile picture updated successfully');
      onOpenChange(false);
      window.location.reload(); // Refresh to update avatars everywhere
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile picture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-primary/20 bg-card shadow-glow">
        <DialogHeader>
          <DialogTitle className="text-primary">Update Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="w-40 h-40 rounded-full border-4 border-primary/30 overflow-hidden bg-muted flex items-center justify-center">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : currentUser?.profile_picture ? (
              <img src={pb.files.getUrl(currentUser, currentUser.profile_picture)} alt="Current" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-12 h-12 text-muted-foreground opacity-50" />
            )}
          </div>
          
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 border-primary/30 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-muted-foreground">JPG, PNG or WebP (MAX. 5MB)</p>
              </div>
              <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />
            </label>
          </div>

          <div className="flex w-full gap-3">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleUpload} disabled={!file || loading}>
              {loading ? 'Uploading...' : 'Save Picture'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePictureUpload;
