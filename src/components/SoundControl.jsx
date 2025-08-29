import React, { useEffect, useState } from 'react';
import { Box, IconButton, Slider, Paper, Tooltip } from '@mui/material';
import { VolumeUp, VolumeOff } from '@mui/icons-material';

const SoundControl = () => {
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('soundVolume');
      if (raw !== null) {
        const parsed = parseFloat(raw);
        if (!Number.isNaN(parsed)) setVolume(Math.max(0, Math.min(1, parsed)));
      }
      const m = localStorage.getItem('soundMuted');
      if (m === '1') setMuted(true);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (muted) {
        localStorage.setItem('soundMuted', '1');
      } else {
        localStorage.removeItem('soundMuted');
      }
    } catch {}
  }, [muted]);

  const handleVolumeChange = (_, value) => {
    const v = Array.isArray(value) ? value[0] : value;
    setVolume(v);
    try {
      localStorage.setItem('soundVolume', String(v));
    } catch {}
  };

  const toggleMute = () => {
    setMuted((m) => !m);
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1300 }}>
      <Paper sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }} elevation={6}>
        <Tooltip title={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}>
          <IconButton onClick={toggleMute} size="small">
            {muted ? <VolumeOff /> : <VolumeUp />}
          </IconButton>
        </Tooltip>
        <Slider
          aria-label="Âm lượng"
          value={muted ? 0 : volume}
          min={0}
          max={1}
          step={0.05}
          onChange={handleVolumeChange}
          sx={{ width: 140 }}
        />
      </Paper>
    </Box>
  );
};

export default SoundControl;


