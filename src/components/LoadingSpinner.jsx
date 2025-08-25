import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Đang tải...', size = 40 }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: 2,
      }}
      className="fade-in"
    >
      <CircularProgress 
        size={size} 
        className="spin-animation"
        sx={{
          color: 'primary.main',
        }}
      />
      {message && (
        <Typography 
          variant="body2" 
          color="text.secondary"
          className="slide-in-left"
          style={{ animationDelay: '0.2s' }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;
