
import React from 'react';
import { Globe, Lock, Users } from 'lucide-react';

const PrivacyBadge = ({ status }) => {
  const configs = {
    public: { color: 'bg-green-500/20 text-green-500 border-green-500/30', icon: Globe, label: 'Public' },
    friends_only: { color: 'bg-blue-500/20 text-blue-500 border-blue-500/30', icon: Users, label: 'Friends' },
    private: { color: 'bg-red-500/20 text-red-500 border-red-500/30', icon: Lock, label: 'Private' },
  };

  const conf = configs[status] || configs.public;
  const Icon = conf.icon;

  return (
    <span className={`badge-base border ${conf.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {conf.label}
    </span>
  );
};

export default PrivacyBadge;
