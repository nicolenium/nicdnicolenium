
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Video, Mic, MicOff, Share2, Send, Users, Radio } from 'lucide-react';
import { generateShareLink, getSocialShareUrl } from '@/utils/NICSocialIntegration.js';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

export const VideoCallButton = () => {
  const [active, setActive] = useState(false);
  return (
    <Button 
      variant={active ? "default" : "outline"} 
      className={`w-full justify-start gap-2 ${active ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
      onClick={() => setActive(!active)}
    >
      <Video className="w-4 h-4" /> {active ? 'End Video Call' : 'Start Video Call'}
    </Button>
  );
};

export const VoiceChatButton = () => {
  const [active, setActive] = useState(false);
  return (
    <Button 
      variant={active ? "default" : "outline"} 
      className={`w-full justify-start gap-2 ${active ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
      onClick={() => setActive(!active)}
    >
      {active ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />} 
      {active ? 'Mute Microphone' : 'Join Voice Chat'}
    </Button>
  );
};

export const CommentSection = ({ comments, onPostComment }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onPostComment(text);
    setText('');
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 pr-4 mb-4 h-[300px]">
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No comments yet. Be the first!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={c.expand?.user_id?.profile_picture ? pb.files.getUrl(c.expand.user_id, c.expand.user_id.profile_picture) : ''} />
                  <AvatarFallback>{c.expand?.user_id?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-muted/50 rounded-lg p-3">
                  <p className="text-xs font-bold text-primary mb-1">{c.expand?.user_id?.username || 'Unknown User'}</p>
                  <p className="text-sm text-foreground">{c.comment_text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex gap-2 mt-auto">
        <Input 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="Type a comment..." 
          className="flex-1"
        />
        <Button type="submit" size="icon" className="shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export const ShareButton = ({ gameId, onShare }) => {
  const link = generateShareLink(gameId);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  const handleSocialShare = (platform) => {
    const url = getSocialShareUrl(platform, link);
    window.open(url, '_blank');
    if (onShare) onShare(platform, link);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={link} readOnly className="bg-muted" />
        <Button onClick={handleCopy} variant="secondary">Copy</Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" onClick={() => handleSocialShare('twitter')}>Twitter</Button>
        <Button variant="outline" onClick={() => handleSocialShare('facebook')}>Facebook</Button>
        <Button variant="outline" onClick={() => handleSocialShare('linkedin')}>LinkedIn</Button>
      </div>
    </div>
  );
};

export const LiveStreamIndicator = ({ viewerCount }) => {
  return (
    <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-lg p-3">
      <div className="flex items-center gap-2 text-red-500 font-bold">
        <Radio className="w-5 h-5 animate-pulse" />
        LIVE
      </div>
      <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
        <Users className="w-4 h-4" />
        {viewerCount} watching
      </div>
    </div>
  );
};
