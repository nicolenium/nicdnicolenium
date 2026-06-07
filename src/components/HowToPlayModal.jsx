
import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Info, Trophy, Target, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { tutorials } from '@/utils/tutorials.js';

const HowToPlayModal = ({ gameName, onClose }) => {
  const [step, setStep] = useState(0);
  
  // Clean up gameName string (e.g. "knowledge-quizzes" -> "knowledge_quizzes")
  const normalizedGameName = gameName ? gameName.replace(/-/g, '_') : 'trivia_master';
  
  // Fallback to trivia_master if the specific game guide isn't found
  const data = tutorials[normalizedGameName] || tutorials['trivia_master']; 
  
  const steps = [
    { title: "Objective", icon: Target, content: data.objective },
    { title: "Rules", icon: Info, content: data.rules },
    { title: "How to Win", icon: Trophy, content: data.winCondition },
    { title: "Tips & Strategy", icon: Lightbulb, content: data.tips },
    { title: "Example", icon: ChevronRight, content: data.example }
  ];

  const handleNext = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const handlePrev = () => setStep(s => Math.max(s - 1, 0));

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-2xl border-2 border-primary/30 shadow-[0_0_40px_rgba(34,211,238,0.15)] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <h2 className="text-xl font-black text-foreground tracking-tight">How to Play: {data.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 md:p-8 flex-1 min-h-[300px] flex flex-col items-center justify-center text-center space-y-6 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-background to-muted/20">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-2 shadow-inner border border-primary/20">
            <Icon className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-3xl font-black text-foreground tracking-tight">{currentStep.title}</h3>
          
          <div className="text-muted-foreground text-lg max-w-sm font-medium">
            {Array.isArray(currentStep.content) ? (
              <ul className="text-left list-disc list-inside space-y-3">
                {currentStep.content.map((item, i) => <li key={i} className="leading-snug">{item}</li>)}
              </ul>
            ) : (
              <p className="leading-relaxed">{currentStep.content}</p>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-border bg-muted/10 flex items-center justify-between">
          <Button variant="outline" onClick={handlePrev} disabled={step === 0} className="font-bold">
            <ChevronLeft className="w-4 h-4 mr-1" /> Prev
          </Button>
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step === i ? 'bg-primary scale-125' : 'bg-border'}`} />
            ))}
          </div>
          <Button variant={step === steps.length - 1 ? "default" : "outline"} onClick={step === steps.length - 1 ? onClose : handleNext} className="font-bold shadow-sm">
            {step === steps.length - 1 ? "Got it!" : "Next"} {step !== steps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HowToPlayModal;
