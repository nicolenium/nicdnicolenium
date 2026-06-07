
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { BookOpen, PlayCircle, FileText, Lightbulb, ArrowRight, ShieldCheck, Gamepad2, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import Breadcrumb from '@/components/Breadcrumb.jsx';

export default function HowToLearnPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>How to Learn | NICD NICOLENIUM</title></Helmet>
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />
        
        <div className="mb-16 mt-8">
          <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tight mb-6">
            Master the <span className="text-primary">Games</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl font-medium leading-relaxed">
            Welcome to the NICD Learning Hub. Whether you're making your first move in Chess or mastering the advanced strategies of Pro Checkers 10x10, you'll find everything you need to conquer the board.
          </p>
        </div>

        {/* Bento Grid Layout for Sections */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24">
          
          {/* Main Feature: Interactive Tutorials */}
          <Card className="md:col-span-8 bg-card border-border shadow-lg overflow-hidden group">
            <CardContent className="p-8 sm:p-12 h-full flex flex-col justify-center relative">
              <div className="absolute right-0 top-0 w-64 h-64 bg-primary/10 rounded-bl-full pointer-events-none blur-3xl transition-all duration-500 group-hover:bg-primary/20" />
              <PlayCircle className="w-12 h-12 text-primary mb-6" />
              <h2 className="text-3xl font-bold text-foreground mb-4">Interactive Game Tutorials</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-lg">
                Step-by-step interactive guides for each game. Learn the basic moves, capture mechanics, and winning conditions through hands-on practice.
              </p>
              <Button asChild className="w-fit h-14 px-8 text-lg font-bold rounded-full bg-primary text-primary-foreground">
                <Link to="/games">Start a Practice Game <ArrowRight className="w-5 h-5 ml-2" /></Link>
              </Button>
            </CardContent>
          </Card>

          {/* Secondary: Strategy Guides */}
          <Card className="md:col-span-4 bg-muted/40 border-border shadow-sm group hover:border-accent/50 transition-colors">
            <CardContent className="p-8 h-full flex flex-col justify-between">
              <div>
                <Lightbulb className="w-10 h-10 text-accent mb-6" />
                <h2 className="text-2xl font-bold text-foreground mb-3">Strategy Guides</h2>
                <p className="text-muted-foreground mb-6">
                  Elevate your gameplay from beginner to advanced. Read curated articles from top-ranked Grandmasters.
                </p>
              </div>
              <Button variant="outline" className="w-full font-bold group-hover:bg-accent group-hover:text-accent-foreground">
                Read Strategies
              </Button>
            </CardContent>
          </Card>

          {/* Tertiary: Official Rules */}
          <Card className="md:col-span-6 lg:col-span-4 bg-muted/40 border-border shadow-sm group hover:border-secondary/50 transition-colors">
            <CardContent className="p-8">
              <FileText className="w-10 h-10 text-secondary mb-6" />
              <h2 className="text-2xl font-bold text-foreground mb-3">Official Rules</h2>
              <p className="text-muted-foreground mb-6">
                Comprehensive rulebooks for standard and tournament play across all our supported board games.
              </p>
              <Button variant="link" asChild className="p-0 text-secondary font-bold hover:text-secondary/80">
                <Link to="/terms-and-conditions">View Rulebooks <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quizzes & Learning */}
          <Card className="md:col-span-6 lg:col-span-8 bg-card border-border shadow-lg relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-4 translate-y-4">
              <GraduationCap className="w-48 h-48" />
            </div>
            <CardContent className="p-8 sm:p-10 h-full flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-3">Educational Arcade</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Test your knowledge, improve your pronunciation, or challenge your math skills in our dedicated learning center.
                </p>
                <div className="flex flex-wrap gap-3">
                  <BadgeLink to="/math-challenge" icon={<Gamepad2 className="w-3 h-3 mr-1"/>}>Math Challenge</BadgeLink>
                  <BadgeLink to="/knowledge-quizzes" icon={<BookOpen className="w-3 h-3 mr-1"/>}>Knowledge Quizzes</BadgeLink>
                  <BadgeLink to="/languages-learning" icon={<ShieldCheck className="w-3 h-3 mr-1"/>}>Language Academy</BadgeLink>
                </div>
              </div>
            </CardContent>
          </Card>
          
        </div>

        {/* Popular Resources Section */}
        <section className="mb-20">
          <h3 className="text-3xl font-bold mb-8">Popular Resources</h3>
          <div className="space-y-4">
            <ResourceItem title="Chess Opening Principles" category="Strategy" readTime="5 min read" />
            <ResourceItem title="Mastering the 10x10 Checkers Board" category="Advanced Tactics" readTime="8 min read" />
            <ResourceItem title="Ludo: Probability and Placement" category="Mechanics" readTime="4 min read" />
            <ResourceItem title="Dominoes Scoring Strategies" category="Strategy" readTime="6 min read" />
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

function BadgeLink({ children, to, icon }) {
  return (
    <Link to={to} className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-colors">
      {icon} {children}
    </Link>
  );
}

function ResourceItem({ title, category, readTime }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer group">
      <div>
        <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{title}</h4>
        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground font-medium">
          <span className="px-2 py-0.5 rounded bg-muted text-foreground">{category}</span>
          <span>{readTime}</span>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="hidden sm:flex group-hover:text-primary group-hover:translate-x-1 transition-all">
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
