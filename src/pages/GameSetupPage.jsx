
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import Breadcrumb from '@/components/Breadcrumb.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Gamepad2, BrainCircuit, Globe, Clock, ArrowRight } from 'lucide-react';

const GAMES_LIST = [
  { id: 'chess', name: 'Master Chess', icon: <BrainCircuit />, path: '/chess' },
  { id: 'checkers-10x10', name: 'Pro Checkers 10x10', icon: <Gamepad2 />, path: '/checkers-10x10' },
  { id: 'checkers-8x8', name: 'Classic Checkers 8x8', icon: <Gamepad2 />, path: '/checkers-8x8' },
  { id: 'ludo', name: 'Classic Ludo', icon: <Globe />, path: '/ludo' },
  { id: 'dominoes', name: 'Dominoes Pro', icon: <Gamepad2 />, path: '/dominoes' },
  { id: 'tiktaktok', name: 'Tic Tac Toe', icon: <Clock />, path: '/tiktaktok' },
  { id: 'math-challenge', name: 'Math Challenge', icon: <BrainCircuit />, path: '/math-challenge' },
  { id: 'knowledge-quizzes', name: 'Knowledge Quizzes', icon: <BrainCircuit />, path: '/knowledge-quizzes' },
  { id: 'pronunciation-master', name: 'Pronunciation Master', icon: <Globe />, path: '/pronunciation-master' },
  { id: 'languages-learning', name: 'Language Academy', icon: <Globe />, path: '/languages-learning' },
  { id: 'speed-quiz', name: 'Speed Quiz', icon: <Clock />, path: '/speed-quiz' }
];

export default function GameSetupPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Game Setup | NICD NICOLENIUM</title></Helmet>
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb />
        
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-foreground">Configure Match</h1>
          <p className="text-xl text-muted-foreground font-medium">Select a game below to customize your match settings, time control, and AI difficulty.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES_LIST.map((game) => (
            <Card key={game.id} className="group overflow-hidden bg-card border-2 hover:border-primary/50 transition-all hover:shadow-xl rounded-2xl cursor-pointer" onClick={() => navigate(game.path, { state: { setup: true } })}>
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
                  {React.cloneElement(game.icon, { className: "w-8 h-8" })}
                </div>
                <h3 className="text-2xl font-bold mb-4">{game.name}</h3>
                <div className="mt-auto w-full">
                  <Button variant="outline" className="w-full font-bold h-12 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                    Setup Match <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
