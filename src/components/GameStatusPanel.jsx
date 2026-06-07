
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const GameStatusPanel = ({ currentPlayer, moveCount, capturedPieces, gameStatus, currentMove }) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Status</span>
          <Badge variant={gameStatus === 'in_progress' ? 'default' : 'secondary'}>
            {gameStatus.replace('_', ' ')}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Turn</span>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${currentPlayer === 1 ? 'bg-[hsl(var(--fmjd-p1))]' : 'bg-[hsl(var(--fmjd-p2))] border border-border'}`} />
            <span className="font-bold">{currentPlayer === 1 ? 'Red' : 'White'}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Move</span>
          <span className="font-mono font-bold">{moveCount}</span>
        </div>

        <div className="pt-4 border-t border-border grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-xs font-bold text-muted-foreground mb-1">Red Caps</div>
            <div className="text-2xl font-black text-[hsl(var(--fmjd-p1))]">{capturedPieces?.p1 || 0}</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold text-muted-foreground mb-1">White Caps</div>
            <div className="text-2xl font-black text-[hsl(var(--fmjd-p2))] drop-shadow-sm">{capturedPieces?.p2 || 0}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameStatusPanel;
