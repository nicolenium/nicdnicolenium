
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';
import { X, Activity, Download, Search, AlertCircle, Settings2, MessageSquare, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { cn } from '@/lib/utils.js';
import { ActivityLogManager } from '@/utils/ActivityLogManager.js';
import { toast } from 'sonner';

export default function ActivityLogPanel({ logs = [], onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleExport = () => {
    if (logs.length === 0) {
      toast.error('No logs to export');
      return;
    }
    const jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(ActivityLogManager.exportToJSON(logs));
    const link = document.createElement("a");
    link.setAttribute("href", jsonContent);
    link.setAttribute("download", `activity_log_${new Date().getTime()}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("Activity log exported");
  };

  const filteredLogs = logs.filter(log => {
    if (!searchTerm) return true;
    return log.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
           log.type.toLowerCase().includes(searchTerm.toLowerCase());
  }).reverse(); // newest first

  const getLogIcon = (type) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'settings_change': return <Settings2 className="w-4 h-4 text-muted-foreground" />;
      case 'chat': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'game_start': return <Play className="w-4 h-4 text-emerald-500" />;
      case 'game_end': return <Square className="w-4 h-4 text-amber-500" />;
      case 'move': return <Activity className="w-4 h-4 text-primary" />;
      default: return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-card border-l border-border shadow-2xl flex flex-col z-40 animate-in slide-in-from-right">
      <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30 shrink-0">
        <h3 className="font-bold text-foreground flex items-center gap-2 tracking-tight">
          <Activity className="w-5 h-5 text-primary" /> System Logs
        </h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={handleExport} className="h-8 w-8 text-muted-foreground hover:text-primary" title="Export JSON">
            <Download className="w-4 h-4" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="p-3 border-b border-border bg-background shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search logs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 pl-8 text-xs bg-muted border-transparent focus:border-primary"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 scrollbar-primary">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground mt-20">
            <Activity className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm font-medium">No activity logged.</p>
          </div>
        ) : (
          <div className="flex flex-col w-full pb-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex gap-3 text-sm py-3 px-4 border-b border-border/50 hover:bg-muted/30 transition-colors">
                <div className="mt-0.5 shrink-0">
                  {getLogIcon(log.type)}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-foreground truncate">{log.player}</span>
                    <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 rounded shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-snug break-words">
                    {log.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
