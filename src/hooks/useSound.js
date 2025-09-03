// Simple Web Audio API sound hook for feedback tones
import { useMemo } from 'react';

export default function useSound() {
  const audio = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }, []);

  const playTone = (frequency = 440, durationMs = 200, type = 'sine', defaultVolume = 0.2) => {
    if (!audio) return;
    // hard mute guard at the lowest level
    try { if (localStorage.getItem('soundMuted') === '1') return; } catch {}
    // read current user volume (0.0 - 1.0) from localStorage
    let stored = 0.2;
    try {
      const raw = localStorage.getItem('soundVolume');
      if (raw !== null) {
        const parsed = parseFloat(raw);
        if (!Number.isNaN(parsed)) stored = Math.max(0, Math.min(1, parsed));
      }
    } catch {}
    const volume = stored ?? defaultVolume;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = volume;
    oscillator.connect(gain);
    gain.connect(audio.destination);

    const now = audio.currentTime;
    oscillator.start(now);
    // quick attack/decay envelope to avoid clicks
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.linearRampToValueAtTime(0.0001, now + durationMs / 1000);
    oscillator.stop(now + durationMs / 1000 + 0.01);
  };

  const playCorrect = () => {
    // respect mute
    try { if (localStorage.getItem('soundMuted') === '1') return; } catch {}
    // pleasant two-note up arpeggio
    playTone(660, 120, 'sine', 0.2);
    setTimeout(() => playTone(880, 140, 'sine', 0.18), 110);
  };

  const playIncorrect = () => {
    try { if (localStorage.getItem('soundMuted') === '1') return; } catch {}
    // short buzz down
    playTone(200, 160, 'sawtooth', 0.16);
    setTimeout(() => playTone(150, 180, 'square', 0.12), 140);
  };

  const playPass = () => {
    try { if (localStorage.getItem('soundMuted') === '1') return; } catch {}
    // short triad
    playTone(523.25, 120, 'sine', 0.18); // C5
    setTimeout(() => playTone(659.25, 120, 'sine', 0.18), 110); // E5
    setTimeout(() => playTone(783.99, 200, 'sine', 0.18), 220); // G5
  };

  const playFail = () => {
    try { if (localStorage.getItem('soundMuted') === '1') return; } catch {}
    // descending three-note
    playTone(392.00, 140, 'square', 0.16); // G4
    setTimeout(() => playTone(329.63, 160, 'square', 0.14), 140); // E4
    setTimeout(() => playTone(261.63, 220, 'square', 0.12), 300); // C4
  };

  return { playCorrect, playIncorrect, playPass, playFail };
}


