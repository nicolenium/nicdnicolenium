
import React, { useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, Trash2, Download, Clock } from 'lucide-react';
import { format } from 'date-fns';

const GameHistoryPanel = ({ moves, onClear, onExport, duration, status, p1Name, p2Name }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves]);

  return (
    <Card className="flex flex-col h-full bg-card border-border shadow-sm overflow-hidden">
      <CardHeader className="py-3 px-4 border-b border-border/50 bg-muted/20 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <History className="w-4 h-4 text-primary" /> Game History
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={onExport} title="Export PGN">
            <Download className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onClear} title="Clear History">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 flex flex-col min-h-[200px]">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-px bg-border/50 border-b border-border/50 text-xs">
          <div className="bg-card p-2 text-center">
            <p className="text-muted-foreground">Total Moves</p>
            <p className="font-bold font-mono">{moves.length}</p>
          </div>
          <div className="bg-card p-2 text-center">
            <p className="text-muted-foreground">Duration</p>
            <p className="font-bold font-mono flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" /> {duration}
            </p>
          </div>
        </div>

        {/* Moves List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1" ref={scrollRef}>
          {moves.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic">
              No moves played yet.
            </div>
          ) : (
            moves.reduce((pairs, move, index) => {
              if (index % 2 === 0) pairs.push([move]);
              else pairs[pairs.length - 1].push(move);
              return pairs;
            }, []).map((pair, idx) => (
              <div key={idx} className="flex text-xs border border-border/30 rounded bg-muted/10 hover:bg-muted/30 transition-colors">
                <div className="w-8 flex items-center justify-center border-r border-border/30 text-muted-foreground font-mono bg-muted/20">
                  {idx + 1}.
                </div>
                <div className="flex-1 flex">
                  <div className={`flex-1 p-1.5 font-mono ${pair[0].quality === 'good' ? 'text-green-500 font-bold' : ''}`}>
                    {pair[0].notation}
                  </div>
                  {pair[1] && (
                    <div className={`flex-1 p-1.5 font-mono border-l border-border/30 ${pair[1].quality === 'good' ? 'text-green-500 font-bold' : ''}`}>
                      {pair[1].notation}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameHistoryPanel;
