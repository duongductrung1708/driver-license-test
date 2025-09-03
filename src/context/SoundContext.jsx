import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const SoundContext = createContext();

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

export const SoundProvider = ({ children }) => {
  const [volume, setVolume] = useState(0.2);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedVolume = localStorage.getItem('soundVolume');
      if (savedVolume !== null) {
        const parsed = parseFloat(savedVolume);
        if (!Number.isNaN(parsed)) {
          setVolume(Math.max(0, Math.min(1, parsed)));
        }
      }
      
      const savedMuted = localStorage.getItem('soundMuted');
      if (savedMuted === '1') {
        setMuted(true);
      }
    } catch (error) {
      console.warn('Failed to load sound settings:', error);
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('soundVolume', String(volume));
    } catch (error) {
      console.warn('Failed to save volume setting:', error);
    }
  }, [volume]);

  useEffect(() => {
    try {
      if (muted) {
        localStorage.setItem('soundMuted', '1');
      } else {
        localStorage.removeItem('soundMuted');
      }
    } catch (error) {
      console.warn('Failed to save mute setting:', error);
    }
  }, [muted]);

  // Create audio context for sound effects
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  const playSound = (frequency = 440, duration = 200, type = 'sine') => {
    if (muted || !audioRef.current) return;

    try {
      const oscillator = audioRef.current.createOscillator();
      const gainNode = audioRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioRef.current.destination);

      oscillator.frequency.setValueAtTime(frequency, audioRef.current.currentTime);
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0, audioRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioRef.current.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioRef.current.currentTime + duration / 1000);

      oscillator.start(audioRef.current.currentTime);
      oscillator.stop(audioRef.current.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  };

  const playSuccessSound = () => {
    playSound(800, 300, 'sine');
  };

  const playErrorSound = () => {
    playSound(200, 400, 'sawtooth');
  };

  const playClickSound = () => {
    playSound(600, 100, 'square');
  };

  const playNotificationSound = () => {
    playSound(1000, 200, 'triangle');
  };

  const updateVolume = (newVolume) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  };

  const toggleMute = () => {
    setMuted(prev => !prev);
  };

  const unmute = () => {
    setMuted(false);
  };

  const mute = () => {
    setMuted(true);
  };

  const value = {
    volume,
    muted,
    playSound,
    playSuccessSound,
    playErrorSound,
    playClickSound,
    playNotificationSound,
    updateVolume,
    toggleMute,
    unmute,
    mute,
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};
