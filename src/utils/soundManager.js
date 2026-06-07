import { useCallback, useState, useEffect, useRef } from 'react';
import pb from '@/lib/pocketbaseClient.js';

let sharedAudioCtx = null;

const getAudioContext = () => {
  if (!sharedAudioCtx) {
    sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
};

const playSyntheticSound = (frequencies, type = 'sine', duration = 0.1, volume = 0.1) => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    
    if (Array.isArray(frequencies)) {
      oscillator.frequency.setValueAtTime(frequencies[0], ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(frequencies[1], ctx.currentTime + duration);
    } else {
      oscillator.frequency.setValueAtTime(frequencies, ctx.currentTime);
    }

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio play failed:', e);
  }
};

export const useSoundEffects = () => {
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('nicd_sound_muted') === 'true');
  const [volume, setVolume] = useState(() => parseInt(localStorage.getItem('nicd_sound_volume') || '100', 10));
  const [soundMove, setSoundMove] = useState(() => localStorage.getItem('nicd_sound_move') !== 'false');
  const [soundCapture, setSoundCapture] = useState(() => localStorage.getItem('nicd_sound_capture') !== 'false');
  const [soundEnd, setSoundEnd] = useState(() => localStorage.getItem('nicd_sound_end') !== 'false');
  
  const activeAudioRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('nicd_sound_muted', isMuted);
    localStorage.setItem('nicd_sound_volume', volume);
    localStorage.setItem('nicd_sound_move', soundMove);
    localStorage.setItem('nicd_sound_capture', soundCapture);
    localStorage.setItem('nicd_sound_end', soundEnd);
    
    if (activeAudioRef.current) {
      activeAudioRef.current.volume = isMuted ? 0 : (volume / 100);
    }
    
    if (pb.authStore.isValid) {
      const sync = setTimeout(() => {
        pb.collection('user_settings').getFirstListItem(`userId="${pb.authStore.model.id}"`, { $autoCancel: false })
          .then(setting => {
            pb.collection('user_settings').update(setting.id, {
              soundEnabled: !isMuted,
              volumeLevel: volume,
              sound_move: soundMove,
              sound_capture: soundCapture,
              sound_end: soundEnd
            }, { $autoCancel: false });
          }).catch(() => {
            pb.collection('user_settings').create({
              userId: pb.authStore.model.id,
              soundEnabled: !isMuted,
              volumeLevel: volume,
              sound_move: soundMove,
              sound_capture: soundCapture,
              sound_end: soundEnd
            }, { $autoCancel: false });
          });
      }, 1000);
      return () => clearTimeout(sync);
    }
  }, [isMuted, volume, soundMove, soundCapture, soundEnd]);

  const toggleMute = () => setIsMuted(!isMuted);

  const getEffectiveVolume = () => isMuted ? 0 : (volume / 100) * 0.2;

  const playMove = useCallback(() => {
    if (!soundMove || isMuted || volume === 0) return;
    playSyntheticSound(400, 'sine', 0.1, getEffectiveVolume() * 0.5);
  }, [soundMove, isMuted, volume]);

  const playCapture = useCallback(() => {
    if (!soundCapture || isMuted || volume === 0) return;
    playSyntheticSound([300, 150], 'triangle', 0.15, getEffectiveVolume() * 0.75);
  }, [soundCapture, isMuted, volume]);

  const playWin = useCallback(() => {
    if (!soundEnd || isMuted || volume === 0) return;
    const v = getEffectiveVolume();
    playSyntheticSound(523.25, 'sine', 0.15, v); 
    setTimeout(() => playSyntheticSound(659.25, 'sine', 0.15, v), 150); 
    setTimeout(() => playSyntheticSound(783.99, 'sine', 0.15, v), 300); 
    setTimeout(() => playSyntheticSound(1046.50, 'sine', 0.4, v), 450); 
  }, [soundEnd, isMuted, volume]);

  const playLose = useCallback(() => {
    if (!soundEnd || isMuted || volume === 0) return;
    const v = getEffectiveVolume();
    playSyntheticSound([300, 250], 'triangle', 0.3, v);
    setTimeout(() => playSyntheticSound([250, 200], 'triangle', 0.4, v), 300);
    setTimeout(() => playSyntheticSound([200, 150], 'sawtooth', 0.6, v), 700);
  }, [soundEnd, isMuted, volume]);
  
  // New method for Educational Games audio playback
  const playExternalAudio = useCallback((url) => {
    if (isMuted || volume === 0) return;
    
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
    }
    
    try {
      const audio = new Audio(url);
      audio.volume = volume / 100;
      activeAudioRef.current = audio;
      audio.play().catch(e => console.warn('External audio play failed:', e));
    } catch (err) {
      console.warn('Audio setup failed:', err);
    }
  }, [isMuted, volume]);

  return {
    isMuted, volume, soundMove, soundCapture, soundEnd,
    toggleMute, setVolume, setSoundMove, setSoundCapture, setSoundEnd,
    playMove, playCapture, playWin, playLose, playExternalAudio
  };
};