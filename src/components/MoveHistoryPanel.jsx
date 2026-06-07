
import React, { useEffect, useRef } from 'react';
import { X, Download, History } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';

export default function MoveHistoryPanel({ history = [], onClose, gameType }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const downloadHistory = () => {
    const isChessLike = ['chess', 'checkers_8x8', 'checkers_10x10'].includes(gameType);
    const extension = isChessLike ? 'pgn' : 'txt';
    
    let content = `[Event "Casual Game"]\n[Site "NICOLENIUM"]\n[Date "${new Date().toISOString().split('T')[0]}"]\n[GameType "${gameType}"]\n\n`;
    
    if (isChessLike) {
      for (let i = 0; i < history.length; i += 2) {
        const moveNum = Math.floor(i / 2) + 1;
        const whiteMove = history[i]?.notation || history[i] || '';
        const blackMove = history[i + 1]?.notation || history[i + 1] || '';
        
        const wStr = typeof whiteMove === 'object' ? whiteMove.notation : whiteMove;
        const bStr = typeof blackMove === 'object' ? blackMove.notation : blackMove;
        
        content += `${moveNum}. ${wStr} ${bStr} `;
      }
    } else {
      history.forEach((m, i) => {
        const moveStr = typeof m === 'object' ? m.notation : m;
        content += `${i + 1}. ${moveStr}\n`;
      });
    }
    
    const blob = new Blob([content.trim()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gameType}_history.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderMoves = () => {
    if (['chess', 'checkers_8x8', 'checkers_10x10'].includes(gameType)) {
      const pairs = [];
      for (let i = 0; i < history.length; i += 2) {
        pairs.push({
          num: Math.floor(i / 2) + 1,
          w: history[i],
          b: history[i + 1]
        });
      }
      return pairs.map((pair, idx) => {
        const wStr = typeof pair.w === 'object' ? pair.w.notation : pair.w;
        const bStr = pair.b ? (typeof pair.b === 'object' ? pair.b.notation : pair.b) : '';
        const isLast = idx === pairs.length - 1;
        
        return (
          <div key={idx} className={`flex items-center text-sm p-2 rounded-lg transition-colors ${isLast ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'}`}>
            <span className="text-muted-foreground font-mono w-8 font-bold">{pair.num}.</span>
            <span className={`flex-1 font-medium ${isLast && !pair.b ? 'text-primary font-bold' : ''}`}>{wStr}</span>
            <span className={`flex-1 font-medium ${isLast && pair.b ? 'text-primary font-bold' : ''}`}>{bStr}</span>
          </div>
        );
      });
    }

    return history.map((move, idx) => {
      const moveStr = typeof move === 'object' ? move.notation : move;
      const isLast = idx === history.length - 1;
      return (
        <div key={idx} className={`flex gap-3 text-sm p-2.5 rounded-lg transition-colors ${isLast ? 'bg-primary/10 border border-primary/20 text-primary font-bold' : 'hover:bg-muted/50 font-medium'}`}>
          <span className="text-muted-foreground font-mono w-6">{idx + 1}.</span>
          <span>{moveStr}</span>
        </div>
      );
    });
  };

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col h-full shadow-2xl z-20 animate-in slide-in-from-right-8">
      <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
        <h3 className="font-black text-lg flex items-center gap-2">
          <History className="w-5 h-5 text-primary" /> Move History
        </h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={downloadHistory} title="Download Log" className="hover:bg-primary/10 hover:text-primary rounded-xl">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 pt-12">
            <History className="w-12 h-12 mb-4" />
            <p className="font-medium">No moves recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-1 pb-4">
            {renderMoves()}
            <div ref={scrollRef} className="h-4" />
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
