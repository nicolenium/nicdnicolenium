
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const LiveGameNotificationsContext = createContext(null);

export const LiveGameNotificationsProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [preferences, setPreferences] = useState(null);
  const [activeLiveGames, setActiveLiveGames] = useState(0);

  useEffect(() => {
    let unsubscribeSettings = null;
    let unsubscribeGames = null;

    const fetchPreferences = async () => {
      if (!currentUser) return;
      try {
        const records = await pb.collection('live_games_notifications').getFullList({
          filter: `userId = "${currentUser.id}"`,
          $autoCancel: false
        });
        if (records.length > 0) {
          setPreferences(records[0]);
        }
      } catch (error) {
        console.error("Failed to fetch notification preferences", error);
      }
    };

    const fetchLiveGamesCount = async () => {
      try {
        const records = await pb.collection('game_sessions').getList(1, 1, {
          filter: 'is_live = true && privacy_setting = "public"',
          $autoCancel: false
        });
        setActiveLiveGames(records.totalItems);
      } catch (error) {
        console.error("Failed to fetch live games count", error);
      }
    };

    fetchPreferences();
    fetchLiveGamesCount();

    // Subscribe to new game sessions for notifications
    pb.collection('game_sessions').subscribe('*', function (e) {
      if (e.action === 'create' && e.record.is_live && e.record.privacy_setting === 'public') {
        setActiveLiveGames(prev => prev + 1);
        if (preferences?.enabled && preferences?.popupEnabled) {
          toast.success(`A new ${e.record.gameType.replace('_', ' ')} live game started!`);
        }
        if (preferences?.enabled && preferences?.soundEnabled) {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => {}); // Ignore auto-play blocking errors
        }
      } else if (e.action === 'update' && !e.record.is_live && e.record.privacy_setting === 'public') {
        // Game ended
        setActiveLiveGames(prev => Math.max(0, prev - 1));
      }
    }).then(unsub => {
      unsubscribeGames = unsub;
    });

    if (currentUser) {
      pb.collection('live_games_notifications').subscribe('*', function (e) {
        if (e.record.userId === currentUser.id) {
          setPreferences(e.record);
        }
      }).then(unsub => {
        unsubscribeSettings = unsub;
      });
    }

    return () => {
      if (unsubscribeGames) unsubscribeGames();
      if (unsubscribeSettings) unsubscribeSettings();
    };
  }, [currentUser, preferences?.enabled, preferences?.popupEnabled, preferences?.soundEnabled]);

  const updatePreferences = async (newPrefs) => {
    if (!currentUser) return;
    try {
      if (preferences?.id) {
        const updated = await pb.collection('live_games_notifications').update(preferences.id, newPrefs, { $autoCancel: false });
        setPreferences(updated);
      } else {
        const created = await pb.collection('live_games_notifications').create({
          userId: currentUser.id,
          notificationType: 'game_type',
          enabled: true,
          ...newPrefs
        }, { $autoCancel: false });
        setPreferences(created);
      }
      toast.success('Notification preferences updated');
    } catch (error) {
      toast.error('Failed to update preferences');
    }
  };

  return (
    <LiveGameNotificationsContext.Provider value={{ preferences, updatePreferences, activeLiveGames }}>
      {children}
    </LiveGameNotificationsContext.Provider>
  );
};

export const useLiveGameNotifications = () => useContext(LiveGameNotificationsContext);
