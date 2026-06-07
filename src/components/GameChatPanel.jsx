
import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import pb from '@/lib/pocketbaseClient.js';

export default function GameChatPanel({ onClose, gameSessionId, currentUser }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  // Mock initial messages for AI/Community chat
  useEffect(() => {
    setMessages([
      { id: 1, sender: 'System', text: 'Welcome to the game chat! Be Good And Do Good.', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), isSystem: true },
      { id: 2, sender: 'AI Assistant', text: 'I am analyzing the game. Good luck!', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), isSystem: false, isAI: true }
    ]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      sender: currentUser?.username || 'Player',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      isSystem: false,
      isMe: true,
      avatar: currentUser?.avatar ? pb.files.getUrl(currentUser, currentUser.avatar) : null
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 sm:w-96 bg-card border-l border-border shadow-2xl flex flex-col z-40 animate-in slide-in-from-right">
      <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30 shrink-0">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" /> A/C Chat
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              {!msg.isSystem && (
                <Avatar className="w-8 h-8 shrink-0 border border-border">
                  {msg.avatar ? <AvatarImage src={msg.avatar} /> : <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{msg.isAI ? 'AI' : msg.sender.charAt(0).toUpperCase()}</AvatarFallback>}
                </Avatar>
              )}
              
              <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                {!msg.isSystem && (
                  <span className="text-[10px] font-bold text-muted-foreground mb-1 px-1">
                    {msg.sender} • {msg.time}
                  </span>
                )}
                
                <div className={`px-3 py-2 text-sm shadow-sm ${
                  msg.isSystem 
                    ? 'bg-muted/50 text-muted-foreground rounded-xl text-center w-full text-xs font-medium italic' 
                    : msg.isMe 
                      ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm' 
                      : msg.isAI
                        ? 'bg-secondary/10 text-secondary-foreground border border-secondary/20 rounded-2xl rounded-tl-sm'
                        : 'bg-muted text-foreground rounded-2xl rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSend} className="p-3 border-t border-border bg-muted/10 flex gap-2 shrink-0">
        <Input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type a message..." 
          className="flex-1 bg-background border-border rounded-full h-10 px-4"
        />
        <Button type="submit" size="icon" className="shrink-0 rounded-full h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-transform active:scale-95">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
