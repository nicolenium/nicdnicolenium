
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Settings, Users, Play, BrainCircuit, AlertCircle, Globe, Clock, Shield } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { cn } from '@/lib/utils.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { getGamePoster } from '@/config/gamePosterConfig.js';
import { toast } from 'sonner';

export default function GameSetupLayout({ gameName, gameType, specificRules = [], onStart, hideOnline = false }) {
  const { currentUser } = useAuth();
  const posterUrl = getGamePoster(gameType);

  // State Management based on new requirements
  const [mode, setMode] = useState('human_vs_computer');
  const [difficulty, setDifficulty] = useState('medium');
  const [timeControl, setTimeControl] = useState('600');
  const [customTime, setCustomTime] = useState({ hours: '0', minutes: '10', seconds: '0' });
  const [privacy, setPrivacy] = useState('public');
  const [error, setError] = useState('');

  const handleCustomTimeChange = (field, value) => {
    setCustomTime(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleStartMatch = () => {
    let finalTimeControl = timeControl;
    
    // Custom Time Validation
    if (timeControl === 'custom') {
      const h = parseInt(customTime.hours) || 0;
      const m = parseInt(customTime.minutes) || 0;
      const s = parseInt(customTime.seconds) || 0;
      
      if (h < 0 || h > 23) { setError('Hours must be between 0 and 23.'); return; }
      if (m < 0 || m > 59) { setError('Minutes must be between 0 and 59.'); return; }
      if (s < 0 || s > 59) { setError('Seconds must be between 0 and 59.'); return; }
      
      const totalSeconds = (h * 3600) + (m * 60) + s;
      if (totalSeconds < 60) { setError('Custom time must be at least 1 minute (60 seconds).'); return; }
      if (totalSeconds > 86399) { setError('Custom time must be less than 24 hours.'); return; }
      
      finalTimeControl = totalSeconds;
    } else if (finalTimeControl !== 'unlimited') {
      finalTimeControl = parseInt(finalTimeControl, 10);
    }

    const payload = {
      match: {
        mode,
        difficulty,
        timeControl: finalTimeControl,
        increment: 0
      },
      players: {
        p1Name: currentUser?.username || 'Player 1',
        p2Name: mode === 'human_vs_computer' ? 'AI PRO' : 'Player 2'
      },
      preferences: {
        privacy,
        allowUndo: false,
        showHistory: true,
        allowHints: true,
        masterSound: true,
        moveSound: true,
        volume: 80,
      },
      customization: {
        showCoordinates: true,
        showHighlights: true,
        rules: specificRules.reduce((acc, rule) => ({ ...acc, [rule.id]: rule.default }), {})
      },
      gameType,
      finalTimeLimit: finalTimeControl === 'unlimited' ? 0 : finalTimeControl,
      timeLimit: finalTimeControl === 'unlimited' ? 0 : finalTimeControl
    };

    onStart(payload);
  };

  const gameModes = [
    {
      id: 'human_vs_computer',
      title: 'Play vs AI',
      desc: 'Challenge our advanced engine',
      icon: BrainCircuit
    },
    {
      id: 'human_vs_human',
      title: 'Local Match',
      desc: 'Play with a friend on this device',
      icon: Users
    },
    ...(!hideOnline ? [{
      id: 'online',
      title: 'Play Online',
      desc: 'Matchmake with players globally',
      icon: Globe
    }] : [])
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Helmet><title>{gameName} Setup | NICOLENIUM</title></Helmet>
      <Header />

      <main className="flex-1 container max-w-6xl mx-auto py-8 px-4">
        
        {/* Header Section */}
        <div className="w-full relative overflow-hidden rounded-2xl shadow-sm border border-slate-200 mb-8 bg-white">
          <div className="absolute inset-0 bg-slate-900">
            <img src={posterUrl} alt={gameName} className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
          </div>
          <div className="relative px-8 py-10 flex flex-col items-start bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
              {gameName} <span className="text-emerald-400 font-medium">Setup</span>
            </h1>
            <p className="text-slate-200 font-medium text-lg max-w-xl">
              Configure your match parameters and start playing.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
          
          {/* LEFT SIDE - GAME MODE SECTION */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-6">
              <MonitorPlay className="w-6 h-6 text-emerald-600" /> Game Mode
            </h2>
            
            <div className="space-y-4">
              {gameModes.map((gm) => (
                <button
                  key={gm.id}
                  onClick={() => setMode(gm.id)}
                  className={cn(
                    "w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center gap-5 group",
                    mode === gm.id 
                      ? "border-emerald-500 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-500/20" 
                      : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-lg transition-colors duration-200 shrink-0",
                    mode === gm.id ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500 group-hover:text-emerald-600 group-hover:bg-emerald-100"
                  )}>
                    <gm.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={cn("text-lg font-bold mb-1", mode === gm.id ? "text-emerald-900" : "text-slate-800")}>
                      {gm.title}
                    </h3>
                    <p className={cn("text-sm font-medium", mode === gm.id ? "text-emerald-700/80" : "text-slate-500")}>
                      {gm.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE - MATCH RULES SECTION */}
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Settings className="w-6 h-6 text-emerald-600" /> Match Rules
            </h2>
            
            <Card className="rounded-2xl border-slate-200 shadow-sm bg-white overflow-hidden h-full flex flex-col">
              <CardContent className="p-6 sm:p-8 space-y-8 flex-1 flex flex-col">
                
                {/* AI Difficulty Level (Conditional) */}
                {mode === 'human_vs_computer' && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4 text-emerald-600" /> AI Difficulty Level
                    </Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger className="w-full h-14 bg-slate-50 border-slate-200 rounded-xl font-semibold text-base focus:ring-emerald-500 focus:border-emerald-500">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy (Beginner)</SelectItem>
                        <SelectItem value="medium">Medium (Intermediate)</SelectItem>
                        <SelectItem value="hard">Hard (Advanced)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Time Control */}
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" /> Time Control
                  </Label>
                  <Select value={timeControl} onValueChange={(val) => { setTimeControl(val); setError(''); }}>
                    <SelectTrigger className="w-full h-14 bg-slate-50 border-slate-200 rounded-xl font-semibold text-base focus:ring-emerald-500 focus:border-emerald-500">
                      <SelectValue placeholder="Select time control" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unlimited">Casual (Unlimited)</SelectItem>
                      <SelectItem value="180">Blitz (3 min)</SelectItem>
                      <SelectItem value="600">Rapid (10 min)</SelectItem>
                      <SelectItem value="1800">Classical (30 min)</SelectItem>
                      <SelectItem value="custom">Custom Time</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Custom Time Inputs */}
                  {timeControl === 'custom' && (
                    <div className="pt-4 pb-2 animate-in fade-in slide-in-from-top-2">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hours</Label>
                          <Input 
                            type="number" 
                            min="0" 
                            max="23" 
                            value={customTime.hours} 
                            onChange={(e) => handleCustomTimeChange('hours', e.target.value)}
                            className="h-12 text-center font-mono font-bold text-lg bg-slate-50 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500"
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Minutes</Label>
                          <Input 
                            type="number" 
                            min="0" 
                            max="59" 
                            value={customTime.minutes} 
                            onChange={(e) => handleCustomTimeChange('minutes', e.target.value)}
                            className="h-12 text-center font-mono font-bold text-lg bg-slate-50 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500"
                            placeholder="10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Seconds</Label>
                          <Input 
                            type="number" 
                            min="0" 
                            max="59" 
                            value={customTime.seconds} 
                            onChange={(e) => handleCustomTimeChange('seconds', e.target.value)}
                            className="h-12 text-center font-mono font-bold text-lg bg-slate-50 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Privacy */}
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" /> Privacy
                  </Label>
                  <Select value={privacy} onValueChange={setPrivacy}>
                    <SelectTrigger className="w-full h-14 bg-slate-50 border-slate-200 rounded-xl font-semibold text-base focus:ring-emerald-500 focus:border-emerald-500">
                      <SelectValue placeholder="Select privacy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public (Visible in Live Games)</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Spacer to push button to bottom */}
                <div className="flex-1 min-h-[2rem]"></div>

                {/* Start Match Button */}
                <div className="flex justify-end pt-6 border-t border-slate-100">
                  <Button 
                    onClick={handleStartMatch} 
                    className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3"
                  >
                    Start Match <Play className="w-5 h-5 fill-current" />
                  </Button>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function MonitorPlay(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <path d="M12 17v4" />
      <path d="M8 21h8" />
      <path d="m10 8 5 3-5 3v-6z" />
    </svg>
  );
}
