
import React, { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Calendar, Clock, Trophy, Loader2, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function TournamentPresets({ onCreated }) {
  const { adminUser } = useAdminAuth();
  const [loading, setLoading] = useState(null);

  const presets = [
    {
      id: 'daily',
      name: 'Daily Championship',
      durationDays: 1,
      entryFee: 5,
      prizePool: 500,
      autoReset: 'daily',
      icon: Clock,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      id: 'weekly',
      name: 'Weekly Battle',
      durationDays: 7,
      entryFee: 10,
      prizePool: 2000,
      autoReset: 'weekly',
      icon: Calendar,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      recommended: true
    },
    {
      id: 'monthly',
      name: 'Monthly Grand Prix',
      durationDays: 30,
      entryFee: 25,
      prizePool: 10000,
      autoReset: 'monthly',
      icon: Trophy,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    }
  ];

  const handleCreate = async (preset) => {
    setLoading(preset.id);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + preset.durationDays);

      const tournamentData = {
        name: preset.name,
        gameType: 'checkers', // Default game type
        maxPlayers: 100,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: 'upcoming',
        createdBy: adminUser.id,
        prizePool: preset.prizePool,
        auto_reset_frequency: preset.autoReset,
        is_live: false
      };

      await pb.collection('tournaments').create(tournamentData, { $autoCancel: false });
      toast.success(`${preset.name} created successfully!`);
      if (onCreated) onCreated();
    } catch (error) {
      console.error('Error creating preset tournament:', error);
      toast.error(`Failed to create ${preset.name}: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold uppercase tracking-wider">Quick Create Presets</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {presets.map((preset) => (
          <Card 
            key={preset.id} 
            className={`relative overflow-hidden border ${preset.border} bg-card shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl ${preset.recommended ? 'ring-2 ring-primary' : ''}`}
          >
            {preset.recommended && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider z-10">
                Popular
              </div>
            )}
            <CardHeader className="pb-4">
              <div className={`w-12 h-12 rounded-xl ${preset.bg} flex items-center justify-center mb-4`}>
                <preset.icon className={`w-6 h-6 ${preset.color}`} />
              </div>
              <CardTitle className="text-lg font-bold">{preset.name}</CardTitle>
              <CardDescription>Auto-resets {preset.autoReset}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{preset.durationDays} {preset.durationDays === 1 ? 'Day' : 'Days'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-muted-foreground">Entry Fee</span>
                  <span className="font-medium">${preset.entryFee}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-muted-foreground">Prize Pool</span>
                  <span className="font-bold text-primary">${preset.prizePool.toLocaleString()}</span>
                </div>
              </div>
              <Button 
                className={`w-full font-bold ${preset.recommended ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                onClick={() => handleCreate(preset)}
                disabled={loading !== null}
              >
                {loading === preset.id ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
                ) : (
                  'Create Tournament'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
