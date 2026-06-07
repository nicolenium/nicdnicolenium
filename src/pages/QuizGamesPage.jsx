
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Star, Play, Trophy, RotateCcw, Home, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useSoundEffects } from '@/utils/soundManager.js';

const MOCK_KNOWLEDGE_BASE = {
  general_knowledge: [
    { q: "What is the capital of France?", opts: ["Berlin", "London", "Paris", "Madrid"], a: 2, exp: "Paris is the capital and most populous city of France." },
    { q: "Which planet is known as the Red Planet?", opts: ["Mars", "Jupiter", "Venus", "Saturn"], a: 0, exp: "Mars appears red due to iron oxide (rust) on its surface." },
    { q: "What is the largest ocean on Earth?", opts: ["Atlantic", "Indian", "Arctic", "Pacific"], a: 3, exp: "The Pacific Ocean covers more than 30% of the Earth's surface." },
    { q: "Who wrote 'Hamlet'?", opts: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], a: 1, exp: "William Shakespeare wrote Hamlet around 1599-1601." },
    { q: "What is the tallest mammal?", opts: ["Elephant", "Giraffe", "Blue Whale", "Ostrich"], a: 1, exp: "Giraffes are the tallest living terrestrial animals." }
  ],
  science: [
    { q: "What is the chemical symbol for Gold?", opts: ["Au", "Ag", "Fe", "Cu"], a: 0, exp: "Au comes from the Latin word 'aurum', meaning gold." },
    { q: "What gas do plants absorb?", opts: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], a: 1, exp: "Plants absorb carbon dioxide during photosynthesis." },
    { q: "What is the hardest natural substance on Earth?", opts: ["Gold", "Iron", "Diamond", "Platinum"], a: 2, exp: "Diamond is an allotrope of carbon, where the atoms are arranged in a variation of the face-centered cubic crystal structure." }
  ],
  history: [
    { q: "In which year did World War II end?", opts: ["1941", "1943", "1945", "1950"], a: 2, exp: "World War II ended in 1945 with the surrender of the Axis powers." },
    { q: "Who was the first President of the United States?", opts: ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"], a: 2, exp: "George Washington served as the first president from 1789 to 1797." }
  ]
};

const QuizGamesPage = () => {
  const { currentUser } = useAuth();
  const sounds = useSoundEffects();
  const [gameState, setGameState] = useState('setup');
  
  const [category, setCategory] = useState('general_knowledge');
  const [difficulty, setDifficulty] = useState('medium');
  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);

  const getNextQuestion = () => {
    const pool = MOCK_KNOWLEDGE_BASE[category] || MOCK_KNOWLEDGE_BASE.general_knowledge;
    // In a real app, track asked IDs to prevent dupes. Using random for infinite demo.
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const startGame = () => {
    setCurrentQuestion(getNextQuestion());
    setQuestionCount(0);
    setScore(0);
    setSelectedAnswer(null);
    setGameState('playing');
    setStartTime(Date.now());
  };

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    if (index === currentQuestion.a) {
      sounds.playCapture();
      setScore(s => s + 10);
    } else {
      sounds.playLose();
    }
  };

  const nextQuestion = () => {
    setQuestionCount(c => c + 1);
    setCurrentQuestion(getNextQuestion());
    setSelectedAnswer(null);
  };

  const endGame = async () => {
    sounds.playWin();
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    setTotalTimeTaken(totalTime);
    setGameState('over');

    if (currentUser && questionCount > 0) {
      try {
        const accuracy = (score / (questionCount * 10)) * 100;
        const avgTime = totalTime / questionCount;
        
        await pb.collection('quiz_games').create({
          userId: currentUser.id,
          category,
          difficulty,
          score,
          accuracy,
          averageTime: avgTime,
          questionCount: questionCount,
          questionsAnswered: questionCount
        }, { $autoCancel: false });
        
        toast.success("Quiz results saved!");
      } catch (err) {
        console.error("Failed to save quiz", err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Knowledge Quizzes | NICD NICOLENIUM</title></Helmet>
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl flex items-center justify-center">
        
        {gameState === 'setup' && (
          <div className="w-full max-w-xl bg-card border border-border shadow-xl rounded-3xl p-8 md:p-12 animate-in slide-in-from-bottom-8">
            <div className="text-center mb-10">
              <Star className="w-12 h-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Knowledge <span className="text-primary">Quizzes</span></h1>
              <p className="text-muted-foreground mt-3">Endless learning mode.</p>
            </div>
            
            <div className="space-y-6 mb-10">
              <div className="space-y-3">
                <Label className="text-sm uppercase tracking-wider font-bold">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12 bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general_knowledge">General Knowledge</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm uppercase tracking-wider font-bold">Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="h-12 bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={startGame} className="w-full h-14 rounded-full text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90">
              Start Endless Quiz <Play className="w-5 h-5 ml-2 fill-current" />
            </Button>
          </div>
        )}

        {gameState === 'playing' && currentQuestion && (
          <div className="w-full max-w-3xl animate-in fade-in">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Question {questionCount + 1} / Unlimited</span>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={endGame}>Finish Session</Button>
                <div className="text-right">
                  <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Score</div>
                  <div className="text-3xl font-black tabular-nums text-primary">{score}</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border shadow-xl rounded-3xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-10 leading-relaxed text-balance">
                {currentQuestion.q}
              </h2>
              
              <div className="space-y-4 mb-8">
                {currentQuestion.opts.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrectAnswer = currentQuestion.a === idx;
                  const showResult = selectedAnswer !== null;
                  
                  let btnClass = "border-border hover:bg-muted";
                  let icon = null;

                  if (showResult) {
                    if (isCorrectAnswer) {
                      btnClass = "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
                      icon = <CheckCircle2 className="w-5 h-5 ml-auto text-green-500" />;
                    } else if (isSelected) {
                      btnClass = "border-destructive bg-destructive/10 text-destructive";
                      icon = <XCircle className="w-5 h-5 ml-auto text-destructive" />;
                    } else {
                      btnClass = "opacity-50 border-border bg-background";
                    }
                  } else if (isSelected) {
                    btnClass = "border-primary bg-primary/10";
                  }

                  return (
                    <button 
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={showResult}
                      className={`w-full h-auto p-4 md:p-6 justify-start text-left text-lg font-medium transition-all border-2 rounded-xl flex items-center ${btnClass}`}
                    >
                      <span className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center mr-4 text-sm font-bold shrink-0">
                        {['A','B','C','D'][idx]}
                      </span>
                      {opt}
                      {icon}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <div className="animate-in fade-in pt-4 border-t border-border">
                  <div className="p-4 bg-muted/50 rounded-xl mb-6 border">
                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Explanation</p>
                    <p className="font-medium">{currentQuestion.exp}</p>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={nextQuestion} className="rounded-full px-8 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors font-bold flex items-center gap-2">
                      Next Question <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {gameState === 'over' && (
          <div className="w-full max-w-xl bg-card border border-border shadow-xl rounded-3xl p-8 md:p-12 text-center animate-in zoom-in-95">
            <Trophy className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-serif font-bold mb-2">Session Complete</h2>
            <p className="text-muted-foreground mb-8">You answered {questionCount} questions.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-6 bg-muted/30 rounded-2xl border border-border/50">
                <div className="text-sm uppercase tracking-wider text-muted-foreground mb-1">Final Score</div>
                <div className="text-4xl font-black text-primary tabular-nums">{score}</div>
              </div>
              <div className="p-6 bg-muted/30 rounded-2xl border border-border/50">
                <div className="text-sm uppercase tracking-wider text-muted-foreground mb-1">Accuracy</div>
                <div className="text-4xl font-black tabular-nums">{questionCount > 0 ? ((score / (questionCount * 10)) * 100).toFixed(0) : 0}%</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setGameState('setup')} className="flex-1 h-14 rounded-full text-lg border-2 border-border hover:bg-muted transition-colors font-bold flex items-center justify-center gap-2">
                <RotateCcw className="w-5 h-5" /> Play Again
              </button>
              <Link to="/games" className="flex-1 h-14 rounded-full text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-bold flex items-center justify-center gap-2">
                <Home className="w-5 h-5" /> Hub
              </Link>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default QuizGamesPage;
