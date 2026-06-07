
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { BookOpen, DollarSign, Clock, Download, Save, Loader2, AlertCircle } from 'lucide-react';
import { useGamePresets } from '@/hooks/useGamePresets.js';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';

export default function GamePresetModal({ isOpen, onClose, game, onSaveSuccess }) {
  const { updateGamePreset, loadPresetRules } = useGamePresets();
  
  const [selectedPreset, setSelectedPreset] = useState('Standard Rules');
  const [entryFee, setEntryFee] = useState('');
  const [prizeAmount, setPrizeAmount] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [rules, setRules] = useState(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingRules, setIsLoadingRules] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && game) {
      setSelectedPreset(game.selectedPreset || 'Standard Rules');
      setEntryFee(game.entryFee !== null ? String(game.entryFee) : '');
      setPrizeAmount(game.prizeAmount !== null ? String(game.prizeAmount) : '');
      setTimeLimit(game.timeLimit || 'unlimited');
      
      if (game.rules) {
        setRules(game.rules);
      } else {
        // Auto-load standard rules initially if empty
        handleLoadRules(game.selectedPreset || 'Standard Rules');
      }
      setErrors({});
    }
  }, [isOpen, game]);

  const handleLoadRules = (presetName) => {
    if (!game) return;
    setIsLoadingRules(true);
    // Simulate slight network delay for UI feedback
    setTimeout(() => {
      const loadedRules = loadPresetRules(game.gameName, presetName);
      if (loadedRules) {
        setRules(loadedRules);
        toast.success(`Loaded ${presetName} rules successfully.`);
      } else {
        toast.error("Failed to load rules for selected preset.");
      }
      setIsLoadingRules(false);
    }, 300);
  };

  const validateForm = () => {
    const newErrors = {};
    if (entryFee && parseFloat(entryFee) < 0) {
      newErrors.entryFee = "Entry fee cannot be negative.";
    }
    if (prizeAmount && parseFloat(prizeAmount) < 0) {
      newErrors.prizeAmount = "Prize amount cannot be negative.";
    }
    if (!timeLimit) {
      newErrors.timeLimit = "Time limit is required.";
    }
    if (!rules) {
      newErrors.rules = "Please load preset rules before saving.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !game) return;

    setIsSaving(true);
    try {
      const config = {
        selectedPreset,
        entryFee: entryFee ? parseFloat(entryFee) : null,
        prizeAmount: prizeAmount ? parseFloat(prizeAmount) : null,
        timeLimit,
        rules
      };
      
      await updateGamePreset(game.id, config);
      toast.success(`${game.gameName} configuration saved successfully.`);
      onSaveSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to save configuration.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSaving && !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-card border-border">
        <DialogHeader className="px-6 py-4 border-b border-border/50 shrink-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            Configure Preset: <span className="text-primary">{game?.gameName}</span>
          </DialogTitle>
          <DialogDescription>
            Set default configuration, limits, and rule sets for tournaments and generic play.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6">
            
            {/* Top Config Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="preset" className="text-sm font-semibold">Active Preset Template</Label>
                  <div className="flex gap-2">
                    <Select value={selectedPreset} onValueChange={(val) => {
                      setSelectedPreset(val);
                      setErrors(prev => ({...prev, rules: undefined}));
                    }}>
                      <SelectTrigger id="preset" className="flex-1">
                        <SelectValue placeholder="Select a preset" />
                      </SelectTrigger>
                      <SelectContent>
                        {game?.availablePresets?.map((p, idx) => (
                          <SelectItem key={idx} value={p.presetName}>{p.presetName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="secondary" 
                      onClick={() => handleLoadRules(selectedPreset)}
                      disabled={isLoadingRules}
                    >
                      {isLoadingRules ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.rules && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.rules}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeLimit" className="text-sm font-semibold">Default Time Limit</Label>
                  <Select value={timeLimit} onValueChange={(val) => {
                    setTimeLimit(val);
                    setErrors(prev => ({...prev, timeLimit: undefined}));
                  }}>
                    <SelectTrigger id="timeLimit" className={errors.timeLimit ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select time limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unlimited">Unlimited (Casual)</SelectItem>
                      <SelectItem value="5 min">5 Minutes (Blitz)</SelectItem>
                      <SelectItem value="10 min">10 Minutes (Rapid)</SelectItem>
                      <SelectItem value="30 min">30 Minutes (Classical)</SelectItem>
                      <SelectItem value="1 hour">1 Hour</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.timeLimit && <p className="text-xs text-destructive">{errors.timeLimit}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="entryFee" className="text-sm font-semibold">Tournament Entry Fee ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="entryFee" 
                      type="number" 
                      step="0.01" 
                      min="0"
                      placeholder="0.00" 
                      className={`pl-9 ${errors.entryFee ? "border-destructive" : ""}`}
                      value={entryFee}
                      onChange={(e) => {
                        setEntryFee(e.target.value);
                        setErrors(prev => ({...prev, entryFee: undefined}));
                      }}
                    />
                  </div>
                  {errors.entryFee && <p className="text-xs text-destructive">{errors.entryFee}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prizeAmount" className="text-sm font-semibold">Default Prize Pool ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="prizeAmount" 
                      type="number" 
                      step="0.01" 
                      min="0"
                      placeholder="0.00" 
                      className={`pl-9 ${errors.prizeAmount ? "border-destructive" : ""}`}
                      value={prizeAmount}
                      onChange={(e) => {
                        setPrizeAmount(e.target.value);
                        setErrors(prev => ({...prev, prizeAmount: undefined}));
                      }}
                    />
                  </div>
                  {errors.prizeAmount && <p className="text-xs text-destructive">{errors.prizeAmount}</p>}
                </div>
              </div>
            </div>

            {/* Read-Only Rules Display */}
            <div className="pt-4 border-t border-border/50">
              <Label className="text-sm font-semibold flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-primary" /> Active Rules Configuration
              </Label>
              <div className="bg-muted/50 rounded-xl p-4 border border-border">
                {rules ? (
                  <div className="space-y-4 text-sm text-foreground">
                    <div>
                      <span className="font-bold text-primary">Description:</span>
                      <p className="mt-1 opacity-90">{rules.description}</p>
                    </div>
                    <div>
                      <span className="font-bold text-primary">Core Mechanics:</span>
                      <p className="mt-1 opacity-90">{rules.mechanics}</p>
                    </div>
                    <div>
                      <span className="font-bold text-primary">Winning Conditions:</span>
                      <p className="mt-1 opacity-90">{rules.winningConditions}</p>
                    </div>
                    <div>
                      <span className="font-bold text-primary">Special Rules:</span>
                      <p className="mt-1 opacity-90">{rules.specialRules}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                    <BookOpen className="w-8 h-8 mb-2 opacity-20" />
                    <p>No rules loaded. Please select and load a preset template.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t border-border/50 shrink-0 bg-background/50 flex items-center gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving || Object.keys(errors).length > 0} className="min-w-[120px]">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Preset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
