
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Home, Trophy, Frown, Activity, Clock, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const Confetti = () => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#f97316'];
    const pts = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20 - Math.random() * 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      scale: 0.5 + Math.random() * 1,
      rotation: Math.random() * 360,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 1
    }));
    setParticles(pts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ top: `${p.y}%`, left: `${p.x}%`, rotate: p.rotation, scale: p.scale }}
          animate={{ top: '120%', rotate: p.rotation + 360 * (Math.random() > 0.5 ? 1 : -1) }}
          transition={{ duration: p.duration, delay: p.delay, ease: "linear", repeat: Infinity }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
};

const Rain = () => {
  const [drops, setDrops] = useState([]);
  useEffect(() => {
    const dps = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20 - Math.random() * 50,
      height: 10 + Math.random() * 20,
      opacity: 0.2 + Math.random() * 0.4,
      duration: 0.5 + Math.random() * 0.5,
      delay: Math.random() * 1
    }));
    setDrops(dps);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden bg-slate-900/20">
      {drops.map(d => (
        <motion.div
          key={d.id}
          initial={{ top: `${d.y}%`, left: `${d.x}%`, opacity: d.opacity }}
          animate={{ top: '120%' }}
          transition={{ duration: d.duration, delay: d.delay, ease: "linear", repeat: Infinity }}
          className="absolute w-[2px] bg-blue-400 rounded-full"
          style={{ height: `${d.height}px` }}
        />
      ))}
    </div>
  );
};

const BrandedGameOverScreen = ({ gameType, isWin, isLoss, isDraw, stats, onReplay }) => {
  useEffect(() => {
    // Play sound based on result (using simple generic web audio API to avoid heavy assets if possible)
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (isWin) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
        osc.start(); osc.stop(ctx.currentTime + 1);
      } else if (isLoss) {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
        osc.start(); osc.stop(ctx.currentTime + 1);
      }
    } catch(e) { /* ignore audio error */ }
  }, [isWin, isLoss]);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/95 backdrop-blur-md flex items-center justify-center z-[100] p-4"
      >
        {isWin && <Confetti />}
        {isLoss && <Rain />}

        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="w-full max-w-xl bg-card border-2 border-border rounded-3xl shadow-2xl overflow-hidden relative z-10"
        >
          <div className={`p-8 text-center border-b ${isWin ? 'bg-green-500/10 border-green-500/20' : isLoss ? 'bg-blue-500/10 border-blue-500/20' : 'bg-muted border-border'}`}>
            <div className="mb-4 flex justify-center">
              {isWin ? (
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                  <Trophy className="w-10 h-10" />
                </div>
              ) : isLoss ? (
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                  <Frown className="w-10 h-10" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-muted-foreground rounded-full flex items-center justify-center text-background">
                  <ShieldAlert className="w-10 h-10" />
                </div>
              )}
            </div>

            <h2 className={`text-4xl font-black uppercase tracking-tight mb-2 ${isWin ? 'text-green-500' : isLoss ? 'text-blue-500' : 'text-foreground'}`}>
              {isWin ? 'You Win!' : isLoss ? 'You Lost' : 'Draw'}
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
              {isWin ? 'Incredible performance. Masterful strategy!' : isLoss ? 'Tough match. Learn from the mistakes and try again.' : 'A hard-fought battle with no victor.'}
            </p>
          </div>

          {stats && (
            <div className="p-6 bg-background">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Post-Game Analysis</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <Activity className="w-5 h-5 text-primary mb-2" />
                  <span className="text-2xl font-black text-foreground">{stats.moves || 0}</span>
                  <span className="text-xs text-muted-foreground font-medium uppercase">Total Moves</span>
                </div>
                <div className="bg-muted rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <Clock className="w-5 h-5 text-primary mb-2" />
                  <span className="text-2xl font-black text-foreground">{stats.duration || '0:00'}</span>
                  <span className="text-xs text-muted-foreground font-medium uppercase">Duration</span>
                </div>
              </div>

              {stats.analysis && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm mb-6">
                  <p className="font-medium text-foreground mb-1">Key Insight:</p>
                  <p className="text-muted-foreground leading-relaxed">{stats.analysis}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={onReplay} size="lg" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl text-lg">
                  <RefreshCw className="w-5 h-5 mr-2" /> Play Again
                </Button>
                <Button asChild size="lg" variant="outline" className="flex-1 font-bold rounded-xl text-lg">
                  <Link to="/"><Home className="w-5 h-5 mr-2"/> Return Home</Link>
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BrandedGameOverScreen;
