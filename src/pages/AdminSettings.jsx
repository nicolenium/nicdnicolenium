
import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Settings, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [recordsMap, setRecordsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const records = await pb.collection('admin_settings').getFullList({ $autoCancel: false });
        const map = {};
        const vals = {};
        records.forEach(r => {
          map[r.settingKey] = r.id;
          vals[r.settingKey] = r.settingValue;
        });
        setRecordsMap(map);
        setSettings({
          siteName: vals.siteName || 'NICD PRODUCTIONS',
          siteDescription: vals.siteDescription || '',
          maintenanceMode: vals.maintenanceMode || 'false',
          adminEmail: vals.adminEmail || '',
        });
      } catch (err) {
        console.error("No admin_settings collection or empty", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (category) => {
    setSaving(true);
    try {
      const keysToSave = Object.keys(settings); // In a real app, scope to category
      
      for (const key of keysToSave) {
        const data = {
          settingKey: key,
          settingValue: settings[key],
          category: 'system',
          updatedBy: pb.authStore.model?.id
        };
        
        if (recordsMap[key]) {
          await pb.collection('admin_settings').update(recordsMap[key], data, { $autoCancel: false });
        } else {
          const newRec = await pb.collection('admin_settings').create(data, { $autoCancel: false });
          recordsMap[key] = newRec.id;
        }
      }
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 admin-card p-6">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2"><Settings className="text-primary w-6 h-6"/> System Configuration</h1>
          <p className="text-muted-foreground mt-1">Manage global platform parameters</p>
        </div>
        <Button onClick={() => handleSave('all')} disabled={saving} className="font-bold shadow-md">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} 
          Save Configuration
        </Button>
      </div>

      <div className="admin-card p-6">
        <Tabs defaultValue="website" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-8 h-auto">
            <TabsTrigger value="website" className="py-2.5">Website</TabsTrigger>
            <TabsTrigger value="games" className="py-2.5">Games</TabsTrigger>
            <TabsTrigger value="tournaments" className="py-2.5">Tournaments</TabsTrigger>
            <TabsTrigger value="payments" className="py-2.5">Payments</TabsTrigger>
            <TabsTrigger value="email" className="py-2.5">Email</TabsTrigger>
            <TabsTrigger value="system" className="py-2.5">System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="website" className="space-y-4">
            <h2 className="text-lg font-bold mb-4 border-b border-border pb-2">Website Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="admin-input-group">
                <label className="admin-label">Site Name</label>
                <Input value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})} className="bg-background" />
              </div>
              <div className="admin-input-group">
                <label className="admin-label">Admin Contact Email</label>
                <Input type="email" value={settings.adminEmail} onChange={e => setSettings({...settings, adminEmail: e.target.value})} className="bg-background" />
              </div>
              <div className="admin-input-group md:col-span-2">
                <label className="admin-label">Global SEO Description</label>
                <Textarea value={settings.siteDescription} onChange={e => setSettings({...settings, siteDescription: e.target.value})} className="bg-background min-h-[100px]" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <h2 className="text-lg font-bold mb-4 border-b border-border pb-2">System Configuration</h2>
            <div className="admin-input-group max-w-sm">
              <label className="admin-label">Maintenance Mode</label>
              <select 
                value={settings.maintenanceMode} 
                onChange={e => setSettings({...settings, maintenanceMode: e.target.value})}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="false">Disabled (Site Live)</option>
                <option value="true">Enabled (Site Offline)</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">If enabled, only admins can access the site.</p>
            </div>
          </TabsContent>

          {/* Placeholder for other tabs requested by user */}
          {['games', 'tournaments', 'payments', 'email'].map(tab => (
            <TabsContent key={tab} value={tab} className="p-8 text-center text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border">
              Configuration interface for {tab} is actively under development.
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
