
import { useState, useEffect, useCallback, useRef } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

export const useGameChat = (gameSessionId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const isSubscribed = useRef(false);

  const fetchMessages = useCallback(async () => {
    if (!gameSessionId) return;
    try {
      setLoading(true);
      const records = await pb.collection('game_chat').getFullList({
        filter: `gameSessionId = "${gameSessionId}"`,
        sort: 'created',
        $autoCancel: false,
      });
      setMessages(records);
      setError(null);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [gameSessionId]);

  const subscribeToMessages = useCallback(() => {
    if (!gameSessionId || isSubscribed.current) return;

    pb.collection('game_chat').subscribe('*', (e) => {
      if (e.action === 'create' && e.record.gameSessionId === gameSessionId) {
        setMessages((prev) => [...prev, e.record]);
      } else if (e.action === 'delete') {
        setMessages((prev) => prev.filter((m) => m.id !== e.record.id));
      }
    }, { $autoCancel: false }).then(() => {
      isSubscribed.current = true;
    }).catch(err => {
      console.error('Subscription error:', err);
    });
  }, [gameSessionId]);

  const unsubscribeFromMessages = useCallback(() => {
    if (isSubscribed.current) {
      pb.collection('game_chat').unsubscribe('*');
      isSubscribed.current = false;
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [fetchMessages, subscribeToMessages, unsubscribeFromMessages]);

  const sendMessage = async (text) => {
    if (!currentUser) {
      toast.error('You must be logged in to chat.');
      return false;
    }
    if (!text.trim() || !gameSessionId) return false;

    try {
      await pb.collection('game_chat').create({
        gameSessionId,
        userId: currentUser.id,
        username: currentUser.username || 'Player',
        messageText: text.trim().substring(0, 500),
        characterCount: text.trim().length,
      }, { $autoCancel: false });
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message.');
      return false;
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    fetchMessages
  };
};
