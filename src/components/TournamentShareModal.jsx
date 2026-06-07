
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Share2, Copy, Check, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

export default function TournamentShareModal({ tournamentId, tournamentName, customLink }) {
  const [copied, setCopied] = useState(false);
  
  // Use custom shareable link if available, otherwise construct the default URL
  const shareUrl = customLink 
    ? `${window.location.origin}${customLink.startsWith('/') ? customLink : '/' + customLink}?ref=nicdnicolenium` 
    : `${window.location.origin}/tournament/${tournamentId}?ref=nicdnicolenium`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`Join the NICD NICOLENIUM tournament: ${shareUrl}`);
      setCopied(true);
      toast.success("NICD NICOLENIUM tournament link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleSocialShare = (platform) => {
    const text = encodeURIComponent(`Join me in the ${tournamentName} on NICD NICOLENIUM!`);
    const url = encodeURIComponent(shareUrl);
    let shareLink = '';

    switch(platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'whatsapp':
        shareLink = `https://api.whatsapp.com/send?text=${text} ${url}`;
        break;
      default:
        break;
    }
    
    if (shareLink) window.open(shareLink, '_blank', 'width=600,height=400');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full font-bold bg-secondary hover:bg-secondary/80 text-secondary-foreground">
          <Share2 className="w-4 h-4 mr-2" /> Share Tournament
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground border-border rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Share NICD NICOLENIUM Tournament</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Invite players and spectators to {tournamentName} on NICD NICOLENIUM.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="p-4 bg-white rounded-xl shadow-inner">
            <QRCodeSVG 
              value={shareUrl} 
              size={180} 
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "/nicd-icon.svg",
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </div>
          
          <div className="w-full space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">NICD NICOLENIUM Link</label>
            <div className="flex gap-2">
              <Input 
                readOnly 
                value={shareUrl} 
                className="bg-muted text-foreground font-mono text-xs focus-visible:ring-1"
              />
              <Button 
                variant={copied ? "default" : "secondary"} 
                className="shrink-0 transition-all duration-300"
                onClick={handleCopy}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="w-full space-y-2 pt-2 border-t border-border">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Share via</label>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" size="icon" className="rounded-full hover:text-blue-500 hover:border-blue-500 hover:bg-blue-500/10" onClick={() => handleSocialShare('facebook')}>
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:text-sky-400 hover:border-sky-400 hover:bg-sky-400/10" onClick={() => handleSocialShare('twitter')}>
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:text-green-500 hover:border-green-500 hover:bg-green-500/10" onClick={() => handleSocialShare('whatsapp')}>
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
