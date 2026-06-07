
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSoundEffects } from '@/utils/soundManager.js';

export default function FireAnimation() {
  const { volume, isMuted } = useSoundEffects();
  const audioCtxRef = useRef(null);

  useEffect(() => {
    if (isMuted || volume === 0) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const gainNode = ctx.createGain();
    gainNode.gain.value = (volume / 100) * 0.3;
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    // Victory Arpeggio
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.connect(gainNode);
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.3);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime((volume / 100) * 0.3, now + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1);
    
    osc.start(now);
    osc.stop(now + 1.5);

    // Crackle Noise
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
      className="absolute inset-0 pointer-events-none z-50 flex items-end justify-center overflow-hidden mix-blend-screen rounded-inherit"
    >
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={`fire-${i}`}
          initial={{ 
            y: '100%', 
            x: `${(Math.random() - 0.5) * 100}%`,
            scale: Math.random() * 1.5 + 0.5,
            opacity: 1
          }}
          animate={{ 
            y: '-120%',
            x: `${(Math.random() - 0.5) * 100}%`,
            opacity: 0,
            scale: Math.random() * 0.5
          }}
          transition={{ 
            duration: Math.random() * 2 + 1.5,
            repeat: Infinity,
            ease: "easeOut",
            delay: Math.random() * 2
          }}
          className="absolute bottom-0 w-12 h-12 rounded-full blur-md"
          style={{
            background: `radial-gradient(circle, rgba(255,${Math.floor(Math.random()*150 + 50)},0,0.8) 0%, rgba(255,0,0,0) 70%)`
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/30 to-transparent" />
    </motion.div>
  );
}
