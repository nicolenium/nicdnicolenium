
import React, { useState, useRef, useEffect } from 'react';
import { useGameChat } from '@/hooks/useGameChat.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Smile } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';

const ChatTab = ({ gameSessionId }) => {
  const { messages, loading, sendMessage } = useGameChat(gameSessionId);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isMe = currentUser?.id === msg.userId;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-muted-foreground mb-1 px-1">
                    {msg.username} • {new Date(msg.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className={`px-3 py-2 rounded-2xl max-w-[85%] text-sm ${
                    isMe 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-muted text-foreground rounded-tl-sm'
                  }`}>
                    {msg.messageText}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
      
      <div className="p-3 border-t border-border bg-muted/30">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
            <Smile className="w-5 h-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            maxLength={500}
            className="flex-1 bg-background border-border focus-visible:ring-primary"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()} className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatTab;
