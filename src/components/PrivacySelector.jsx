
import React from 'react';
import { Globe, Users, Lock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PrivacySelector = ({ value, onChange, className }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`h-12 bg-background border-border ${className}`}>
        <SelectValue placeholder="Select Privacy" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="public">
          <div className="flex items-center gap-2 font-medium">
            <Globe className="w-4 h-4 text-green-500" /> Public (Anyone can join/spectate)
          </div>
        </SelectItem>
        <SelectItem value="friends_only">
          <div className="flex items-center gap-2 font-medium">
            <Users className="w-4 h-4 text-blue-500" /> Friends Only
          </div>
        </SelectItem>
        <SelectItem value="private">
          <div className="flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-slate-500" /> Private (Invite only)
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PrivacySelector;
