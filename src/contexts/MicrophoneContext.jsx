
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const MicrophoneContext = createContext(null);

export const MicrophoneProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [stream, setStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0); // 0-100
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('default');
  const [permissionStatus, setPermissionStatus] = useState('pending'); // granted, denied, pending
  
  const [settings, setSettings] = useState({
    inputVolume: 100,
    noiseCancellation: true,
    echoCancellation: true,
    autoGainControl: true
  });

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    // Check initial permissions
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' }).then((status) => {
        setPermissionStatus(status.state);
        status.onchange = () => setPermissionStatus(status.state);
      });
    }

    navigator.mediaDevices.enumerateDevices().then(devs => {
      setDevices(devs.filter(d => d.kind === 'audioinput'));
    });

    return () => stopMicrophone();
  }, []);

  const requestMicrophonePermission = async () => {
    try {
      const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
      ms.getTracks().forEach(t => t.stop()); // close temp stream
      setPermissionStatus('granted');
      toast.success("Microphone access granted");
      
      const devs = await navigator.mediaDevices.enumerateDevices();
      setDevices(devs.filter(d => d.kind === 'audioinput'));

      // Log to pocketbase
      if (currentUser) {
        await pb.collection('microphone_permissions').create({
          userId: currentUser.id,
          permissionStatus: 'granted',
          devices: devs.map(d => ({ id: d.deviceId, label: d.label })),
          settings
        }, { $autoCancel: false }).catch(() => {});
      }
      return true;
    } catch (err) {
      setPermissionStatus('denied');
      toast.error("Microphone access denied");
      if (currentUser) {
        await pb.collection('microphone_permissions').create({
          userId: currentUser.id,
          permissionStatus: 'denied'
        }, { $autoCancel: false }).catch(() => {});
      }
      return false;
    }
  };

  const startMicrophone = async () => {
    if (permissionStatus === 'denied') {
      toast.error("Please allow microphone access in your browser settings");
      return;
    }
    
    stopMicrophone(); // Clean up existing

    try {
      const constraints = {
        audio: {
          deviceId: selectedDevice !== 'default' ? { exact: selectedDevice } : undefined,
          noiseSuppression: settings.noiseCancellation,
          echoCancellation: settings.echoCancellation,
          autoGainControl: settings.autoGainControl
        }
      };

      const activeStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(activeStream);
      
      activeStream.getAudioTracks()[0].enabled = !isMuted;

      // Set up analyzer
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(activeStream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        // Scale to 0-100 roughly
        setVolumeLevel(Math.min(100, Math.round((average / 128) * 100)));
        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };
      
      checkVolume();

    } catch (err) {
      console.error("Microphone start error:", err);
      toast.error("Could not start microphone stream.");
    }
  };

  const stopMicrophone = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    setVolumeLevel(0);
  };

  const toggleMicrophoneMute = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted; // Toggle hardware track
        setIsMuted(!isMuted);
      }
    } else {
      setIsMuted(!isMuted); // just state toggle if not running
    }
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    // If stream is active, we might need to restart it to apply some constraints
    if (stream && (newSettings.noiseCancellation !== undefined || newSettings.echoCancellation !== undefined)) {
      startMicrophone();
    }
  };

  return (
    <MicrophoneContext.Provider value={{
      stream,
      isMuted,
      volumeLevel,
      devices,
      selectedDevice,
      setSelectedDevice,
      permissionStatus,
      settings,
      updateSettings,
      requestMicrophonePermission,
      startMicrophone,
      stopMicrophone,
      toggleMicrophoneMute
    }}>
      {children}
    </MicrophoneContext.Provider>
  );
};

export const useMicrophone = () => useContext(MicrophoneContext);
