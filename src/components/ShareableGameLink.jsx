
import React from 'react';
import { Copy, Check, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { useGameLink } from '@/hooks/useGameLink.js';
import { cn } from '@/lib/utils.js';

const ShareableGameLink = ({ gameType, gameId, className }) => {
  const { link, copyLink, isCopied } = useGameLink(gameType, gameId);

  if (!link) return null;

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1">
        NICD NICOLENIUM Link
      </span>
      <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-xl border border-border/50">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background shadow-sm shrink-0">
          <LinkIcon className="w-4 h-4 text-muted-foreground" />
        </div>
        <Input 
          readOnly 
          value={link} 
          className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 px-2 text-xs sm:text-sm font-mono text-foreground h-8"
        />
        <Button 
          size="sm" 
          variant={isCopied ? "default" : "secondary"}
          onClick={copyLink} 
          className="h-8 px-3 shrink-0 rounded-lg transition-all"
        >
          {isCopied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
          {isCopied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
};

export default ShareableGameLink;
