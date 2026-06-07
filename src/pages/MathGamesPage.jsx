
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calculator, ArrowRight, Play, Trophy, RotateCcw, Home } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { useSoundEffects } from '@/utils/soundManager.js';

const MathGamesPage = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const sounds = useSoundEffects();
  const [gameState, setGameState] = useState('setup'); 
  
  const [gameType, setGameType] = useState('addition');
  const [difficulty, setDifficulty] = useState('medium');
  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [answerInput, setAnswerInput] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);

  const generateNextQuestion = () => {
    let maxNum = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 50 : 100;
    let a = Math.floor(Math.random() * maxNum) + 1;
    let b = Math.floor(Math.random() * maxNum) + 1;
    let op = gameType;
    
    if (op === 'mixed') {
      const ops = ['addition', 'subtraction', 'multiplication', 'division'];
      op = ops[Math.floor(Math.random() * ops.length)];
    }

    let q = '';
    let ans = 0;
    let explanation = '';

    switch(op) {
      case 'addition': 
        q = `${a} + ${b}`; 
        ans = a + b; 
        explanation = `${a} + ${b} = ${ans}`;
        break;
      case 'subtraction': 
        if (a < b) [a, b] = [b, a];
        q = `${a} - ${b}`; 
        ans = a - b; 
        explanation = `${a} - ${b} = ${ans}`;
        break;
      case 'multiplication': 
        a = Math.floor(a / 2) + 1;
        b = Math.floor(b / 2) + 1;
        q = `${a} × ${b}`; 
        ans = a * b; 
        explanation = `${a} × ${b} = ${ans}`;
        break;
      case 'division':
        ans = a; 
        a = a * b;
        q = `${a} ÷ ${b}`; 
        explanation = `${a} ÷ ${b} = ${ans}`;
        break;
    }
    return { text: q, answer: ans, explanation };
  };

  const startGame = () => {
    setCurrentQuestion(generateNextQuestion());
    setQuestionCount(0);
    setScore(0);
    setAnswerInput('');
    setFeedback(null);
    setGameState('playing');
    setStartTime(Date.now());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answerInput || feedback !== null) return;
    
    const isCorrect = parseInt(answerInput) === currentQuestion.answer;
    
    if (isCorrect) {
      sounds.playCapture();
      setScore(s => s + 10);
      setFeedback('correct');
    } else {
      sounds.playLose();
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setQuestionCount(c => c + 1);
      setCurrentQuestion(generateNextQuestion());
      setAnswerInput('');
      setFeedback(null);
    }, 1200);
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
        
        await pb.collection('math_games').create({
          userId: currentUser.id,
          gameType,
          difficulty,
          score,
          accuracy,
          averageTime: avgTime,
          timedMode: false,
          numberRange: { max: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 50 : 100 }
        }, { $autoCancel: false });
        
        toast.success(t('common.save'));
      } catch (err) {
        console.error("Failed to save game", err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Math Challenge | NICD NICOLENIUM</title></Helmet>
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl flex items-center justify-center">
        
        {gameState === 'setup' && (
          <div className="w-full max-w-xl bg-card border border-border shadow-xl rounded-3xl p-8 md:p-12 animate-in slide-in-from-bottom-8">
            <div className="text-center mb-10">
              <Calculator className="w-12 h-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Math <span className="text-primary">Challenge</span></h1>
              <p className="text-muted-foreground mt-3">Endless mathematical problems.</p>
            </div>
            
            <div className="space-y-6 mb-10">
              <div className="space-y-3">
                <Label className="text-sm uppercase tracking-wider font-bold">Operation</Label>
                <Select value={gameType} onValueChange={setGameType}>
                  <SelectTrigger className="h-12 bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="addition">Addition</SelectItem>
                    <SelectItem value="subtraction">Subtraction</SelectItem>
                    <SelectItem value="multiplication">Multiplication</SelectItem>
                    <SelectItem value="division">Division</SelectItem>
                    <SelectItem value="mixed">Mixed Operations</SelectItem>
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
              Start Challenge <Play className="w-5 h-5 ml-2 fill-current" />
            </Button>
          </div>
        )}

        {gameState === 'playing' && currentQuestion && (
          <div className="w-full max-w-2xl animate-in fade-in">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Question {questionCount + 1} / Unlimited</span>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={endGame}>Finish Early</Button>
                <div className="text-right">
                  <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Score</div>
                  <div className="text-3xl font-black tabular-nums">{score}</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border shadow-2xl rounded-3xl p-12 text-center relative overflow-hidden">
              {feedback && (
                <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-sm ${feedback === 'correct' ? 'bg-green-500/20' : 'bg-destructive/20'}`}>
                  <span className={`text-6xl font-black mb-4 ${feedback === 'correct' ? 'text-green-500' : 'text-destructive'}`}>
                    {feedback === 'correct' ? '✓' : '✗'}
                  </span>
                  <p className="text-lg font-bold bg-background/80 px-4 py-2 rounded-lg border shadow-sm">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
              
              <div className="text-6xl md:text-8xl font-black tabular-nums tracking-tighter mb-12">
                {currentQuestion.text} = ?
              </div>
              
              <form onSubmit={handleSubmit} className="max-w-xs mx-auto">
                <Input 
                  type="number" 
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  autoFocus
                  disabled={feedback !== null}
                  className="h-20 text-center text-4xl font-bold rounded-2xl bg-background border-2 border-primary focus-visible:ring-primary mb-4 text-foreground placeholder:text-muted-foreground/30"
                  placeholder="0"
                />
                <Button type="submit" disabled={feedback !== null} className="w-full h-14 rounded-full text-lg font-bold">Submit</Button>
              </form>
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
              <Button onClick={() => setGameState('setup')} variant="outline" className="flex-1 h-14 rounded-full text-lg">
                <RotateCcw className="w-5 h-5 mr-2" /> Play Again
              </Button>
              <Button asChild className="flex-1 h-14 rounded-full text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/games">
                  <Home className="w-5 h-5 mr-2" /> Hub
                </Link>
              </Button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default MathGamesPage;
