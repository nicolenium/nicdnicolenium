
import React from 'react';
import { Globe, Lock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const PrivacyIndicator = ({ privacyLevel, size = 'sm', className }) => {
  const config = {
    public: { icon: Globe, label: 'Public', color: 'text-green-500' },
    private: { icon: Lock, label: 'Private', color: 'text-red-500' },
    friends_only: { icon: Users, label: 'Friends Only', color: 'text-blue-500' }
  };
  
  const setting = config[privacyLevel] || config.public;
  const Icon = setting.icon;

  return (
    <div className={cn("flex items-center gap-1.5 font-medium", setting.color, size === 'sm' ? 'text-xs' : 'text-sm', className)}>
      <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'} />
      <span>{setting.label}</span>
    </div>
  );
};

export default PrivacyIndicator;
