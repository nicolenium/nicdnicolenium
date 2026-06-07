import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Brain, Trophy, RefreshCw, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils.js';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

export default function TriviaGamePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessionError, setSessionError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const records = await pb.collection('game_questions').getFullList({
          filter: 'gameType = "trivia"',
          sort: '@random',
          $autoCancel: false
        });
        
        if (records.length === 0) {
          toast.error('No trivia questions available in database');
          setSessionError(true);
          setLoading(false);
          return;
        }

        const formattedQuestions = records.slice(0, 10).map(r => {
          let opts = [];
          try {
            opts = Array.isArray(r.options) ? r.options : JSON.parse(r.options || '[]');
          } catch (e) {
            console.error("Failed to parse options for question", r.id);
          }
          return {
            q: r.question,
            options: opts,
            a: r.correctAnswer,
            explanation: r.explanation,
            points: r.points || 10
          };
        });

        setQuestions(formattedQuestions);
        setLoading(false);

        const record = await pb.collection('game_sessions').create({
          gameId: String(`trivia-${Date.now()}`),
          player1Id: String(currentUser?.id || 'guest'),
          player2Id: 'computer',
          gameType: 'trivia',
          status: 'in-progress',
          game_mode: 'public'
        }, { $autoCancel: false });
        setSessionId(record.id);
      } catch (err) {
        console.error("Failed to load questions:", err);
        toast.error('Failed to connect to database');
        setSessionError(true);
        setLoading(false);
      }
    };
    loadQuestions();
  }, [currentUser]);

  useEffect(() => {
    if (isGameOver && sessionId && !sessionError) {
      pb.collection('game_sessions').update(sessionId, { status: 'completed', score }, { $autoCancel: false }).catch(console.error);
    }
  }, [isGameOver, sessionId, score, sessionError]);

  const handleAnswer = (option) => {
    if (selectedAnswer || sessionError) return;
    setSelectedAnswer(option);
    
    const currentQuestion = questions[currentQ];
    if (option === currentQuestion.a) {
      setScore(s => s + (currentQuestion.points || 10));
    }

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(q => q + 1);
        setSelectedAnswer(null);
      } else {
        setIsGameOver(true);
      }
    }, 1500);
  };

  const resetGame = () => {
    setCurrentQ(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsGameOver(false);
    navigate(0);
  };

  if (loading) {
    return (
      <div className="flex flex-col bg-background min-h-[calc(100vh-4rem)]">
        <Helmet><title>Loading Trivia | NICOLENIUM</title></Helmet>
        <main className="flex-1 container flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">Loading trivia challenge...</p>
          </div>
        </main>
      </div>
    );
  }

  if (sessionError || questions.length === 0) {
    return (
      <div className="flex flex-col bg-background p-4 py-12 min-h-[calc(100vh-4rem)]">
        <Helmet><title>Error | NICOLENIUM</title></Helmet>
        <main className="flex-1 container flex items-center justify-center">
          <div className="max-w-md w-full text-center p-8 bg-card border border-border rounded-2xl shadow-xl">
             <h2 className="text-2xl font-bold text-destructive mb-4">No Questions Available</h2>
             <p className="text-muted-foreground mb-6">Unable to load trivia content. The database might be empty or unavailable.</p>
             <Button onClick={() => navigate('/games')} className="w-full h-12 text-lg font-bold">Go Back to Games</Button>
          </div>
        </main>
      </div>
    );
  }

  const currentQuestion = questions[currentQ];

  return (
    <div className="flex flex-col bg-background min-h-[calc(100vh-4rem)]">
      <Helmet><title>Trivia Master | NICOLENIUM</title></Helmet>
      
      <main className="flex-1 container max-w-3xl mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black font-serif mb-4 flex items-center justify-center gap-3 tracking-tight">
            <Brain className="w-10 h-10 text-primary" /> Trivia Master
          </h1>
          <p className="text-muted-foreground text-lg font-medium">Test your knowledge across various topics!</p>
        </div>

        {!isGameOver ? (
          <Card className="w-full shadow-2xl border-white/10 bg-card rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-white/5 py-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Question {currentQ + 1} of {questions.length}</span>
                <span className="font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">Score: {score}</span>
              </div>
              <CardTitle className="text-2xl md:text-3xl pt-2 leading-snug">{currentQuestion.q}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 grid gap-4">
              {currentQuestion.options.map((opt, i) => {
                const isCorrect = opt === currentQuestion.a;
                const isSelected = selectedAnswer === opt;
                
                let btnVariant = "outline";
                let icon = null;
                let bgClass = "bg-background border-white/10 hover:border-primary/50";
                
                if (selectedAnswer) {
                  if (isCorrect) {
                    btnVariant = "default";
                    bgClass = "bg-green-600 hover:bg-green-700 text-white border-green-600";
                    icon = <CheckCircle2 className="w-5 h-5 ml-auto" />;
                  } else if (isSelected) {
                    btnVariant = "destructive";
                    bgClass = "";
                    icon = <XCircle className="w-5 h-5 ml-auto" />;
                  }
                }

                return (
                  <Button 
                    key={i}
                    variant={btnVariant}
                    className={cn("h-16 text-lg justify-start px-6 transition-all rounded-xl", bgClass)}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!selectedAnswer}
                  >
                    {opt}
                    {icon}
                  </Button>
                );
              })}
              {selectedAnswer && currentQuestion.explanation && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-5 bg-muted/50 rounded-xl border border-white/5">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Explanation</p>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{currentQuestion.explanation}</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        ) : (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full">
            <Card className="w-full shadow-2xl border-white/10 bg-card text-center py-16 rounded-3xl">
              <CardContent className="flex flex-col items-center gap-6">
                <div className="w-28 h-28 bg-primary/10 rounded-full flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(0,255,65,0.2)]">
                  <Trophy className="w-14 h-14 text-primary" />
                </div>
                <h2 className="text-4xl md:text-5xl font-black font-serif tracking-tight">Game Over!</h2>
                <div className="bg-muted/50 px-8 py-6 rounded-2xl w-full max-w-sm border border-white/5">
                  <p className="text-lg text-muted-foreground mb-2 font-medium">Final Score</p>
                  <p className="text-5xl font-black text-primary mb-4">{score}</p>
                  <div className="h-px w-full bg-border mb-4"></div>
                  <p className="text-base text-muted-foreground font-medium">
                    Correct Answers: <span className="text-foreground font-bold">{Math.floor(score / 10)}</span> / {questions.length}
                  </p>
                </div>
                <Button size="lg" onClick={resetGame} className="mt-4 h-14 px-8 text-lg font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                  <RefreshCw className="w-5 h-5 mr-2" /> Play Again
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}