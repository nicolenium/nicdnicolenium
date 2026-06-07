
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useGameLink = (gameType, gameId) => {
  const [isCopied, setIsCopied] = useState(false);

  const generateLink = useCallback(() => {
    if (!gameType || !gameId) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/games/${gameType}/${gameId}?ref=nicdnicolenium`;
  }, [gameType, gameId]);

  const copyLink = useCallback(async () => {
    const link = generateLink();
    if (!link) return;
    
    try {
      const brandedText = `Play with me on NICD NICOLENIUM! ${link}`;
      await navigator.clipboard.writeText(brandedText);
      setIsCopied(true);
      toast.success('NICD NICOLENIUM link copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast.error('Failed to copy link. Please try manually.');
    }
  }, [generateLink]);

  return {
    link: generateLink(),
    copyLink,
    isCopied
  };
};
