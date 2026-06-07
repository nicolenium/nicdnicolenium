
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Video, Share2 } from 'lucide-react';
import ChatTab from '@/components/ChatTab.jsx';
import AVTab from '@/components/AVTab.jsx';
import ShareTab from '@/components/ShareTab.jsx';

const NICSocialPanel = ({ gameSessionId = 'demo-session' }) => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="flex flex-col h-full w-full bg-background rounded-2xl shadow-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card flex justify-between items-center">
        <div>
          <h3 className="font-black text-xl tracking-tighter text-foreground">NICD SOCIAL</h3>
          <p className="text-[10px] font-bold tracking-widest text-primary uppercase mt-0.5">Be Good And Do Good</p>
        </div>
        <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-1 rounded-full">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-xs font-black tracking-widest">LIVE</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-muted/30 h-14 p-0">
          <TabsTrigger 
            value="chat" 
            className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-background font-bold tracking-wide"
          >
            <MessageSquare className="w-4 h-4 mr-2" /> CHAT
          </TabsTrigger>
          <TabsTrigger 
            value="av" 
            className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-background font-bold tracking-wide"
          >
            <Video className="w-4 h-4 mr-2" /> A/V
          </TabsTrigger>
          <TabsTrigger 
            value="share" 
            className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-background font-bold tracking-wide"
          >
            <Share2 className="w-4 h-4 mr-2" /> SHARE
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden p-4 bg-muted/10">
          <TabsContent value="chat" className="h-full m-0 data-[state=active]:flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ChatTab gameSessionId={gameSessionId} />
          </TabsContent>
          
          <TabsContent value="av" className="h-full m-0 data-[state=active]:flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AVTab />
          </TabsContent>
          
          <TabsContent value="share" className="h-full m-0 data-[state=active]:flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ShareTab gameSessionId={gameSessionId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default NICSocialPanel;
