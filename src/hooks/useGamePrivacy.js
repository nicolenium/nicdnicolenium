
import { useState, useEffect, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

export const useGamePrivacy = (gameSessionId) => {
  const { currentUser } = useAuth();
  const [privacySetting, setPrivacySetting] = useState('public');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrivacy = useCallback(async () => {
    if (!currentUser || !gameSessionId) return;
    setLoading(true);
    setError(null);
    try {
      const records = await pb.collection('game_privacy').getFullList({
        filter: `gameSessionId = "${gameSessionId}" && userId = "${currentUser.id}"`,
        $autoCancel: false
      });
      if (records.length > 0) {
        setPrivacySetting(records[0].privacyLevel);
      }
    } catch (err) {
      console.error("Error fetching privacy:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [gameSessionId, currentUser]);

  useEffect(() => {
    fetchPrivacy();
  }, [fetchPrivacy]);

  const updatePrivacy = async (newLevel) => {
    setPrivacySetting(newLevel);
    if (!currentUser || !gameSessionId) return;
    
    setLoading(true);
    setError(null);
    try {
      const records = await pb.collection('game_privacy').getFullList({
        filter: `gameSessionId = "${gameSessionId}" && userId = "${currentUser.id}"`,
        $autoCancel: false
      });
      
      if (records.length > 0) {
        await pb.collection('game_privacy').update(records[0].id, { privacyLevel: newLevel }, { $autoCancel: false });
      } else {
        await pb.collection('game_privacy').create({
          gameSessionId,
          userId: currentUser.id,
          privacyLevel: newLevel
        }, { $autoCancel: false });
      }
      toast.success('Privacy settings updated');
    } catch (err) {
      console.error("Error updating privacy:", err);
      setError(err.message);
      toast.error('Failed to update privacy settings');
    } finally {
      setLoading(false);
    }
  };

  return { privacySetting, loading, error, updatePrivacy, fetchPrivacy };
};
