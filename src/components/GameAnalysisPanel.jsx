
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Activity, BrainCircuit, Target, AlertTriangle, Lightbulb, TrendingUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';

export default function GameAnalysisPanel({ history = [], analysisData = {}, moveCount = 0, onClose }) {
  const isAdvantage = parseFloat(analysisData.evalScore || 0) > 0;
  const isDisadvantage = parseFloat(analysisData.evalScore || 0) < 0;
  const evalScore = parseFloat(analysisData.evalScore || 0);

  return (
    <div className="absolute right-0 top-0 bottom-0 bg-card border-l border-border shadow-2xl w-full sm:w-80 lg:w-96 flex flex-col z-40 animate-in slide-in-from-right overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
        <h3 className="font-bold text-lg tracking-tight flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-primary" />
          Pro AI Analysis
        </h3>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <Card className="bg-muted/30 border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Live Evaluation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold">Position Score</span>
                <Badge variant={isAdvantage ? 'default' : isDisadvantage ? 'destructive' : 'secondary'} className="text-base px-3 py-1 font-mono">
                  {evalScore > 0 ? '+' : ''}{evalScore.toFixed(2)}
                </Badge>
              </div>
              
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  <span>P2 Advantage</span>
                  <span>P1 Advantage</span>
                </div>
                <div className="h-3 w-full bg-secondary/20 rounded-full overflow-hidden flex border border-border/50">
                  <div 
                    className="h-full bg-destructive transition-all duration-500" 
                    style={{ width: `${Math.max(0, 50 - evalScore * 5)}%` }} 
                  />
                  <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${Math.max(0, evalScore * 5 + 50)}%` }} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" /> Game Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background p-3 rounded-lg border border-border text-center">
                  <p className="text-2xl font-black text-foreground">{moveCount || history.length}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Total Moves</p>
                </div>
                <div className="bg-background p-3 rounded-lg border border-border text-center">
                  <p className="text-2xl font-black text-foreground">{analysisData.captures || 0}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Captures</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-secondary" /> Engine Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysisData.bestMove && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" /> Recommended Move
                  </div>
                  <div className="text-sm font-mono font-bold text-foreground bg-primary/10 p-3 rounded-md border border-primary/20">
                    {analysisData.bestMove}
                  </div>
                </div>
              )}

              {analysisData.threats && analysisData.threats.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-destructive flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Threats Detected
                  </div>
                  {analysisData.threats.map((threat, idx) => (
                    <div key={idx} className="text-sm font-medium text-destructive-foreground bg-destructive p-2 rounded-md">
                      {threat}
                    </div>
                  ))}
                </div>
              )}

              {!analysisData.bestMove && !analysisData.threats && (
                <p className="text-sm text-muted-foreground italic">Play a few more moves to generate detailed insights.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
