
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';
import { History, Activity, Share2, Trophy } from 'lucide-react';
import GameSharingPanel from '@/components/GameSharingPanel.jsx';

export default function GameMatchTabs({ history = [], analysisData = null, gameId, gameType, players }) {
  return (
    <Card className="w-full h-full flex flex-col border-none shadow-md bg-card/50 backdrop-blur-sm">
      <Tabs defaultValue="history" className="w-full h-full flex flex-col">
        <TabsList className="w-full grid grid-cols-3 rounded-t-2xl rounded-b-none border-b bg-muted/50 p-0 h-14">
          <TabsTrigger value="history" className="h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent">
            <History className="w-4 h-4 mr-2" /> Moves
          </TabsTrigger>
          <TabsTrigger value="analysis" className="h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent">
            <Activity className="w-4 h-4 mr-2" /> Analysis
          </TabsTrigger>
          <TabsTrigger value="share" className="h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-hidden relative">
          <TabsContent value="history" className="h-full m-0 p-0 data-[state=active]:flex flex-col">
            <ScrollArea className="flex-1 p-4">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <History className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-sm font-medium">No moves recorded yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-mono">
                  {history.map((move, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <span className="text-muted-foreground w-6 text-right">{idx + 1}.</span>
                      <span className="font-medium">{move}</span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="analysis" className="h-full m-0 p-4 data-[state=active]:flex flex-col gap-4 overflow-y-auto">
            {analysisData ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-4">
                  <Trophy className="w-8 h-8 text-primary" />
                  <div>
                    <h4 className="font-bold text-primary-foreground">Advantage</h4>
                    <p className="text-sm text-muted-foreground">{analysisData.advantage || 'Even game'}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Key Moments</h4>
                  {analysisData.highlights?.map((h, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted text-sm">
                      {h}
                    </div>
                  )) || <p className="text-sm text-muted-foreground">No key moments identified yet.</p>}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Activity className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm font-medium">Analysis available after game</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="share" className="h-full m-0 p-4 data-[state=active]:flex flex-col">
            <GameSharingPanel gameId={gameId} gameType={gameType} players={players} />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}
