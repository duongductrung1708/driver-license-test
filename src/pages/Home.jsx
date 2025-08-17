import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Box,
  Grid,
  Paper,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import { 
  School, 
  Quiz, 
  DirectionsCar,
  Speed,
  Warning,
  CheckCircle,
  History,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [examHistory, setExamHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load exam history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('examHistory') || '[]');
    setExamHistory(history);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 84) return '#4caf50'; // >= 21/25
    if (score >= 70) return '#ff9800';
    return '#f44336';
  };

  const features = [
    {
      icon: <School sx={{ fontSize: 40, color: '#2196f3' }} />,
      title: 'Ôn tập 25 câu',
      description: 'Ôn tập với 25 câu hỏi ngẫu nhiên',
      action: () => navigate('/practice', { state: { mode: 'random' } })
    },
    {
      icon: <School sx={{ fontSize: 40, color: '#ff9800' }} />,
      title: 'Ôn tập toàn bộ',
      description: 'Ôn tập toàn bộ 250 câu hỏi',
      action: () => navigate('/practice', { state: { mode: 'full' } })
    },
    {
      icon: <Quiz sx={{ fontSize: 40, color: '#4caf50' }} />,
      title: 'Thi thử',
      description: 'Làm bài thi 25 câu trong 19 phút',
      action: () => navigate('/exam')
    }
  ];

  const examInfo = [
    {
      icon: <Speed sx={{ fontSize: 24, color: '#ff9800' }} />,
      text: 'Thời gian: 19 phút'
    },
    {
      icon: <Quiz sx={{ fontSize: 24, color: '#2196f3' }} />,
      text: 'Số câu: 25 câu'
    },
    {
      icon: <CheckCircle sx={{ fontSize: 24, color: '#4caf50' }} />,
      text: 'Điểm đạt: ≥ 21 câu đúng'
    },
    {
      icon: <Warning sx={{ fontSize: 24, color: '#f44336' }} />,
      text: 'Không được sai câu điểm liệt'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <DirectionsCar sx={{ fontSize: 80, color: '#2196f3', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Ôn Thi Bằng Lái Xe A1
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Hệ thống ôn tập và thi thử bằng lái xe máy A1 với 14 câu hỏi mẫu
        </Typography>
      </Box>

      {/* Thông tin kỳ thi */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Thông tin kỳ thi
        </Typography>
        <Grid container spacing={2}>
          {examInfo.map((info, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {info.icon}
                <Typography variant="body1">{info.text}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Các chế độ học */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={feature.action}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {feature.description}
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={feature.action}
                  sx={{ 
                    minWidth: 120,
                    backgroundColor: 
                      index === 0 ? '#2196f3' : 
                      index === 1 ? '#ff9800' : '#4caf50',
                    '&:hover': {
                      backgroundColor: 
                        index === 0 ? '#1976d2' : 
                        index === 1 ? '#f57c00' : '#388e3c'
                    }
                  }}
                >
                  Bắt đầu
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Thống kê */}
      <Paper sx={{ p: 3, backgroundColor: '#e3f2fd', mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Thống kê bộ câu hỏi
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                250
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số câu hỏi
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                20
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Câu điểm liệt
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                230
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Câu thường
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Lịch sử thi thử */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Lịch sử thi thử
          </Typography>
          <Button
            variant="outlined"
            startIcon={<History />}
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? 'Ẩn lịch sử' : 'Xem lịch sử'}
          </Button>
        </Box>

        {showHistory && (
          <>
            {examHistory.length === 0 ? (
              <Alert severity="info">
                <Typography variant="body2">
                  Bạn chưa có lịch sử thi thử nào. Hãy bắt đầu thi thử để xem kết quả ở đây!
                </Typography>
              </Alert>
            ) : (
              <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {examHistory.slice(0, 10).map((exam, index) => (
                  <Card key={index} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          Lần thi #{examHistory.length - index}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(exam.timestamp)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 'bold', 
                            color: getScoreColor(exam.score)
                          }}
                        >
                          {exam.score}%
                        </Typography>
                        <Chip 
                          label={exam.isPassed ? 'ĐẠT' : 'KHÔNG ĐẠT'} 
                          color={exam.isPassed ? 'success' : 'error'}
                          size="small"
                        />
                        {exam.hasDiemLietWrong && (
                          <Chip 
                            label="Sai điểm liệt" 
                            color="error"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                              {exam.correctCount}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Câu đúng
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                              {exam.wrongCount}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Câu sai
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                              {exam.unansweredCount}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Chưa trả lời
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                              {exam.totalQuestions}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Tổng câu
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Home;
