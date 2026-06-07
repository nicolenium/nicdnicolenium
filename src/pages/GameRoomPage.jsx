
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Users, Plus, LogIn, Gamepad2, Clock, ShieldCheck, Search } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import CommunityLivePanel from '@/components/CommunityLivePanel.jsx';

const GAME_TYPES = [
  { id: 'checkers', name: 'Checkers' },
  { id: 'chess', name: 'Chess' },
  { id: 'ludo', name: 'Ludo' },
  { id: 'connect_four', name: 'Connect Four' },
  { id: 'trivia', name: 'Trivia' },
  { id: 'math', name: 'Math Games' },
  { id: 'quiz', name: 'Quiz Games' },
  { id: 'tiktok', name: 'TikTok Game' },
  { id: 'language_learning', name: 'Language Learning' },
  { id: 'pronunciation', name: 'Pronunciation' }
];

const GameRoomPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create Room State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRoomGameType, setNewRoomGameType] = useState('checkers');
  const [newRoomMode, setNewRoomMode] = useState('online_multiplayer');
  const [newRoomTime, setNewRoomTime] = useState('rapid');
  const [newRoomDifficulty, setNewRoomDifficulty] = useState('medium');

  // Join Room State
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [joinCode, setJoinCode] = useState(searchParams.get('code') || '');

  useEffect(() => {
    if (joinCode && currentUser) {
      setIsJoinOpen(true);
    }
  }, [joinCode, currentUser]);

  useEffect(() => {
    fetchRooms();
    
    // Subscribe to real-time room updates
    pb.collection('game_rooms').subscribe('*', function (e) {
      fetchRooms();
    });

    return () => {
      pb.collection('game_rooms').unsubscribe('*');
    };
  }, []);

  const fetchRooms = async () => {
    try {
      const records = await pb.collection('game_rooms').getList(1, 50, {
        filter: 'status = "waiting"',
        sort: '-created',
        $autoCancel: false
      });
      setRooms(records.items);
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!currentUser) {
      toast.error('Please log in to create a room.');
      return;
    }

    try {
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const record = await pb.collection('game_rooms').create({
        room_code: roomCode,
        game_type: newRoomGameType,
        game_mode: newRoomMode,
        host_id: currentUser.id,
        player1_id: currentUser.id,
        status: 'waiting',
        time_control: newRoomTime,
        difficulty: newRoomDifficulty
      }, { $autoCancel: false });

      toast.success(`Room created! Code: ${roomCode}`);
      setIsCreateOpen(false);
      
      // Navigate to the specific game setup or waiting area
      navigate(`/games/${newRoomGameType}/setup?room=${record.id}&code=${roomCode}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create room.');
    }
  };

  const handleJoinRoom = async (codeToJoin) => {
    if (!currentUser) {
      toast.error('Please log in to join a room.');
      return;
    }

    const code = codeToJoin || joinCode;
    if (!code) return;

    try {
      // Find room
      const room = await pb.collection('game_rooms').getFirstListItem(`room_code="${code}"`, { $autoCancel: false });
      
      if (room.status !== 'waiting') {
        toast.error('This room is no longer available.');
        return;
      }

      if (room.player1_id === currentUser.id) {
        // Rejoining own room
        navigate(`/games/${room.game_type}/setup?room=${room.id}&code=${room.room_code}`);
        return;
      }

      // Join room
      await pb.collection('game_rooms').update(room.id, {
        player2_id: currentUser.id,
        status: 'in_progress'
      }, { $autoCancel: false });

      toast.success('Joined room successfully!');
      setIsJoinOpen(false);
      navigate(`/games/${room.game_type}/play?room=${room.id}`);

    } catch (err) {
      console.error(err);
      toast.error('Invalid room code or room is full.');
    }
  };

  return (
    <div className="flex-1 flex w-full bg-background relative overflow-hidden">
      <Helmet><title>Game Rooms | NICD Games</title></Helmet>
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-12 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Game Rooms</h1>
            <p className="text-muted-foreground text-lg">Join an active lobby or create your own.</p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <Dialog open={isJoinOpen} onOpenChange={setIsJoinOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="flex-1 md:flex-none h-14 px-8 rounded-xl border-primary/50 text-primary hover:bg-primary/10">
                  <LogIn className="w-5 h-5 mr-2" /> Join via Code
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Join Game Room</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Room Code</Label>
                    <Input 
                      placeholder="Enter 6-character code" 
                      value={joinCode} 
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      className="text-center text-2xl tracking-widest uppercase h-14 bg-background text-foreground"
                      maxLength={6}
                    />
                  </div>
                  <Button className="w-full h-12 text-lg" onClick={() => handleJoinRoom()}>Join Room</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="flex-1 md:flex-none h-14 px-8 rounded-xl bg-primary text-primary-foreground shadow-glow-gold">
                  <Plus className="w-5 h-5 mr-2" /> Create Room
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Game Room</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Game Type</Label>
                    <Select value={newRoomGameType} onValueChange={setNewRoomGameType}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GAME_TYPES.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Game Mode</Label>
                    <Select value={newRoomMode} onValueChange={setNewRoomMode}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online_multiplayer">Online Multiplayer</SelectItem>
                        <SelectItem value="2_players">Local 2 Players</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Time Control</Label>
                      <Select value={newRoomTime} onValueChange={setNewRoomTime}>
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blitz">Blitz</SelectItem>
                          <SelectItem value="rapid">Rapid</SelectItem>
                          <SelectItem value="classical">Classical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Difficulty</Label>
                      <Select value={newRoomDifficulty} onValueChange={setNewRoomDifficulty}>
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full h-12 text-lg mt-4" onClick={handleCreateRoom}>Create & Enter Lobby</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <Search className="w-10 h-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-medium">Searching for active rooms...</p>
            </div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-24 bg-card/50 border rounded-3xl">
            <Gamepad2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No active rooms found</h3>
            <p className="text-muted-foreground mb-6">Be the first to create a room and invite others!</p>
            <Button onClick={() => setIsCreateOpen(true)}>Create Room</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map(room => {
              const gameName = GAME_TYPES.find(g => g.id === room.game_type)?.name || room.game_type;
              return (
                <Card key={room.id} className="card-premium overflow-hidden group hover:border-primary/50 transition-colors">
                  <CardHeader className="bg-muted/30 border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                          {gameName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Host: {room.host_id.substring(0, 8)}...
                        </p>
                      </div>
                      <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                        {room.status}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6 text-sm font-medium">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" /> 1 / 2 Players
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" /> {room.time_control}
                      </div>
                    </div>
                    <Button 
                      className="w-full h-12 font-bold" 
                      onClick={() => handleJoinRoom(room.room_code)}
                    >
                      Join Room
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      
      {/* Community Live Panel on the right side for desktop */}
      <div className="hidden xl:block w-80 shrink-0 border-l border-border bg-card/30 relative">
        <CommunityLivePanel />
      </div>
    </div>
  );
};

export default GameRoomPage;
