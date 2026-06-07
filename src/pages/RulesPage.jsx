
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { RulesEngine } from '@/utils/RulesEngine';
import { BookOpen, AlertCircle } from 'lucide-react';

const RulesPage = () => {
  const [activeGame, setActiveGame] = useState('checkers');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Rules & Regulations - NICD</title></Helmet>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-black uppercase tracking-tight text-primary flex items-center justify-center gap-3">
              <BookOpen className="w-10 h-10" /> Rules & Regulations
            </h1>
            <p className="text-muted-foreground mt-4 text-lg">Master the rules for all our supported games.</p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {Object.keys(RulesEngine).map(key => (
              <button
                key={key}
                onClick={() => setActiveGame(key)}
                className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${activeGame === key ? 'bg-primary text-primary-foreground shadow-glow' : 'bg-muted text-muted-foreground hover:bg-secondary/20'}`}
              >
                {RulesEngine[key].title}
              </button>
            ))}
          </div>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="text-2xl">{RulesEngine[activeGame].title} Guide</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {RulesEngine[activeGame].sections.map((sec, idx) => (
                  <AccordionItem key={sec.id} value={`item-${idx}`}>
                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">{sec.title}</AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                      {sec.content}
                      {sec.id === 'capturing' && activeGame === 'checkers' && (
                        <div className="mt-4 p-4 bg-secondary/10 border border-secondary/30 rounded-xl flex gap-3">
                          <AlertCircle className="w-5 h-5 text-secondary shrink-0" />
                          <p className="text-sm font-medium text-secondary-foreground">Majority Rule applies: if you have multiple capture paths, you MUST choose the path that captures the most pieces.</p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default RulesPage;
