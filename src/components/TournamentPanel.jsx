
import React from 'react';
import { Trophy, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';

const TournamentPanel = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Weekly 10x10 Championship</CardTitle>
            <CardDescription>Swiss format • 5 Rounds • 10m+5s</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">Registration Open</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4 text-center divide-x">
          <div>
            <div className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1"><Users className="w-4 h-4"/> Players</div>
            <div className="font-bold text-lg">24/64</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1"><Trophy className="w-4 h-4"/> Prize</div>
            <div className="font-bold text-lg">5,000 pts</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1"><Calendar className="w-4 h-4"/> Starts In</div>
            <div className="font-bold text-lg">2h 15m</div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-sm">Current Standings (Preview)</h4>
          <div className="space-y-2">
            {[1, 2, 3].map((pos) => (
              <div key={pos} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-4 text-muted-foreground font-mono">{pos}.</span>
                  <span className="font-medium">Player_{pos}99</span>
                </div>
                <span className="font-mono">{4 - pos}.0 pts</span>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full" size="lg">Join Tournament</Button>
      </CardContent>
    </Card>
  );
};

export default TournamentPanel;
