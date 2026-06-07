
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PrivacySelector from '@/components/PrivacySelector.jsx';
import FullScreenGameLayout from '@/components/FullScreenGameLayout.jsx';
import BrandedGameHeader from '@/components/BrandedGameHeader.jsx';
import BrandedGameOverScreen from '@/components/BrandedGameOverScreen.jsx';
import MoveTracker from '@/components/MoveTracker.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const QuizzesPage = () => {
  const [privacy, setPrivacy] = useState(null);
  const [score, setScore] = useState(0);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const handleAnswer = (opt) => {
    setScore(s => s + 10);
    setMoveHistory(prev => [...prev, { notation: `Selected: ${opt}` }]);
    setGameOver(true);
  };

  if (!privacy) return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 flex justify-center items-center"><PrivacySelector onSelect={setPrivacy} /></main><Footer /></div>;

  const rightPanel = (
    <div className="space-y-4 h-full flex flex-col">
      <div className="p-4 bg-muted border border-border rounded-xl text-center">
        <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Question</p>
        <p className="text-4xl font-black mt-2">1 / 10</p>
      </div>
      <div className="flex-1">
        <MoveTracker moves={moveHistory} title="Quiz Log" />
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Speed Quizzes - NICD NICOLENIUM</title></Helmet>
      <FullScreenGameLayout title={<BrandedGameHeader gameTitle="NICD NICOLENIUM Speed Quizzes" />} mode="Standard" onExit={() => window.location.reload()} rightPanelContent={rightPanel}>
        <div className="w-full max-w-4xl mx-auto flex flex-col justify-center h-full relative z-10">
          {gameOver ? (
            <BrandedGameOverScreen gameType="Speed Quizzes" score={score} onReplay={() => {setScore(0); setMoveHistory([]); setGameOver(false);}} />
          ) : (
            <Card className="shadow-2xl border-2 border-brand-primary/30 bg-card backdrop-blur-xl rounded-3xl overflow-hidden">
              <CardHeader className="pb-8 pt-10 text-center border-b border-border/50 bg-muted/20">
                 <span className="text-brand-primary font-bold tracking-widest uppercase text-sm mb-3 block">Science</span>
                <CardTitle className="text-3xl md:text-5xl font-black tracking-tight text-balance leading-tight text-foreground">
                  Which planet is known as the Red Planet?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6 md:p-10">
                {['Venus', 'Mars', 'Jupiter', 'Saturn'].map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(opt)} className="w-full p-6 rounded-2xl border-2 border-border hover:border-brand-primary bg-background hover:bg-brand-primary/10 text-left font-bold text-xl md:text-2xl transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-brand-primary/50 text-foreground">
                    <span className="inline-block w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary text-center leading-8 mr-4 text-sm align-middle">{String.fromCharCode(65+i)}</span>
                    {opt}
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </FullScreenGameLayout>
    </>
  );
};
export default QuizzesPage;
