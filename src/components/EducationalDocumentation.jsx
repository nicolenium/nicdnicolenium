
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.jsx';
import { BookOpen, Code, Globe, BrainCircuit, FileText } from 'lucide-react';

const DOCS = [
  {
    id: 'language',
    title: 'Language Learning Guides',
    icon: Globe,
    sections: [
      { title: 'Vocabulary Mastery', content: 'Learn how to use spaced repetition to memorize 100+ new words daily. Focus on high-frequency words first.' },
      { title: 'Grammar Fundamentals', content: 'Understand sentence structure, verb conjugations, and noun genders across 20+ supported languages.' },
      { title: 'Pronunciation Guide', content: 'Use our AudioPlayer to listen to native speakers. Record your voice and compare waveforms to improve accent.' }
    ]
  },
  {
    id: 'coding',
    title: 'Coding Challenge Documentation',
    icon: Code,
    sections: [
      { title: 'Algorithm Strategies', content: 'Master Big O notation, sorting algorithms, and dynamic programming techniques to solve complex challenges.' },
      { title: 'Data Structures', content: 'Comprehensive guides on Arrays, Linked Lists, Trees, Graphs, and Hash Maps with implementation examples.' },
      { title: 'Debugging Best Practices', content: 'Learn how to read stack traces, use breakpoints, and write effective unit tests for your solutions.' }
    ]
  },
  {
    id: 'trivia',
    title: 'Trivia & Quiz Master Guides',
    icon: BrainCircuit,
    sections: [
      { title: 'Category Deep Dives', content: 'Explore study materials for History, Geography, Science, and Literature to prepare for high-difficulty quizzes.' },
      { title: 'Speed Quiz Tactics', content: 'Improve your reaction time. Learn how to quickly eliminate wrong answers to maximize your score in timed modes.' },
      { title: 'Scoring System Explained', content: 'Understand how combo multipliers, time bonuses, and difficulty modifiers affect your final leaderboard ranking.' }
    ]
  }
];

export default function EducationalDocumentation() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-card border-2 border-border rounded-3xl p-6 md:p-10 shadow-sm">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border/50">
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
          <BookOpen className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">Comprehensive Documentation</h2>
          <p className="text-muted-foreground font-medium mt-1">Official guides and study materials for all educational games.</p>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {DOCS.map((doc) => (
          <AccordionItem key={doc.id} value={doc.id} className="border-2 border-border rounded-2xl px-2 bg-background overflow-hidden">
            <AccordionTrigger className="hover:no-underline py-4 px-4">
              <div className="flex items-center gap-3 text-lg font-bold">
                <doc.icon className="w-5 h-5 text-primary" />
                {doc.title}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doc.sections.map((sec, i) => (
                  <div key={i} className="bg-muted/30 p-4 rounded-xl border border-border/50">
                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" /> {sec.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{sec.content}</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
