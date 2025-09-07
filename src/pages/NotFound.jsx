import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Home as HomeIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';

const NotFound = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

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
          <ErrorIcon
            sx={{
              fontSize: 120,
              color: theme.palette.error.main,
              mb: 2,
            }}
          />
        </Box>

        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
            fontWeight: 700,
            color: theme.palette.error.main,
            mb: 2,
            textShadow: theme.palette.mode === 'dark' 
              ? '0 0 20px rgba(244, 67, 54, 0.3)'
              : 'none',
          }}
        >
          404
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
          Trang không tìm thấy
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
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. 
          Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
        </Typography>

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
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976d2 30%, #1cb5e0 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Về trang chủ
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={handleGoBack}
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
            Quay lại
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
            Mã lỗi: 404 - Not Found
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;
