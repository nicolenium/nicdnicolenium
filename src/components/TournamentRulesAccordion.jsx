
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.jsx';
import { Gavel, Clock, Users, Target, Scissors, Skull, Trophy } from 'lucide-react';

export default function TournamentRulesAccordion({ rules }) {
  if (!rules || Object.keys(rules).length === 0) {
    return <div className="text-muted-foreground italic bg-muted p-4 rounded-lg">No specific rules defined for this tournament.</div>;
  }

  const sections = [
    { key: 'gameRules', label: 'Game Rules', icon: Gavel },
    { key: 'timeControls', label: 'Time Controls', icon: Clock },
    { key: 'pairingsSystem', label: 'Pairings System', icon: Users },
    { key: 'scoringSystem', label: 'Scoring System', icon: Target },
    { key: 'tiebreakRules', label: 'Tiebreak Rules', icon: Scissors },
    { key: 'eliminationRules', label: 'Elimination Rules', icon: Skull },
    { key: 'prizeDistribution', label: 'Prize Distribution', icon: Trophy }
  ];

  return (
    <div className="w-full bg-[hsl(var(--tournament-accordion))] rounded-2xl border border-border shadow-sm p-2 md:p-4">
      <Accordion type="multiple" className="w-full" defaultValue={['gameRules']}>
        {sections.map(({ key, label, icon: Icon }) => {
          if (!rules[key]) return null;
          return (
            <AccordionItem value={key} key={key} className="border-border">
              <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-4 px-4 data-[state=open]:text-primary font-bold text-base md:text-lg">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-muted-foreground group-data-[state=open]:text-primary" />
                  {label}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                {rules[key]}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
