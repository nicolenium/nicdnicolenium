
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSoundEffects } from '@/utils/soundManager.js';

export default function RainAnimation() {
  const { volume, isMuted } = useSoundEffects();
  const audioCtxRef = useRef(null);

  useEffect(() => {
    if (isMuted || volume === 0) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

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

  }, [volume, isMuted]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="absolute inset-0 pointer-events-none z-50 flex items-start justify-center overflow-hidden rounded-inherit"
    >
      {Array.from({ length: 100 }).map((_, i) => (
        <motion.div
          key={`rain-${i}`}
          initial={{ 
            y: '-20%', 
            x: `${(Math.random() - 0.5) * 100}%`,
            opacity: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: '120%',
            opacity: 0
          }}
          transition={{ 
            duration: Math.random() * 0.5 + 0.5,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 1
          }}
          className="absolute top-0 w-0.5 h-8 bg-blue-400/60 rounded-full"
        />
      ))}
      <motion.div 
        animate={{ opacity: [0, 0.3, 0, 0, 0.8, 0, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-white mix-blend-overlay"
      />
      <div className="absolute inset-0 bg-slate-900/40" />
    </motion.div>
  );
}
