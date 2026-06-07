
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Button } from '@/components/ui/button.jsx';
import { AlertCircle, Clock, Play, ArrowLeft, Settings2 } from 'lucide-react';
import { useTimeControl } from '@/contexts/TimeControlContext.jsx';
import { useMovementSpeed } from '@/contexts/MovementSpeedContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const PreGameSettingsScreen = ({ gameTitle, mode, onStart, onBack }) => {
  const { timeSettings, updateTimeSettings } = useTimeControl();
  const { speed, setSpeed } = useMovementSpeed();

  // Local state for form
  const [timeControl, setTimeControl] = useState(timeSettings.timeControlType || 'rapid_10min');
  const [customHours, setCustomHours] = useState(timeSettings.customHours || '0');
  const [customMinutes, setCustomMinutes] = useState(timeSettings.customMinutes || '10');
  const [customSeconds, setCustomSeconds] = useState(timeSettings.customSeconds || '0');
  const [difficulty, setDifficulty] = useState('medium');
  const [movementSpeed, setMovementSpeed] = useState(speed || 'normal');
  const [p1Name, setP1Name] = useState('Player 1');
  const [p2Name, setP2Name] = useState(mode === 'human_vs_ai' ? 'AI Bot' : 'Player 2');
  const [error, setError] = useState('');

  // Sync initial AI name based on difficulty change
  useEffect(() => {
    if (mode === 'human_vs_ai') {
      setP2Name(`${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} AI`);
    } else if (mode === 'ai_vs_ai') {
      setP1Name('AI Bot 1');
      setP2Name('AI Bot 2');
    }
  }, [difficulty, mode]);

  const validate = () => {
    if (timeControl === 'custom') {
      const h = parseInt(customHours) || 0;
      const m = parseInt(customMinutes) || 0;
      const s = parseInt(customSeconds) || 0;
      if (h < 0 || h > 23) return "Hours must be between 0 and 23.";
      if (m < 0 || m > 59) return "Minutes must be between 0 and 59.";
      if (s < 0 || s > 59) return "Seconds must be between 0 and 59.";
      if (h === 0 && m === 0 && s === 0) return "Total time must be greater than 0.";
    }
    if (!p1Name.trim()) return "Player 1 name cannot be empty.";
    if (!p2Name.trim()) return "Player 2 name cannot be empty.";
    return null;
  };

  const handleStart = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const h = parseInt(customHours) || 0;
    const m = parseInt(customMinutes) || 0;
    const s = parseInt(customSeconds) || 0;

    // Save globally
    updateTimeSettings({ timeControlType: timeControl, customHours: h, customMinutes: m, customSeconds: s });
    setSpeed(movementSpeed);

    // Pass settings back to parent
    onStart({
      mode,
      difficulty,
      timeControl,
      customHours: h,
      customMinutes: m,
      customSeconds: s,
      movementSpeed,
      p1Name,
      p2Name
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="w-full max-w-2xl mx-auto border-2 shadow-xl overflow-hidden rounded-3xl">
        <div className="h-2 w-full bg-gradient-to-r from-primary to-secondary" />
        <CardHeader className="bg-card px-8 pt-8 pb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full -ml-2 hover:bg-muted">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <CardTitle className="text-3xl font-black flex items-center gap-2">
                <Settings2 className="w-6 h-6 text-primary" /> {gameTitle} Settings
              </CardTitle>
              <CardDescription className="text-base mt-1 font-medium">Configure your match before starting</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8 bg-muted/10">
          {/* PLAYERS SECTION */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
              Match Setup
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{mode === 'ai_vs_ai' ? "White AI Name" : "Player 1 (White)"}</Label>
                <Input 
                  value={p1Name} 
                  onChange={(e) => { setP1Name(e.target.value); setError(''); }} 
                  className="h-12 rounded-xl bg-card font-bold border-2"
                />
              </div>
              <div className="space-y-2">
                <Label>{mode === 'human_vs_human' ? "Player 2 (Black)" : "Opponent (Black)"}</Label>
                <Input 
                  value={p2Name} 
                  onChange={(e) => { setP2Name(e.target.value); setError(''); }} 
                  disabled={mode !== 'human_vs_human'}
                  className="h-12 rounded-xl bg-card font-bold border-2"
                />
              </div>
            </div>

            {mode !== 'human_vs_human' && (
              <div className="space-y-2 pt-2">
                <Label>AI Difficulty Level</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="h-12 rounded-xl bg-card font-bold border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy (Beginner)</SelectItem>
                    <SelectItem value="medium">Medium (Standard)</SelectItem>
                    <SelectItem value="hard">Hard (Advanced)</SelectItem>
                    <SelectItem value="impossible">Expert (Master)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* TIME & SPEED SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border/50">
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4" /> Time Control
              </h3>
              <Select value={timeControl} onValueChange={(val) => { setTimeControl(val); setError(''); }}>
                <SelectTrigger className="h-12 rounded-xl bg-card font-bold border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_limit">No Limit (∞)</SelectItem>
                  <SelectItem value="rapid_10min">Rapid (10 minutes)</SelectItem>
                  <SelectItem value="blitz_5min">Blitz (5 minutes)</SelectItem>
                  <SelectItem value="bullet_3min">Bullet (3 minutes)</SelectItem>
                  <SelectItem value="bullet_1min">Bullet (1 minute)</SelectItem>
                  <SelectItem value="custom">Custom Format...</SelectItem>
                </SelectContent>
              </Select>

              <AnimatePresence>
                {timeControl === 'custom' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-3 gap-2 pt-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Hours</Label>
                      <Input 
                        type="number" min="0" max="23" 
                        value={customHours} onChange={(e) => { setCustomHours(e.target.value); setError(''); }}
                        className="h-10 text-center font-mono font-bold bg-card border-2 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Minutes</Label>
                      <Input 
                        type="number" min="0" max="59" 
                        value={customMinutes} onChange={(e) => { setCustomMinutes(e.target.value); setError(''); }}
                        className="h-10 text-center font-mono font-bold bg-card border-2 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Seconds</Label>
                      <Input 
                        type="number" min="0" max="59" 
                        value={customSeconds} onChange={(e) => { setCustomSeconds(e.target.value); setError(''); }}
                        className="h-10 text-center font-mono font-bold bg-card border-2 rounded-lg"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                Gameplay Settings
              </h3>
              <div className="space-y-2">
                <Label>Animation Speed</Label>
                <Select value={movementSpeed} onValueChange={setMovementSpeed}>
                  <SelectTrigger className="h-12 rounded-xl bg-card font-bold border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow (Relaxed)</SelectItem>
                    <SelectItem value="normal">Standard</SelectItem>
                    <SelectItem value="fast">Fast (Snappy)</SelectItem>
                    <SelectItem value="instant">Instant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm font-bold text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20 animate-in shake">
              <AlertCircle className="w-5 h-5" /> {error}
            </div>
          )}

          <div className="pt-6 border-t border-border/50">
            <Button onClick={handleStart} className="w-full h-16 rounded-xl text-xl font-black tracking-wide shadow-glow-primary hover:scale-[1.02] transition-transform">
              <Play className="w-6 h-6 mr-2 fill-current" /> START MATCH
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PreGameSettingsScreen;
