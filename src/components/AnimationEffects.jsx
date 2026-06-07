
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnimationEffects({ status, volume = 50, isMuted = false }) {
  const audioCtxRef = useRef(null);

  useEffect(() => {
    if (!status || isMuted || volume === 0) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const gainNode = ctx.createGain();
    gainNode.gain.value = (volume / 100) * 0.3; // Base volume adjustment
    gainNode.connect(ctx.destination);

    if (status === 'win') {
      // Fire/Victory Sound: Bright ascending synth arpeggio + crackle
      const playWinSound = () => {
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.connect(gainNode);
        
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.3);
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime((volume / 100) * 0.3, now + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1);
        
        osc.start(now);
        osc.stop(now + 1.5);

        // Crackle noise
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 5000;
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime((volume / 100) * 0.1, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 2);
        
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);
      };
      playWinSound();
    } else if (status === 'loss') {
      // Rain/Defeat Sound: Low thunder rumble + white noise rain
      const playLossSound = () => {
        const now = ctx.currentTime;
        
        // Thunder rumble
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        const rumbleGain = ctx.createGain();
        rumbleGain.connect(ctx.destination);
        osc.connect(rumbleGain);
        
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 1);
        
        rumbleGain.gain.setValueAtTime(0, now);
        rumbleGain.gain.linearRampToValueAtTime((volume / 100) * 0.4, now + 0.2);
        rumbleGain.gain.exponentialRampToValueAtTime(0.01, now + 2);
        
        osc.start(now);
        osc.stop(now + 2.5);

        // Rain noise
        const bufferSize = ctx.sampleRate * 3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0, now);
        noiseGain.gain.linearRampToValueAtTime((volume / 100) * 0.15, now + 0.5);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 3);
        
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);
      };
      playLossSound();
    }
  }, [status, volume, isMuted]);

  return (
    <AnimatePresence>
      {status === 'win' && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 pointer-events-none z-50 flex items-end justify-center overflow-hidden mix-blend-screen"
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={`fire-${i}`}
              initial={{ 
                y: '100%', 
                x: `${(Math.random() - 0.5) * 100}vw`,
                scale: Math.random() * 1.5 + 0.5,
                opacity: 1
              }}
              animate={{ 
                y: '-120vh',
                x: `${(Math.random() - 0.5) * 100}vw`,
                opacity: 0,
                scale: Math.random() * 0.5
              }}
              transition={{ 
                duration: Math.random() * 2 + 1.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: Math.random() * 2
              }}
              className="absolute bottom-0 w-8 h-8 rounded-full blur-md"
              style={{
                background: `radial-gradient(circle, rgba(255,${Math.floor(Math.random()*150 + 50)},0,0.8) 0%, rgba(255,0,0,0) 70%)`
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent" />
        </motion.div>
      )}

      {status === 'loss' && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 pointer-events-none z-50 flex items-start justify-center overflow-hidden"
        >
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={`rain-${i}`}
              initial={{ 
                y: '-20vh', 
                x: `${(Math.random() - 0.5) * 100}vw`,
                opacity: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                y: '120vh',
                opacity: 0
              }}
              transition={{ 
                duration: Math.random() * 0.5 + 0.5,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 1
              }}
              className="absolute top-0 w-0.5 h-6 bg-blue-400/60 rounded-full"
            />
          ))}
          <motion.div 
            animate={{ opacity: [0, 0.3, 0, 0, 0.8, 0, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-white mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-slate-900/30" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
