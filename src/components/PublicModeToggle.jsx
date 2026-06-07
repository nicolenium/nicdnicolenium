
import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Radio, Globe } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const PublicModeToggle = ({ gameSessionId, initialStatus = false }) => {
  const [isPublic, setIsPublic] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsPublic(initialStatus);
  }, [initialStatus]);

  const handleToggle = async (checked) => {
    setIsPublic(checked);
    if (!gameSessionId) return;

    setLoading(true);
    try {
      await pb.collection('game_sessions').update(gameSessionId, {
        public_mode: checked,
        is_live: checked
      }, { $autoCancel: false });
      
      if (checked) {
        toast.success("Game is now live in Community Live!");
      } else {
        toast.info("Game is now private.");
      }
    } catch (error) {
      console.error("Error updating public mode:", error);
      toast.error("Failed to update visibility.");
      setIsPublic(!checked); // revert
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-card border px-4 py-2 rounded-xl shadow-sm">
      {isPublic ? <Radio className="w-4 h-4 text-destructive animate-pulse" /> : <Globe className="w-4 h-4 text-muted-foreground" />}
      <Label htmlFor="public-mode" className="font-bold cursor-pointer">
        {isPublic ? 'Live Publicly' : 'Private Game'}
      </Label>
      <Switch 
        id="public-mode" 
        checked={isPublic} 
        onCheckedChange={handleToggle} 
        disabled={loading || !gameSessionId}
        className="ml-2"
      />
    </div>
  );
};

export default PublicModeToggle;
