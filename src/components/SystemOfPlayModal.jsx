
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';
import { Download, Save, Loader2, BookOpen, Scale, Trophy } from 'lucide-react';
import { useSystemOfPlay } from '@/hooks/useSystemOfPlay.js';
import { toast } from 'sonner';

export default function SystemOfPlayModal({ isOpen, onClose, game, onSaveSuccess }) {
  const { savePreset } = useSystemOfPlay();
  
  const [selectedVariant, setSelectedVariant] = useState('');
  const [rules, setRules] = useState('');
  const [regulations, setRegulations] = useState('');
  const [matchFormat, setMatchFormat] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && game) {
      // Init from DB or fallback to first variant
      setSelectedVariant(game.selectedVariant || game.variants[0]?.variantName || '');
      setRules(game.rules || '');
      setRegulations(game.regulations || '');
      setMatchFormat(game.matchFormat || '');
    }
  }, [isOpen, game]);

  const handleLoadSystem = () => {
    if (!game) return;
    const variantData = game.variants.find(v => v.variantName === selectedVariant);
    
    if (variantData) {
      setRules(variantData.rules);
      setRegulations(variantData.regulations);
      setMatchFormat(variantData.matchFormat);
      toast.success(`Loaded "${selectedVariant}" system profile.`);
    } else {
      toast.error("Variant data not found.");
    }
  };

  const handleSave = async () => {
    if (!game) return;

    if (!rules || !regulations || !matchFormat) {
      toast.error("Please load a system of play before saving.");
      return;
    }

    setIsSaving(true);
    try {
      await savePreset(game.gameName, {
        selectedVariant,
        rules,
        regulations,
        matchFormat
      });
      toast.success(`${game.gameName} system of play updated successfully.`);
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to save system of play. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!game) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSaving && !open && onClose()}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-card border-border">
        
        <DialogHeader className="px-6 py-4 border-b border-border/50 shrink-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            System of Play: <span className="text-primary">{game.gameName}</span>
          </DialogTitle>
          <DialogDescription>
            Configure the governing rulesets, enforcement regulations, and standard match formats.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6">
            
            <div className="bg-muted/30 p-4 rounded-xl border border-border/50 space-y-4">
              <Label className="text-base font-bold text-foreground">Active Ruleset Variant</Label>
              <div className="flex gap-3">
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger className="flex-1 bg-background h-11 border-border/80">
                    <SelectValue placeholder="Select a variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {game.variants.map((v) => (
                      <SelectItem key={v.variantName} value={v.variantName}>
                        {v.variantName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleLoadSystem} 
                  variant="secondary"
                  className="h-11 font-bold px-6 shadow-sm border border-secondary/20 hover:border-secondary/50 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" /> Load System of Play
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Select a template and click 'Load' to pre-fill the configuration. You must load and save to apply changes.
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-bold text-sm text-primary">
                  <BookOpen className="w-4 h-4" /> Core Rules
                </Label>
                <Textarea 
                  readOnly 
                  value={rules} 
                  placeholder="Rules will appear here after loading a variant..."
                  className="bg-muted/40 cursor-default focus-visible:ring-0 resize-none min-h-[80px] border-border/60 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-bold text-sm text-accent">
                  <Scale className="w-4 h-4" /> Enforcement & Regulations
                </Label>
                <Textarea 
                  readOnly 
                  value={regulations} 
                  placeholder="Regulations will appear here after loading a variant..."
                  className="bg-muted/40 cursor-default focus-visible:ring-0 resize-none min-h-[80px] border-border/60 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-bold text-sm text-secondary">
                  <Trophy className="w-4 h-4" /> Match Format
                </Label>
                <Textarea 
                  readOnly 
                  value={matchFormat} 
                  placeholder="Match formats will appear here after loading a variant..."
                  className="bg-muted/40 cursor-default focus-visible:ring-0 resize-none min-h-[80px] border-border/60 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t border-border/50 shrink-0 bg-background/50 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isSaving} className="font-medium">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !rules} 
            className="min-w-[140px] font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save System
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
