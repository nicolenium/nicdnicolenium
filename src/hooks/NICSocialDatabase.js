
import { useState, useEffect, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';

export const useNICSocialDatabase = (gameId) => {
  const [comments, setComments] = useState([]);
  const [viewerCount, setViewerCount] = useState(0);

  const loadComments = useCallback(async () => {
    if (!gameId) return;
    try {
      const records = await pb.collection('game_comments').getFullList({
        filter: `game_id = "${gameId}"`,
        sort: '-created',
        expand: 'user_id',
        $autoCancel: false
      });
      setComments(records);
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  }, [gameId]);

  const loadViewerCount = useCallback(async () => {
    if (!gameId) return;
    try {
      const records = await pb.collection('live_viewers').getFullList({
        filter: `game_id = "${gameId}"`,
        $autoCancel: false
      });
      setViewerCount(records.length);
    } catch (err) {
      console.error("Error loading viewers:", err);
    }
  }, [gameId]);

  useEffect(() => {
    loadComments();
    loadViewerCount();

    if (gameId) {
      pb.collection('game_comments').subscribe('*', (e) => {
        if (e.action === 'create' && e.record.game_id === gameId) {
          loadComments();
        }
      });
      pb.collection('live_viewers').subscribe('*', (e) => {
        if (e.record.game_id === gameId) {
          loadViewerCount();
        }
      });
    }

    return () => {
      pb.collection('game_comments').unsubscribe('*');
      pb.collection('live_viewers').unsubscribe('*');
    };
  }, [gameId, loadComments, loadViewerCount]);

  const postComment = async (userId, text) => {
    if (!gameId || !userId || !text) return;
    try {
      await pb.collection('game_comments').create({
        game_id: gameId,
        user_id: userId,
        comment_text: text
      }, { $autoCancel: false });
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const addLiveViewer = async (userId) => {
    if (!gameId || !userId) return;
    try {
      await pb.collection('live_viewers').create({
        game_id: gameId,
        user_id: userId
      }, { $autoCancel: false });
    } catch (err) {
      console.error("Error adding viewer:", err);
    }
  };

  const removeLiveViewer = async (userId) => {
    if (!gameId || !userId) return;
    try {
      const records = await pb.collection('live_viewers').getFullList({
        filter: `game_id = "${gameId}" && user_id = "${userId}"`,
        $autoCancel: false
      });
      for (const record of records) {
        await pb.collection('live_viewers').delete(record.id, { $autoCancel: false });
      }
    } catch (err) {
      console.error("Error removing viewer:", err);
    }
  };

  const shareGame = async (userId, platform, link) => {
    if (!gameId || !userId) return;
    try {
      await pb.collection('game_shares').create({
        game_id: gameId,
        shared_by_user_id: userId,
        platform: platform,
        share_link: link
      }, { $autoCancel: false });
    } catch (err) {
      console.error("Error sharing game:", err);
    }
  };

  return {
    comments,
    viewerCount,
    postComment,
    addLiveViewer,
    removeLiveViewer,
    shareGame
  };
};
