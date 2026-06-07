
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils.js';

export default function TimeControlSelector({ value, onChange }) {
  const [mode, setMode] = useState('600');
  const [customTime, setCustomTime] = useState({ hours: '0', minutes: '15', seconds: '0' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (value === 'unlimited' || value === 0) {
      setMode('unlimited');
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        if ([60, 300, 600, 1800].includes(numValue)) {
          setMode(numValue.toString());
        } else {
          setMode('custom');
          // Only update customTime if it doesn't match the current total to avoid overwriting user input while typing
          const currentTotal = (parseInt(customTime.hours) || 0) * 3600 + (parseInt(customTime.minutes) || 0) * 60 + (parseInt(customTime.seconds) || 0);
          if (currentTotal !== numValue) {
            const h = Math.floor(numValue / 3600);
            const m = Math.floor((numValue % 3600) / 60);
            const s = numValue % 60;
            setCustomTime({ hours: h.toString(), minutes: m.toString(), seconds: s.toString() });
          }
        }
      }
    }
  }, [value]);

  const handleModeChange = (val) => {
    setMode(val);
    setError('');
    if (val === 'unlimited') {
      onChange('unlimited');
    } else if (val === 'custom') {
      const totalSeconds = (parseInt(customTime.hours) || 0) * 3600 + (parseInt(customTime.minutes) || 0) * 60 + (parseInt(customTime.seconds) || 0);
      if (totalSeconds >= 60 && totalSeconds <= 86399) {
        onChange(totalSeconds);
      } else {
        setCustomTime({ hours: '0', minutes: '15', seconds: '0' });
        onChange(900);
      }
    } else {
      onChange(parseInt(val, 10));
    }
  };

  const handleCustomChange = (field, val) => {
    const newCustomTime = { ...customTime, [field]: val };
    setCustomTime(newCustomTime);

    const h = parseInt(newCustomTime.hours === '' ? '0' : newCustomTime.hours, 10) || 0;
    const m = parseInt(newCustomTime.minutes === '' ? '0' : newCustomTime.minutes, 10) || 0;
    const s = parseInt(newCustomTime.seconds === '' ? '0' : newCustomTime.seconds, 10) || 0;

    if (h < 0 || h > 23) { setError('Hours must be 0-23'); return; }
    if (m < 0 || m > 59) { setError('Minutes must be 0-59'); return; }
    if (s < 0 || s > 59) { setError('Seconds must be 0-59'); return; }
    
    const totalSeconds = (h * 3600) + (m * 60) + s;
    
    if (totalSeconds < 60) { setError('Total time must be at least 1 minute'); return; }
    if (totalSeconds > 86399) { setError('Total time must be less than 24 hours'); return; }
    
    setError('');
    onChange(totalSeconds);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="space-y-3">
        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Clock className="w-4 h-4" /> Time Control
        </Label>
        <Select value={mode} onValueChange={handleModeChange}>
          <SelectTrigger className="w-full h-14 bg-background border-2 rounded-xl font-bold text-base">
            <SelectValue placeholder="Select time control" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="60">1 Minute (Bullet)</SelectItem>
            <SelectItem value="300">5 Minutes (Blitz)</SelectItem>
            <SelectItem value="600">10 Minutes (Rapid)</SelectItem>
            <SelectItem value="1800">30 Minutes (Classical)</SelectItem>
            <SelectItem value="custom">Custom Time</SelectItem>
            <SelectItem value="unlimited">Unlimited (Casual)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {mode === 'custom' && (
        <div className="p-5 bg-card/50 rounded-xl border border-border shadow-inner space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase flex justify-between">
                Hours <span className="text-primary/70 font-mono">(0-23)</span>
              </Label>
              <Input 
                type="number" min="0" max="23" 
                value={customTime.hours} onChange={(e) => handleCustomChange('hours', e.target.value)}
                className={cn("h-14 text-center font-mono font-bold text-xl bg-background border-2 rounded-xl focus:border-primary transition-colors", error && parseInt(customTime.hours)>23 ? 'border-destructive' : '')}
                placeholder="0"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase flex justify-between">
                Minutes <span className="text-primary/70 font-mono">(0-59)</span>
              </Label>
              <Input 
                type="number" min="0" max="59" 
                value={customTime.minutes} onChange={(e) => handleCustomChange('minutes', e.target.value)}
                className={cn("h-14 text-center font-mono font-bold text-xl bg-background border-2 rounded-xl focus:border-primary transition-colors", error && parseInt(customTime.minutes)>59 ? 'border-destructive' : '')}
                placeholder="15"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase flex justify-between">
                Seconds <span className="text-primary/70 font-mono">(0-59)</span>
              </Label>
              <Input 
                type="number" min="0" max="59" 
                value={customTime.seconds} onChange={(e) => handleCustomChange('seconds', e.target.value)}
                className={cn("h-14 text-center font-mono font-bold text-xl bg-background border-2 rounded-xl focus:border-primary transition-colors", error && parseInt(customTime.seconds)>59 ? 'border-destructive' : '')}
                placeholder="0"
              />
            </div>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-sm font-bold text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" /> {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
