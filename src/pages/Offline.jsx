import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  useTheme,
  LinearProgress,
  Fade,
} from '@mui/material';
import {
  WifiOff as WifiOffIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const Offline = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isChecking, setIsChecking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/');
      }, 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowSuccess(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigate]);

  const handleRetry = async () => {
    setIsChecking(true);
    
    // Simulate network check
    try {
      const response = await fetch(window.location.origin, {
        method: 'HEAD',
        cache: 'no-cache',
      });
      
      if (response.ok) {
        setIsOnline(true);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      setIsOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (showSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
              : 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
          }}
        >
          <Fade in={showSuccess} timeout={1000}>
            <Box>
              <CheckCircleIcon
                sx={{
                  fontSize: 120,
                  color: theme.palette.success.main,
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  mb: 2,
                  color: theme.palette.success.main,
                  fontWeight: 600,
                }}
              >
                Kết nối đã được khôi phục!
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '1.1rem',
                }}
              >
                Đang chuyển hướng về trang chủ...
              </Typography>
            </Box>
          </Fade>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 3,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
            : 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <WifiOffIcon
            sx={{
              fontSize: 120,
              color: theme.palette.warning.main,
              mb: 2,
            }}
          />
        </Box>

        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
            fontWeight: 700,
            color: theme.palette.warning.main,
            mb: 2,
            textShadow: theme.palette.mode === 'dark' 
              ? '0 0 20px rgba(255, 152, 0, 0.3)'
              : 'none',
          }}
        >
          Mất kết nối
        </Typography>

        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: 2,
            color: theme.palette.text.primary,
            fontWeight: 600,
          }}
        >
          Không có kết nối internet
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: theme.palette.text.secondary,
            fontSize: '1.1rem',
            maxWidth: '500px',
            mx: 'auto',
            lineHeight: 1.6,
          }}
        >
          Vui lòng kiểm tra kết nối internet của bạn và thử lại. 
          Ứng dụng sẽ tự động kết nối lại khi có mạng.
        </Typography>

        {isChecking && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="body2"
              sx={{ mb: 2, color: theme.palette.text.secondary }}
            >
              Đang kiểm tra kết nối...
            </Typography>
            <LinearProgress
              sx={{
                height: 6,
                borderRadius: 3,
                maxWidth: 300,
                mx: 'auto',
              }}
            />
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            flexWrap: 'wrap',
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<RefreshIcon />}
            onClick={handleRetry}
            disabled={isChecking}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #f57c00 30%, #ff9800 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(255, 152, 0, 0.4)',
              },
              '&:disabled': {
                background: theme.palette.action.disabledBackground,
                color: theme.palette.action.disabled,
              },
              transition: 'all 0.3s ease',
            }}
          >
            {isChecking ? 'Đang kiểm tra...' : 'Thử lại'}
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Về trang chủ
          </Button>
        </Box>

        <Box sx={{ mt: 6 }}>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.disabled,
              fontStyle: 'italic',
            }}
          >
            Trạng thái: {isOnline ? 'Đã kết nối' : 'Mất kết nối'}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Offline;
