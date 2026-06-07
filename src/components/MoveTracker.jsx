
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Clock, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const MoveTracker = ({ moves = [], title = "Move History" }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = React.useState(false);

  const copyNotation = () => {
    const text = moves.map((m, i) => `Move ${i + 1}: ${m.player === 1 ? 'White' : m.player === 2 ? 'Black' : 'Player'} ${m.notation}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Notation copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="h-full max-h-[400px] flex flex-col bg-card border-border shadow-sm">
      <CardHeader className="py-3 border-b border-border/50 bg-muted/20 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <History className="w-4 h-4 text-brand-primary" />
          {t('tracker.moves') || title}
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={copyNotation} disabled={moves.length === 0}>
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />}
        </Button>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {moves.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No moves recorded yet. Start playing!
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {moves.map((move, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground font-mono text-xs font-bold w-6">{(index + 1).toString().padStart(2, '0')}.</span>
                    {move.player && (
                      <span className={`w-2 h-2 rounded-full ${move.player === 1 ? 'bg-red-500' : 'bg-slate-500'}`}></span>
                    )}
                    <span className="font-bold text-sm text-foreground">{move.notation}</span>
                    {move.quality && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
                        ${move.quality === 'good' ? 'bg-green-500/20 text-green-500' : 
                          move.quality === 'bad' ? 'bg-orange-500/20 text-orange-500' : 
                          'bg-red-500/20 text-red-500'}`}>
                        {move.quality}
                      </span>
                    )}
                  </div>
                  {move.timeSpent !== undefined && move.timeSpent > 0 && (
                    <div className="flex items-center text-[10px] text-muted-foreground font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      <Clock className="w-3 h-3 mr-1" />
                      {move.timeSpent.toFixed(1)}s
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MoveTracker;
