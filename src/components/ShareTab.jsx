
import React from 'react';
import { useGameShare } from '@/hooks/useGameShare.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Share2, QrCode } from 'lucide-react';
import SocialMediaLinks from '@/components/SocialMediaLinks.jsx';

const ShareTab = ({ gameSessionId }) => {
  const { generateShareLink, shareToSocialMedia, copyToClipboard } = useGameShare(gameSessionId);
  const shareLink = generateShareLink();

  return (
    <div className="flex flex-col h-full gap-6 p-4 bg-card rounded-xl border border-border overflow-y-auto custom-scrollbar">
      
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-2">
          <Share2 className="w-6 h-6" />
        </div>
        <h3 className="font-black text-lg tracking-tight">Invite Friends</h3>
        <p className="text-sm text-muted-foreground">Share this link or QR code to invite others to watch or play.</p>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Game Link</label>
        <div className="flex gap-2">
          <Input 
            readOnly 
            value={shareLink} 
            className="bg-muted/50 font-mono text-xs"
          />
          <Button onClick={copyToClipboard} variant="secondary" className="shrink-0">
            <Copy className="w-4 h-4 mr-2" /> Copy
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Share via Social</label>
        <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex justify-center">
          <SocialMediaLinks size="lg" onShare={shareToSocialMedia} />
        </div>
      </div>

      <div className="space-y-3 flex-1 flex flex-col">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <QrCode className="w-4 h-4" /> Scan to Join
        </label>
        <div className="flex-1 bg-white p-6 rounded-xl border border-border flex items-center justify-center">
          <QRCodeSVG 
            value={shareLink} 
            size={160}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"}
            includeMargin={false}
          />
        </div>
      </div>

    </div>
  );
};

export default ShareTab;
