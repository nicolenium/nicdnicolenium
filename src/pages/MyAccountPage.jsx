
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { User, Phone, Lock, Save, Loader2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function MyAccountPage() {
  const { currentUser } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    phone: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    password: '',
    passwordConfirm: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        username: currentUser.username || '',
        phone: currentUser.phone || ''
      });
    }
  }, [currentUser]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setProfileLoading(true);
    try {
      await pb.collection('users').update(currentUser.id, profileData, { $autoCancel: false });
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(err.response?.message || "Failed to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    if (passwordData.password !== passwordData.passwordConfirm) {
      toast.error("New passwords do not match.");
      return;
    }
    
    setPasswordLoading(true);
    try {
      await pb.collection('users').update(currentUser.id, passwordData, { $autoCancel: false });
      toast.success("Password updated successfully.");
      setPasswordData({ oldPassword: '', password: '', passwordConfirm: '' });
    } catch (err) {
      toast.error(err.response?.message || "Failed to update password. Check old password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground font-medium">Please log in to access your account settings.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>My Account | NICD NICOLENIUM</title></Helmet>
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Account Settings</h1>
          <p className="text-muted-foreground text-lg font-medium">Manage your personal information and security.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="bg-card border-border shadow-sm rounded-3xl overflow-hidden">
              <CardContent className="pt-8 text-center pb-8">
                <div className="w-28 h-28 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4 border-4 border-primary/50 text-primary text-4xl font-black shadow-inner">
                  {currentUser.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h2 className="text-2xl font-bold">{currentUser.name || currentUser.username}</h2>
                <p className="text-muted-foreground text-sm mb-6">@{currentUser.username}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Active Member
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-muted/30 rounded-2xl p-5 border border-border text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-2 mb-3 text-foreground font-bold"><ShieldAlert className="w-5 h-5 text-amber-500" /> Account Security</div>
              <p className="leading-relaxed">Your email address (<span className="text-foreground font-bold">{currentUser.email}</span>) cannot be changed from this panel. Please contact support if you need to update it.</p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-8 bg-muted/50 border border-border p-1.5 rounded-2xl h-14">
                <TabsTrigger value="profile" className="rounded-xl font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm text-base">Profile Details</TabsTrigger>
                <TabsTrigger value="security" className="rounded-xl font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm text-base">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="animate-in fade-in">
                <Card className="bg-card border-border shadow-sm rounded-3xl overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b border-border pb-6">
                    <CardTitle className="text-2xl font-black">Personal Information</CardTitle>
                    <CardDescription className="text-base font-medium">Update your public identity and contact details.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleProfileUpdate}>
                    <CardContent className="space-y-6 pt-8 pb-8">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Username</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                          <Input 
                            value={profileData.username} 
                            onChange={e => setProfileData({...profileData, username: e.target.value})} 
                            className="pl-12 h-14 bg-background border-2 rounded-xl text-lg font-medium" 
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                        <Input 
                          value={profileData.name} 
                          onChange={e => setProfileData({...profileData, name: e.target.value})} 
                          className="h-14 bg-background border-2 rounded-xl text-lg font-medium px-4" 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                          <Input 
                            type="tel"
                            value={profileData.phone} 
                            onChange={e => setProfileData({...profileData, phone: e.target.value})} 
                            className="pl-12 h-14 bg-background border-2 rounded-xl text-lg font-medium" 
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/30 border-t border-border pt-6 pb-6">
                      <Button type="submit" disabled={profileLoading} className="font-bold h-12 px-8 rounded-xl ml-auto">
                        {profileLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                        Save Changes
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="animate-in fade-in">
                <Card className="bg-card border-border shadow-sm rounded-3xl overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b border-border pb-6">
                    <CardTitle className="text-2xl font-black">Change Password</CardTitle>
                    <CardDescription className="text-base font-medium">Ensure your account stays secure by using a strong password.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handlePasswordUpdate}>
                    <CardContent className="space-y-6 pt-8 pb-8">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                          <Input 
                            type="password"
                            value={passwordData.oldPassword} 
                            onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} 
                            className="pl-12 h-14 bg-background border-2 rounded-xl text-lg" 
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3 pt-4 border-t border-border/50">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                          <Input 
                            type="password" minLength={8}
                            value={passwordData.password} 
                            onChange={e => setPasswordData({...passwordData, password: e.target.value})} 
                            className="pl-12 h-14 bg-background border-2 rounded-xl text-lg" 
                            required 
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Confirm New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                          <Input 
                            type="password" minLength={8}
                            value={passwordData.passwordConfirm} 
                            onChange={e => setPasswordData({...passwordData, passwordConfirm: e.target.value})} 
                            className="pl-12 h-14 bg-background border-2 rounded-xl text-lg" 
                            required 
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/30 border-t border-border pt-6 pb-6">
                      <Button type="submit" disabled={passwordLoading} variant="secondary" className="font-bold h-12 px-8 rounded-xl ml-auto border-2">
                        {passwordLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Lock className="w-5 h-5 mr-2" />}
                        Update Password
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
