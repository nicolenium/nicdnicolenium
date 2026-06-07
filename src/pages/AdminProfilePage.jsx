
import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Loader2, Upload, Shield, KeyRound, User } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProfilePage() {
  const { adminUser } = useAdminAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (adminUser) {
      setName(adminUser.name || '');
      setEmail(adminUser.email || '');
      if (adminUser.avatar) {
        setAvatarPreview(pb.files.getUrl(adminUser, adminUser.avatar));
      }
    }
  }, [adminUser]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!adminUser) return;
    
    setIsSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await pb.collection('admin_users').update(adminUser.id, formData, { $autoCancel: false });
      
      // Refresh auth store to get updated data
      await pb.collection('admin_users').authRefresh({ $autoCancel: false });
      
      toast.success('Profile updated successfully');
      setAvatarFile(null);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!adminUser) return;

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsSavingPassword(true);
    try {
      await pb.collection('admin_users').update(adminUser.id, {
        oldPassword,
        password: newPassword,
        passwordConfirm: confirmPassword
      }, { $autoCancel: false });

      toast.success('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Password update error:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (!adminUser) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-black font-serif uppercase tracking-wider">Admin Profile</h1>
          <p className="text-muted-foreground">Manage your administrative account settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Form */}
        <Card className="lg:col-span-2 border-white/10 bg-card shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Personal Information</CardTitle>
            <CardDescription>Update your name, email, and profile picture.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="w-24 h-24 border-2 border-white/10">
                    <AvatarImage src={avatarPreview} className="object-cover" />
                    <AvatarFallback className="text-2xl bg-primary/20 text-primary font-bold">
                      {name ? name.substring(0, 2).toUpperCase() : 'AD'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="relative">
                    <input 
                      type="file" 
                      id="avatar-upload" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <label 
                      htmlFor="avatar-upload" 
                      className="cursor-pointer flex items-center gap-2 text-xs font-bold bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md hover:bg-secondary/80 transition-colors"
                    >
                      <Upload className="w-3 h-3" /> Change Avatar
                    </label>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4 w-full">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Admin Name"
                      className="bg-slate-900/50 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                    <Input 
                      type="email"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="admin@example.com"
                      className="bg-slate-900/50 border-white/10"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Role</label>
                    <Input 
                      value={adminUser.role || 'Admin'} 
                      disabled
                      className="bg-slate-900/50 border-white/10 opacity-50 cursor-not-allowed uppercase font-bold"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-white/5">
                <Button type="submit" disabled={isSavingProfile} className="font-bold">
                  {isSavingProfile ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password Change Form */}
        <Card className="border-white/10 bg-card shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><KeyRound className="w-5 h-5" /> Security</CardTitle>
            <CardDescription>Update your password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Password</label>
                <Input 
                  type="password"
                  value={oldPassword} 
                  onChange={(e) => setOldPassword(e.target.value)} 
                  className="bg-slate-900/50 border-white/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">New Password</label>
                <Input 
                  type="password"
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="bg-slate-900/50 border-white/10"
                  required
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Confirm New Password</label>
                <Input 
                  type="password"
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="bg-slate-900/50 border-white/10"
                  required
                  minLength={8}
                />
              </div>
              
              <div className="pt-4">
                <Button type="submit" variant="secondary" disabled={isSavingPassword} className="w-full font-bold">
                  {isSavingPassword ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</> : 'Update Password'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
