
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Settings, Play, Users, Globe2, Bot, ArrowLeft } from 'lucide-react';

const GAME_ROUTES = {
  'checkers-10x10': '/checkers-10x10',
  'checkers-8x8': '/checkers-8x8',
  'chess': '/chess',
  'ludo': '/ludo',
  'connect-four': '/connect-four',
  'tic-tac-toe': '/tic-tac-toe',
  'trivia': '/trivia',
  'math-games': '/math-games',
  'quiz-games': '/quiz-games',
  'language-learning': '/language-learning',
  'pronunciation': '/pronunciation',
  'tiktok': '/tiktok'
};

const GAME_NAMES = {
  'checkers-10x10': 'Pro Checkers 10x10',
  'checkers-8x8': 'Classic Checkers 8x8',
  'chess': 'Grandmaster Chess',
  'ludo': 'Classic Ludo',
  'connect-four': 'Connect Four',
  'tic-tac-toe': 'Tic Tac Toe',
  'trivia': 'Trivia Master',
  'math-games': 'Math Challenge',
  'quiz-games': 'Speed Quizzes',
  'language-learning': 'Language Learning',
  'pronunciation': 'Pronunciation Master',
  'tiktok': 'NICD Shorts'
};

export default function UnifiedGameSetupPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  
  const [mode, setMode] = useState('human_vs_ai');
  const [difficulty, setDifficulty] = useState('medium');
  const [timeControl, setTimeControl] = useState('rapid_10min');
  const [customMinutes, setCustomMinutes] = useState('10');
  const [customIncrement, setCustomIncrement] = useState('0');
  const [privacy, setPrivacy] = useState('public');
  const [agreeRules, setAgreeRules] = useState(false);

  const gameName = GAME_NAMES[gameId] || 'Game';
  const targetRoute = GAME_ROUTES[gameId] || '/games';

  const isNonBoardGame = ['trivia', 'math-games', 'quiz-games', 'language-learning', 'pronunciation', 'tiktok'].includes(gameId);

  const handleStart = () => {
    if (!agreeRules) return;
    
    const settings = {
      mode,
      difficulty,
      timeControl,
      customMinutes: timeControl === 'custom' ? parseInt(customMinutes) : null,
      customIncrement: timeControl === 'custom' ? parseInt(customIncrement) : null,
      privacy,
      p1Name: 'Player 1',
      p2Name: mode === 'human_vs_ai' ? 'AI Bot' : 'Player 2'
    };

    navigate(targetRoute, { state: { settings } });
  };

  return (
    <div className="min-h-screen py-12 flex items-center justify-center bg-background">
      <Helmet><title>Setup {gameName} | NICD PRODUCTIONS</title></Helmet>
      
      <div className="container max-w-2xl mx-auto px-4">
        <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-white/10 shadow-2xl bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/50 border-b border-white/5 pb-8 pt-10 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-black">{gameName} Setup</CardTitle>
              <p className="text-muted-foreground mt-2">Configure your match settings before playing.</p>
            </CardHeader>
            
            <CardContent className="p-8 space-y-8">
              {!isNonBoardGame && (
                <>
                  <div className="space-y-3">
                    <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Game Mode</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Button variant={mode === 'human_vs_ai' ? 'default' : 'outline'} className={mode === 'human_vs_ai' ? 'bg-primary text-primary-foreground' : 'border-white/10'} onClick={() => setMode('human_vs_ai')}><Bot className="w-4 h-4 mr-2" /> Vs AI</Button>
                      <Button variant={mode === 'human_vs_human' ? 'default' : 'outline'} className={mode === 'human_vs_human' ? 'bg-primary text-primary-foreground' : 'border-white/10'} onClick={() => setMode('human_vs_human')}><Users className="w-4 h-4 mr-2" /> Local</Button>
                      <Button variant={mode === 'online_multiplayer' ? 'default' : 'outline'} className={mode === 'online_multiplayer' ? 'bg-primary text-primary-foreground' : 'border-white/10'} onClick={() => setMode('online_multiplayer')}><Globe2 className="w-4 h-4 mr-2" /> Online</Button>
                    </div>
                  </div>

                  {mode === 'human_vs_ai' && (
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">AI Difficulty</Label>
                      <Select value={difficulty} onValueChange={setDifficulty}>
                        <SelectTrigger className="h-12 bg-background border-white/10 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Time Control</Label>
                    <Select value={timeControl} onValueChange={setTimeControl}>
                      <SelectTrigger className="h-12 bg-background border-white/10 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bullet_3min">Blitz (3 min)</SelectItem>
                        <SelectItem value="rapid_10min">Rapid (10 min)</SelectItem>
                        <SelectItem value="classical_30min">Classical (30 min)</SelectItem>
                        <SelectItem value="no_limit">Casual (Unlimited)</SelectItem>
                        <SelectItem value="custom">Custom Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {timeControl === 'custom' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl border border-white/5">
                      <div className="space-y-2">
                        <Label className="text-xs">Minutes per player</Label>
                        <Input type="number" min="1" max="180" value={customMinutes} onChange={(e) => setCustomMinutes(e.target.value)} className="bg-background border-white/10" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Increment (seconds)</Label>
                        <Input type="number" min="0" max="60" value={customIncrement} onChange={(e) => setCustomIncrement(e.target.value)} className="bg-background border-white/10" />
                      </div>
                    </motion.div>
                  )}

                  {mode === 'online_multiplayer' && (
                    <div className="space-y-3">
                      <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Privacy</Label>
                      <Select value={privacy} onValueChange={setPrivacy}>
                        <SelectTrigger className="h-12 bg-background border-white/10 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public Matchmaking</SelectItem>
                          <SelectItem value="private">Private (Invite Only)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center space-x-3 bg-muted/30 p-4 rounded-xl border border-white/5">
                <Checkbox id="rules" checked={agreeRules} onCheckedChange={setAgreeRules} className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                <Label htmlFor="rules" className="text-sm leading-snug cursor-pointer">
                  I agree to the <a href="/rules" target="_blank" className="text-primary hover:underline">Game Rules</a> and Fair Play Policy.
                </Label>
              </div>

              <Button 
                className="w-full h-14 text-lg font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all" 
                disabled={!agreeRules}
                onClick={handleStart}
              >
                <Play className="w-5 h-5 mr-2 fill-current" /> Start Match
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
