
import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.jsx';
import { Share2, Facebook, Twitter, MessageCircle, Tv, Radio } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import ShareableGameLink from './ShareableGameLink.jsx';
import { useGameLink } from '@/hooks/useGameLink.js';

const ShareButton = ({ gameId, gameType = "checkers", title = "Watch my game on NICD NICOLENIUM!" }) => {
  const [open, setOpen] = useState(false);
  const { link } = useGameLink(gameType, gameId);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${link}`)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(link)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
  };

  const handleCommunityShare = () => {
    toast.success("Game shared to NICD NICOLENIUM Community Live!");
    setOpen(false);
  };

  const handleTikTokShare = () => {
    navigator.clipboard.writeText(`Play on NICD NICOLENIUM: ${link}`);
    toast.success("NICD NICOLENIUM link copied! Paste it in your TikTok video or bio.");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-full shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors">
          <Share2 className="w-4 h-4" /> Share Match
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-5 rounded-2xl shadow-xl border-2" align="end">
        <h4 className="font-black text-lg mb-1 font-serif">Share NICD Match</h4>
        <p className="text-xs text-muted-foreground mb-4">Invite friends to spectate or replay this game on NICD NICOLENIUM.</p>
        
        <div className="flex flex-col items-center mb-5 p-4 bg-white rounded-xl border shadow-sm">
          <QRCodeSVG value={link} size={140} level="M" includeMargin={false} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-3 text-center">Scan to view</span>
        </div>

        <ShareableGameLink gameType={gameType} gameId={gameId} className="mb-5" />

        <div className="grid grid-cols-5 gap-2 mb-4">
          <Button variant="ghost" size="icon" className="rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20" asChild>
            <a href={shareLinks.whatsapp} target="_blank" rel="noreferrer"><MessageCircle className="w-4 h-4" /></a>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20" asChild>
            <a href={shareLinks.twitter} target="_blank" rel="noreferrer"><Twitter className="w-4 h-4" /></a>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-[#4267B2]/10 text-[#4267B2] hover:bg-[#4267B2]/20" asChild>
            <a href={shareLinks.facebook} target="_blank" rel="noreferrer"><Facebook className="w-4 h-4" /></a>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-black/5 text-foreground hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20" onClick={handleTikTokShare}>
            <Tv className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20" onClick={handleCommunityShare}>
            <Radio className="w-4 h-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton;
