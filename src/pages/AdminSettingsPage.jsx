import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Settings, Mail, Shield, Save } from 'lucide-react';
import { toast } from 'sonner';

const AdminSettingsPage = () => {
  const [saving, setSaving] = useState(false);
  
  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Settings saved successfully');
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-foreground tracking-tight">Platform Settings</h2>
        <p className="text-muted-foreground mt-1">Manage global configurations for NICD PRODUCTIONS.</p>
      </div>

      <Tabs defaultValue="website" className="w-full">
        <TabsList className="bg-muted p-1 rounded-lg">
          <TabsTrigger value="website" className="gap-2"><Settings className="w-4 h-4" /> Website</TabsTrigger>
          <TabsTrigger value="email" className="gap-2"><Mail className="w-4 h-4" /> Email</TabsTrigger>
          <TabsTrigger value="security" className="gap-2"><Shield className="w-4 h-4" /> Security</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSave}>
          <TabsContent value="website" className="mt-6 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Update the core identity of the gaming platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Site Name</Label>
                  <Input defaultValue="NICD PRODUCTIONS" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label>Site Description</Label>
                  <Textarea defaultValue="The ultimate online gaming and tournament platform." className="bg-background min-h-[100px]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input type="email" defaultValue="support@nicd.com" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary Theme Color (Hex)</Label>
                    <Input defaultValue="#00FFFF" className="bg-background font-mono" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="mt-6 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Configure automated platform emails.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Welcome Emails</Label>
                    <p className="text-sm text-muted-foreground">Sent automatically to new players upon registration.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Tournament Reminders</Label>
                    <p className="text-sm text-muted-foreground">Alert participants 24h before a tournament starts.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Weekly Leaderboard Digest</Label>
                    <p className="text-sm text-muted-foreground">Send top players overview every Sunday.</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Security Preferences</CardTitle>
                <CardDescription>Manage administrative security and access limits.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input type="number" defaultValue="120" className="bg-background w-32" />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="space-y-0.5">
                    <Label className="text-base">Require 2FA for Admins</Label>
                    <p className="text-sm text-muted-foreground">Enforce two-factor authentication on admin panel access.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="mt-8 flex justify-end">
            <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground min-w-[120px]">
              {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
};

export default AdminSettingsPage;