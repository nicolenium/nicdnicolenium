
import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useProgressTracker } from '@/hooks/useProgressTracker';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Activity, Flame, GraduationCap } from 'lucide-react';

const LearningDashboard = () => {
  const { progress } = useProgressTracker();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>My Progress - NICD</title></Helmet>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-3xl font-black text-foreground uppercase tracking-wider">Learning Dashboard</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border"><CardContent className="p-6 text-center">
              <GraduationCap className="w-6 h-6 text-primary mx-auto mb-2 opacity-80" />
              <p className="text-2xl font-black">{progress?.lessonsCompleted?.length || 0}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Lessons</p>
            </CardContent></Card>
            <Card className="bg-card border-border"><CardContent className="p-6 text-center">
              <Target className="w-6 h-6 text-green-500 mx-auto mb-2 opacity-80" />
              <p className="text-2xl font-black text-green-500">{progress?.puzzlesSolved?.length || 0}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Puzzles</p>
            </CardContent></Card>
            <Card className="bg-card border-border"><CardContent className="p-6 text-center">
              <Activity className="w-6 h-6 text-orange-500 mx-auto mb-2 opacity-80" />
              <p className="text-2xl font-black text-orange-500">{progress?.totalAccuracy || 0}%</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Accuracy</p>
            </CardContent></Card>
            <Card className="bg-card border-border"><CardContent className="p-6 text-center">
              <Flame className="w-6 h-6 text-red-500 mx-auto mb-2 opacity-80" />
              <p className="text-2xl font-black text-red-500">{progress?.estimatedRating || 1000}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Est. ELO</p>
            </CardContent></Card>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};
export default LearningDashboard;
