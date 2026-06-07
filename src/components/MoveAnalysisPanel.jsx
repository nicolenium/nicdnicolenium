
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, TrendingUp, ShieldAlert, Target, Info, ChevronDown, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.jsx';
import { cn } from '@/lib/utils.js';

export function MoveAnalysisPanel({ analysis, className }) {
  const [isOpen, setIsOpen] = React.useState(true);

  if (!analysis) return null;

  const {
    evaluation = 'neutral',
    winProbability = 50,
    confidence = 85,
    reasoning = "Analyzing position...",
    evalScore = 0,
    alternatives = []
  } = analysis;

  const evalConfig = {
    winning: { color: 'bg-emerald-500 text-white', icon: Target, label: 'Winning Advantage', ring: 'ring-emerald-500/20' },
    good: { color: 'bg-blue-500 text-white', icon: TrendingUp, label: 'Strong Position', ring: 'ring-blue-500/20' },
    neutral: { color: 'bg-slate-500 text-white', icon: Activity, label: 'Balanced Game', ring: 'ring-slate-500/20' },
    bad: { color: 'bg-destructive text-destructive-foreground', icon: ShieldAlert, label: 'Disadvantage', ring: 'ring-destructive/20' }
  };

  const currentConfig = evalConfig[evaluation] || evalConfig.neutral;
  const EvalIcon = currentConfig.icon;

  return (
    <Card className={cn("w-full border-2 shadow-lg overflow-hidden transition-all duration-300", currentConfig.ring, className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className={cn("flex items-center justify-between p-4", currentConfig.color)}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-wider opacity-90">AI PRO Analysis</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <EvalIcon className="w-4 h-4" />
                <span className="font-bold">{currentConfig.label}</span>
              </div>
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", isOpen ? "rotate-180" : "")} />
            </button>
          </CollapsibleTrigger>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <CollapsibleContent asChild forceMount>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <CardContent className="p-5 space-y-6 bg-card">
                  {/* Win Probability & Confidence */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <span>Win Prob</span>
                        <span className={winProbability > 50 ? 'text-emerald-500' : 'text-foreground'}>{winProbability.toFixed(1)}%</span>
                      </div>
                      <Progress value={winProbability} className={cn("h-2", winProbability > 50 ? "[&>div]:bg-emerald-500" : "")} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <span>Confidence</span>
                        <span className="text-primary">{confidence}%</span>
                      </div>
                      <Progress value={confidence} className="h-2" />
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">Strategic Reasoning</span>
                        <p className="text-sm font-medium leading-relaxed">{reasoning}</p>
                      </div>
                    </div>
                  </div>

                  {/* Score & Alternatives */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Eval Score</span>
                      <span className="text-xl font-black tabular-nums">{evalScore > 0 ? '+' : ''}{(evalScore / 100).toFixed(2)}</span>
                    </div>
                    
                    {alternatives.length > 0 && (
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Top Alternatives</span>
                        <div className="flex gap-2">
                          {alternatives.map((alt, idx) => (
                            <Badge key={idx} variant="outline" className="text-[10px] uppercase font-bold border-border/50 bg-background">
                              {alt.text} ({alt.scoreDiff})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </motion.div>
            </CollapsibleContent>
          )}
        </AnimatePresence>
      </Collapsible>
    </Card>
  );
}
