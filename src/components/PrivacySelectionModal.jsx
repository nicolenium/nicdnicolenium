
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Globe, Users, Lock } from 'lucide-react';

const PrivacySelectionModal = ({ open, onOpenChange, onSelect }) => {
  const options = [
    {
      id: 'public',
      title: 'Public',
      description: 'Anyone can view and join',
      icon: Globe,
      colorClass: 'text-emerald-500',
      bgClass: 'bg-emerald-500/10',
      borderClass: 'border-emerald-500/30 hover:border-emerald-500'
    },
    {
      id: 'friends_only',
      title: 'Friends Only',
      description: 'Only friends can view and join',
      icon: Users,
      colorClass: 'text-amber-500',
      bgClass: 'bg-amber-500/10',
      borderClass: 'border-amber-500/30 hover:border-amber-500'
    },
    {
      id: 'private',
      title: 'Private',
      description: 'Only invited players can view and join',
      icon: Lock,
      colorClass: 'text-rose-500',
      bgClass: 'bg-rose-500/10',
      borderClass: 'border-rose-500/30 hover:border-rose-500'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center">Select Game Privacy</DialogTitle>
          <DialogDescription className="text-center text-balance">
            Choose who can see and join your game session.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => onSelect(opt.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all interactive-scale text-left ${opt.borderClass} bg-card hover:bg-muted/50`}
              >
                <div className={`p-3 rounded-full ${opt.bgClass}`}>
                  <Icon className={`w-6 h-6 ${opt.colorClass}`} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{opt.title}</h4>
                  <p className="text-sm text-muted-foreground">{opt.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacySelectionModal;
