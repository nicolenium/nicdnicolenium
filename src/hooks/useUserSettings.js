
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

export const useUserSettings = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      // Validate user record existence before executing any network requests
      if (!isAuthenticated || !currentUser || !currentUser.id) {
        setLoading(false);
        setSettings(null);
        return;
      }

      try {
        const records = await pb.collection('user_settings').getFullList({
          filter: `userId="${currentUser.id}"`,
          $autoCancel: false
        });
        
        if (records.length > 0) {
          setSettings(records[0]);
        } else {
          // Initialize defaults for a new user if not found
          const defaultSettings = {
            userId: currentUser.id,
            timeControl: '10min',
            customTimeMinutes: 10,
            customTimeIncrement: 0,
            boardStyle: 'classic',
            pieceStyle: 'classic',
            soundEnabled: true,
            musicEnabled: false,
            volumeLevel: 80,
            animationSpeed: 'normal',
            movementSpeed: 'normal',
            theme: 'dark',
            highContrast: false,
            fontSize: 'normal',
            difficulty: 'medium'
          };
          const created = await pb.collection('user_settings').create(defaultSettings, { $autoCancel: false });
          setSettings(created);
        }
      } catch (e) {
        console.error("useUserSettings: Failed to load user settings:", e);
        // Do not retry on 404, gracefully clear local state
        if (e.status === 404) {
          console.warn("useUserSettings: User or settings record not found (404).");
          setSettings(null);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [currentUser, isAuthenticated]);

  const updateSettings = async (updates) => {
    // Strict existence check before allowing mutations
    if (!settings?.id || !currentUser?.id) {
      console.warn("useUserSettings: Attempted to update settings without a valid user/settings record.");
      return;
    }
    
    // Optimistic UI update
    setSettings(prev => ({ ...prev, ...updates }));
    
    try {
      await pb.collection('user_settings').update(settings.id, updates, { $autoCancel: false });
    } catch (e) {
      console.error("useUserSettings: Failed to update settings:", e);
      if (e.status === 404) {
        toast.error("Settings record not found. It may have been deleted.");
        setSettings(null);
      } else {
        toast.error("Failed to save settings to the server.");
      }
    }
  };

  return { settings, updateSettings, loading };
};
