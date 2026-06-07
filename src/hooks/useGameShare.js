
import { useState, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

export const useGameShare = (gameSessionId) => {
  const { currentUser } = useAuth();
  const [isSharing, setIsSharing] = useState(false);

  const generateShareLink = useCallback(() => {
    return `https://nicdnicolenium.com/games/checkers?gameId=${gameSessionId}&ref=nicdnicolenium`;
  }, [gameSessionId]);

  const logShareEvent = async (platform, shareLink) => {
    if (!currentUser || !gameSessionId) return;
    try {
      await pb.collection('game_shares').create({
        gameSessionId,
        userId: currentUser.id,
        platform,
        share_link: shareLink,
      }, { $autoCancel: false });
    } catch (err) {
      console.error('Failed to log share event:', err);
    }
  };

  const shareToSocialMedia = async (platform) => {
    setIsSharing(true);
    const shareLink = generateShareLink();
    const text = `Join my NICD NICOLENIUM game!`;
    let url = '';

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + shareLink)}`;
        break;
      case 'tiktok':
        await navigator.clipboard.writeText(`${text} ${shareLink}`);
        toast.success('NICD NICOLENIUM link copied for TikTok!');
        logShareEvent('tiktok', shareLink);
        setIsSharing(false);
        return;
      case 'instagram':
        await navigator.clipboard.writeText(`${text} ${shareLink}`);
        toast.success('NICD NICOLENIUM link copied for Instagram!');
        logShareEvent('instagram', shareLink);
        setIsSharing(false);
        return;
      default:
        break;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
      await logShareEvent(platform, shareLink);
      toast.success(`Shared NICD NICOLENIUM match to ${platform}`);
    }
    setIsSharing(false);
  };

  const copyToClipboard = async () => {
    const link = generateShareLink();
    try {
      await navigator.clipboard.writeText(`Play on NICD NICOLENIUM: ${link}`);
      toast.success('NICD NICOLENIUM game link copied!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  return {
    generateShareLink,
    shareToSocialMedia,
    copyToClipboard,
    isSharing
  };
};
