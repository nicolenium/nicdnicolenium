
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TournamentRegistrationForm({ tournamentId, onSuccess }) {
  const { currentUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    player_name: currentUser?.name || currentUser?.username || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    experience_level: 'Intermediate'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // 1. Check if already registered
      const checkRes = await pb.collection('tournament_registrations').getList(1, 1, {
        filter: `tournamentId = "${tournamentId}" && userId = "${currentUser.id}"`,
        $autoCancel: false
      });
      
      if (checkRes.totalItems > 0) {
        toast.error("You are already registered for this tournament.");
        setSubmitting(false);
        if (onSuccess) onSuccess();
        return;
      }
      
      // 2. Register user
      await pb.collection('tournament_registrations').create({
        tournamentId: tournamentId,
        userId: currentUser.id,
        player_name: formData.player_name,
        email: formData.email,
        phone: formData.phone,
        experience_level: formData.experience_level,
        status: 'registered'
      }, { $autoCancel: false });
      
      // 3. Update currentPlayers count in tournament securely
      // Note: Ideally done via a backend hook, but we update locally for immediate UI reflection if permissions allow.
      try {
        const t = await pb.collection('tournaments').getOne(tournamentId, { $autoCancel: false });
        await pb.collection('tournaments').update(tournamentId, {
          currentPlayers: (t.currentPlayers || 0) + 1
        }, { $autoCancel: false });
      } catch (err) {
        console.warn("Could not increment tournament counter (likely permissions), but registration succeeded.", err);
      }

      toast.success("Successfully registered for the tournament!");
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || "Failed to complete registration.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-start gap-3 mb-2 text-sm">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-primary-foreground leading-relaxed">
          You are registering as <strong className="text-primary">@{currentUser.username}</strong>. Your ID will be securely linked to this entry.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-muted-foreground">Display Name</label>
        <Input 
          required 
          value={formData.player_name} 
          onChange={(e) => setFormData({...formData, player_name: e.target.value})} 
          className="bg-background text-foreground"
          placeholder="How you appear on the bracket"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-muted-foreground">Contact Email</label>
        <Input 
          type="email" 
          required 
          value={formData.email} 
          disabled 
          className="bg-muted text-muted-foreground opacity-70 cursor-not-allowed"
          title="Email is locked to your account email"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-muted-foreground">Phone Number (Optional)</label>
        <Input 
          type="tel" 
          value={formData.phone} 
          onChange={(e) => setFormData({...formData, phone: e.target.value})} 
          className="bg-background text-foreground"
          placeholder="For SMS updates"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-muted-foreground">Experience Level</label>
        <Select value={formData.experience_level} onValueChange={(v) => setFormData({...formData, experience_level: v})}>
          <SelectTrigger className="bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={submitting} className="w-full font-bold h-12 mt-6 transition-transform active:scale-[0.98]">
        {submitting ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
        ) : (
          'Confirm Registration'
        )}
      </Button>
    </form>
  );
}
