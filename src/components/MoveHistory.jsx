
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History } from 'lucide-react';

const MoveHistory = ({ moves = [], activePlayer }) => {
  const scrollRef = useRef(null);

  // Group moves into pairs (White, Black)
  const pairedMoves = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairedMoves.push({
      turn: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1] || null
    });
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves]);

  return (
    <Card className="bg-card border-border shadow-sm flex flex-col h-full max-h-[400px]">
      <CardHeader className="py-4 border-b border-border bg-muted/20">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <History className="w-4 h-4 text-primary" /> 
          Move History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 relative">
        <ScrollArea className="h-full w-full" ref={scrollRef}>
          {moves.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Waiting for the first move...
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/30 sticky top-0 backdrop-blur-md text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2 text-left w-12">#</th>
                  <th className="px-4 py-2 text-left">White</th>
                  <th className="px-4 py-2 text-left">Black</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 font-mono">
                {pairedMoves.map((pair) => (
                  <tr key={pair.turn} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-2.5 text-muted-foreground">{pair.turn}.</td>
                    <td className={`px-4 py-2.5 ${activePlayer === 2 && !pair.black ? 'font-bold text-primary' : 'text-foreground'}`}>
                      {pair.white?.notation || '-'}
                      {pair.white?.timeSpent && <span className="text-[10px] text-muted-foreground ml-2">({pair.white.timeSpent}s)</span>}
                    </td>
                    <td className={`px-4 py-2.5 ${activePlayer === 1 && pair.black ? 'font-bold text-primary' : 'text-foreground'}`}>
                      {pair.black?.notation || ''}
                      {pair.black?.timeSpent && <span className="text-[10px] text-muted-foreground ml-2">({pair.black.timeSpent}s)</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MoveHistory;
