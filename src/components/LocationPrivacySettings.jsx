
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MapPin, Globe, EyeOff, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

const LocationPrivacySettings = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [privacy, setPrivacy] = useState(currentUser?.locationPrivacy || 'full');
  const [saving, setSaving] = useState(false);

  const handleSave = async (val) => {
    if (!currentUser) return;
    setPrivacy(val);
    setSaving(true);
    try {
      await pb.collection('users').update(currentUser.id, {
        locationPrivacy: val
      }, { $autoCancel: false });
      toast.success(t('common.save') + " " + "Success");
    } catch (error) {
      toast.error('Failed to update privacy');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('location.privacy')}</Label>
      <Select value={privacy} onValueChange={handleSave} disabled={saving}>
        <SelectTrigger className="w-full bg-muted/50 border-border h-11">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          <SelectValue placeholder="Select privacy" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="full">
            <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-primary" /> {t('location.full')}</div>
          </SelectItem>
          <SelectItem value="approximate">
            <div className="flex items-center"><Globe className="w-4 h-4 mr-2 text-secondary" /> {t('location.approximate')}</div>
          </SelectItem>
          <SelectItem value="hidden">
            <div className="flex items-center"><EyeOff className="w-4 h-4 mr-2 text-muted-foreground" /> {t('location.hidden')}</div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationPrivacySettings;
