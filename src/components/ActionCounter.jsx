
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Zap, Target, Star } from 'lucide-react';

const ActionCounter = ({ actions = 0, score = 0, combo = 0, efficiency = 100 }) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-4 flex flex-col items-center text-center">
          <Activity className="w-5 h-5 text-primary mb-2 opacity-70" />
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">{t('tracker.actions') || 'Actions'}</p>
          <p className="text-2xl font-black font-mono">{actions}</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-4 flex flex-col items-center text-center">
          <Star className="w-5 h-5 text-yellow-500 mb-2 opacity-70" />
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Score</p>
          <p className="text-2xl font-black font-mono text-yellow-500">{score}</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-4 flex flex-col items-center text-center">
          <Zap className="w-5 h-5 text-orange-500 mb-2 opacity-70" />
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">{t('tracker.combo') || 'Combo'}</p>
          <p className="text-2xl font-black font-mono text-orange-500">x{combo}</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-4 flex flex-col items-center text-center">
          <Target className="w-5 h-5 text-green-500 mb-2 opacity-70" />
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">{t('tracker.efficiency') || 'Efficiency'}</p>
          <p className="text-2xl font-black font-mono text-green-500">{efficiency.toFixed(1)}%</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionCounter;
