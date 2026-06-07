import React from 'react';
import { Facebook, Instagram, MessageCircle, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const SocialMediaLinks = ({ layout = 'horizontal', size = 'md', className = '', onShare }) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'hover:text-[#1877F2] hover:bg-[#1877F2]/10' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'hover:text-[#E4405F] hover:bg-[#E4405F]/10' },
    { id: 'tiktok', name: 'TikTok', icon: Music2, color: 'hover:text-foreground hover:bg-foreground/10' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'hover:text-[#25D366] hover:bg-[#25D366]/10' }
  ];

  return (
    <div className={`flex ${layout === 'vertical' ? 'flex-col' : 'flex-row'} gap-2 ${className}`}>
      <TooltipProvider>
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <Tooltip key={platform.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full transition-all duration-300 ${platform.color}`}
                  onClick={() => onShare ? onShare(platform.id) : window.open('#', '_blank')}
                  aria-label={`Share on ${platform.name}`}
                >
                  <Icon className={iconSizes[size]} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{onShare ? `Share to ${platform.name}` : `Visit our ${platform.name}`}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
};

export default SocialMediaLinks;