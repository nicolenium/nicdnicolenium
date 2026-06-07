
import React from 'react';
import { Button } from '@/components/ui/button';

const DifficultySelector = ({ selectedDifficulty, onSelect }) => {
  const difficulties = [
    { id: 'easy', label: 'Easy' },
    { id: 'medium', label: 'Medium' },
    { id: 'hard', label: 'Hard' },
    { id: 'impossible', label: 'Impossible' }
  ];

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-widest">AI Difficulty</h2>
      <div className="flex flex-wrap gap-3">
        {difficulties.map(diff => (
          <Button
            key={diff.id}
            variant={selectedDifficulty === diff.id ? 'default' : 'outline'}
            onClick={() => onSelect(diff.id)}
            className={`flex-1 min-w-[120px] font-bold text-md py-6 transition-all duration-300 ${
              selectedDifficulty === diff.id 
                ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]' 
                : 'bg-card text-foreground hover:bg-secondary hover:border-primary/50'
            }`}
          >
            {diff.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
