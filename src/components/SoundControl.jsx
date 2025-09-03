import React, { useState } from 'react';
import { Box, IconButton, Slider, Paper, Tooltip } from '@mui/material';
import { VolumeUp, VolumeOff } from '@mui/icons-material';
import { useSound } from '../context/SoundContext';

const SoundControl = () => {
  const [open, setOpen] = useState(false);
  const { volume, muted, updateVolume, toggleMute } = useSound();

  const handleVolumeChange = (_, value) => {
    const newVolume = Array.isArray(value) ? value[0] : value;
    updateVolume(newVolume);
  };

  const handleMuteToggle = () => {
    toggleMute();
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 12, right: 12, zIndex: 1300 }}>
      <Paper sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 0.5, borderRadius: 2 }} elevation={6}>
        <Tooltip title={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}>
          <IconButton onClick={handleMuteToggle} size="small">
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
          size="small"
          sx={{ width: 96, mx: 0.5 }}
        />
      </Paper>
    </Box>
  );
};

export default SoundControl;


