
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Facebook, Mail, MessageCircle, QrCode, Tv, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.jsx';

const ShareButtons = ({ url, title }) => {
  const [showQR, setShowQR] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    toast.success('Invitation link copied to clipboard.');
  };

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Play a game with me! Join here: ${url}`)}`;
  };

  const shareTikTok = () => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied! Paste it in your TikTok video or bio.');
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <TooltipProvider>
        <div className="flex flex-wrap items-center gap-3 justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-border hover:bg-muted interactive-scale shadow-sm" onClick={handleCopy}>
                <Copy className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy Link</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/10 interactive-scale shadow-sm" onClick={shareWhatsApp}>
                <MessageCircle className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>WhatsApp</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-[#1877F2]/20 text-[#1877F2] hover:bg-[#1877F2]/10 interactive-scale shadow-sm" onClick={shareFacebook}>
                <Facebook className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Facebook</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-border hover:bg-muted interactive-scale shadow-sm" onClick={shareEmail}>
                <Mail className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Email</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-border hover:bg-muted interactive-scale shadow-sm" onClick={shareTikTok}>
                <Tv className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>TikTok</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className={`rounded-full w-10 h-10 border-border interactive-scale shadow-sm ${showQR ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`} onClick={() => setShowQR(!showQR)}>
                <QrCode className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Show QR Code</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {showQR && (
        <div className="p-4 bg-white rounded-2xl shadow-xl border border-border animate-in fade-in zoom-in duration-200">
          <QRCodeSVG value={url} size={160} level="H" includeMargin={false} fgColor="#000000" bgColor="#FFFFFF" />
        </div>
      )}
    </div>
  );
};

export default ShareButtons;
