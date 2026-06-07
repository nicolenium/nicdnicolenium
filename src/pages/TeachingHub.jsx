
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GraduationCap, Brain, Target, Book, Lightbulb, Search, AreaChart, MessageSquare } from 'lucide-react';

const TeachingHub = () => {
  const modules = [
    { title: 'Interactive Lessons', desc: 'Step-by-step guides with board highlights', icon: Book, link: '/lessons/checkers/basics', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Puzzle Trainer', desc: 'Solve tactical positions to improve calculation', icon: Target, link: '/puzzles/checkers', color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Strategy & Tactics', desc: 'Master openings, middle-game, and endgames', icon: Brain, link: '/strategy/checkers', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Game Analysis', desc: 'Review past games with AI evaluation', icon: Search, link: '/game-analysis', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Grandmaster Games', desc: 'Study annotated games from world champions', icon: Lightbulb, link: '/grandmaster-games', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { title: 'Learning Dashboard', desc: 'Track your progress and ELO estimation', icon: AreaChart, link: '/learning-dashboard', color: 'text-red-500', bg: 'bg-red-500/10' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Teaching Hub - NICD</title></Helmet>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-black uppercase tracking-tight text-primary flex items-center justify-center gap-4">
              <GraduationCap className="w-12 h-12" /> Academy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Elevate your gameplay from beginner to master with our comprehensive suite of learning tools and AI analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((m, idx) => (
              <Link key={idx} to={m.link} className="block group">
                <Card className="h-full border-border hover:border-primary/50 hover:shadow-glow transition-all duration-300 bg-card">
                  <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                    <div className={`p-4 rounded-2xl ${m.bg} group-hover:scale-110 transition-transform`}>
                      <m.icon className={`w-10 h-10 ${m.color}`} />
                    </div>
                    <CardTitle className="text-xl">{m.title}</CardTitle>
                    <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="flex gap-4 justify-center pt-8">
            <Link to="/glossary" className="text-primary hover:underline font-medium flex items-center gap-2">Glossary</Link>
            <span className="text-border">•</span>
            <Link to="/resources" className="text-primary hover:underline font-medium flex items-center gap-2">Resources</Link>
            <span className="text-border">•</span>
            <Link to="/forum" className="text-primary hover:underline font-medium flex items-center gap-2"><MessageSquare className="w-4 h-4"/> Discussion Forum</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default TeachingHub;
