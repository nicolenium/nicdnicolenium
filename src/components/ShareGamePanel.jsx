
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Share2, Copy, Check, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

export default function ShareGamePanel({ gameId, gameType }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/games/${gameType}/${gameId}?ref=nicdnicolenium`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`Play on NICD NICOLENIUM: ${shareUrl}`);
    setCopied(true);
    toast.success('NICD NICOLENIUM link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Watch my live ${gameType} game on NICD NICOLENIUM!`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 font-bold">
          <Share2 className="w-4 h-4" /> Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Share NICD NICOLENIUM Game</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <QRCodeSVG value={shareUrl} size={150} level="H" />
          </div>
          
          <div className="flex flex-col w-full gap-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase px-1">NICD NICOLENIUM Share Link</div>
            <div className="flex w-full gap-2">
              <Input readOnly value={shareUrl} className="bg-muted/50 font-mono text-xs text-foreground" />
              <Button size="icon" onClick={handleCopy} className="shrink-0">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="flex gap-4 w-full justify-center">
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10 hover:text-blue-500 hover:border-blue-500" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}>
              <Facebook className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10 hover:text-sky-400 hover:border-sky-400" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank')}>
              <Twitter className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10 hover:text-green-500 hover:border-green-500" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')}>
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
