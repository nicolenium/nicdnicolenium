
import React, { useState, useEffect, useRef } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SpectatorChat = ({ gameSessionId }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    pb.collection('game_chat').getList(1, 50, {
      filter: `gameSessionId="${gameSessionId}"`,
      sort: 'created',
      $autoCancel: false
    }).then(res => setMessages(res.items)).catch(() => {});

    pb.collection('game_chat').subscribe('*', (e) => {
      if (e.action === 'create' && e.record.gameSessionId === gameSessionId) {
        setMessages(prev => [...prev, e.record]);
      }
    });

    return () => { pb.collection('game_chat').unsubscribe('*'); };
  }, [gameSessionId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;
    
    try {
      await pb.collection('game_chat').create({
        gameSessionId,
        userId: currentUser.id,
        username: currentUser.username,
        messageText: newMessage.trim(),
        characterCount: newMessage.trim().length
      }, { $autoCancel: false });
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-muted/50 p-4 border-b border-border font-bold flex items-center gap-2">
        <MessageSquare className="w-5 h-5" /> Spectator Chat
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground mt-10">No messages yet. Say hello!</p>
        ) : (
          messages.map(m => (
            <div key={m.id} className="text-sm">
              <span className="font-bold text-primary mr-2">{m.username}:</span>
              <span className="text-foreground">{m.messageText}</span>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-border bg-muted/20">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input 
            value={newMessage} 
            onChange={e => setNewMessage(e.target.value)}
            placeholder={currentUser ? "Type a message..." : "Login to chat"}
            disabled={!currentUser}
            className="rounded-full bg-background"
          />
          <Button type="submit" size="icon" disabled={!currentUser || !newMessage.trim()} className="rounded-full shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SpectatorChat;
