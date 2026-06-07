import React from 'react';
import { Share2, Twitter, Facebook, MessageCircle, Instagram, Tv, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { toast } from 'sonner';
import ShareableGameLink from './ShareableGameLink.jsx';
import { useGameLink } from '@/hooks/useGameLink.js';

const GameSharingPanel = ({ gameId, gameType = "checkers", players = "Players" }) => {
  const { link, copyLink } = useGameLink(gameType, gameId);
  const shareText = `Watch this epic ${gameType} match between ${players} on NICD Games!`;

  const openShare = (url) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <Card className="w-full shadow-lg border-2 rounded-2xl overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-primary to-secondary" />
      <CardHeader className="pb-3 bg-muted/30">
        <CardTitle className="text-lg flex items-center gap-2 font-black font-serif">
          <Share2 className="w-5 h-5 text-primary" /> Share Match
        </CardTitle>
        <CardDescription>Invite friends to watch or share your victory.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        
        <ShareableGameLink gameType={gameType} gameId={gameId} />
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <Button variant="outline" className="w-full gap-2 bg-[#1DA1F2]/5 text-[#1DA1F2] hover:bg-[#1DA1F2]/15 border-transparent rounded-xl" onClick={() => openShare(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(link)}`)}>
            <Twitter className="w-4 h-4" /> X / Twitter
          </Button>
          <Button variant="outline" className="w-full gap-2 bg-[#1877F2]/5 text-[#1877F2] hover:bg-[#1877F2]/15 border-transparent rounded-xl" onClick={() => openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`)}>
            <Facebook className="w-4 h-4" /> Facebook
          </Button>
          <Button variant="outline" className="w-full gap-2 bg-[#E1306C]/5 text-[#E1306C] hover:bg-[#E1306C]/15 border-transparent rounded-xl" onClick={() => { copyLink(); toast.success("Link copied for Instagram!"); }}>
            <Instagram className="w-4 h-4" /> Instagram
          </Button>
          <Button variant="outline" className="w-full gap-2 bg-black/5 text-foreground hover:bg-black/10 border-transparent rounded-xl dark:bg-white/5 dark:hover:bg-white/15" onClick={() => { copyLink(); toast.success("Link copied for TikTok!"); }}>
            <Tv className="w-4 h-4" /> TikTok
          </Button>
          <Button variant="outline" className="w-full gap-2 bg-[#5865F2]/5 text-[#5865F2] hover:bg-[#5865F2]/15 border-transparent rounded-xl" onClick={() => { copyLink(); toast.success("Link copied for Discord!"); }}>
            <MessageCircle className="w-4 h-4" /> Discord
          </Button>
          <Button variant="default" className="w-full gap-2 rounded-xl shadow-md" onClick={() => toast.success("Game is now visible in Community Live!")}>
            <Radio className="w-4 h-4" /> Community
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameSharingPanel;