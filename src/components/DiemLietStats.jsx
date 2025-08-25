import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  LinearProgress, 
  Chip,
  Grid
} from '@mui/material';
import { 
  Warning, 
  CheckCircle, 
  Cancel,
  TrendingUp
} from '@mui/icons-material';

const DiemLietStats = ({ totalDiemLiet, answeredDiemLiet, correctDiemLiet, wrongDiemLiet }) => {
  const progress = totalDiemLiet > 0 ? (answeredDiemLiet / totalDiemLiet) * 100 : 0;
  const accuracy = answeredDiemLiet > 0 ? (correctDiemLiet / answeredDiemLiet) * 100 : 0;

  return (
    <Paper sx={{ p: 3, mb: 3, backgroundColor: 'error.50', border: '2px solid', borderColor: 'error.main' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Warning sx={{ fontSize: 32, color: 'error.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.main' }}>
          Thống kê câu điểm liệt
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
              {totalDiemLiet}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng câu điểm liệt
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {answeredDiemLiet}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đã học
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
              {correctDiemLiet}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đúng
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
              {wrongDiemLiet}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sai
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Tiến độ học tập
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progress)}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: 'error.100',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'error.main',
              borderRadius: 4
            }
          }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Tỷ lệ đúng
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(accuracy)}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={accuracy} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: 'success.100',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'success.main',
              borderRadius: 4
            }
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip 
          icon={<TrendingUp />}
          label={`${totalDiemLiet - answeredDiemLiet} câu chưa học`}
          color="warning"
          variant="outlined"
        />
        {wrongDiemLiet > 0 && (
          <Chip 
            icon={<Cancel />}
            label={`${wrongDiemLiet} câu cần ôn lại`}
            color="error"
            variant="outlined"
          />
        )}
        {accuracy >= 90 && (
          <Chip 
            icon={<CheckCircle />}
            label="Xuất sắc!"
            color="success"
          />
        )}
      </Box>
    </Paper>
  );
};

export default DiemLietStats;
