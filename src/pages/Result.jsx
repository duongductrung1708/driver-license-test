import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper,
  Grid,
  Card,
  CardContent,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import { 
  Home, 
  Refresh,
  CheckCircle,
  Cancel,
  Warning,
  TrendingUp
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const resultData = location.state;

  // Redirect if no result data
  if (!resultData) {
    navigate('/');
    return null;
  }

  const {
    totalQuestions,
    correctCount,
    wrongCount,
    unansweredCount,
    wrongAnswers,
    allAnswers,
    isPassed,
    hasDiemLietWrong,
    diemLietWrongCount
  } = resultData;

  const score = Math.round((correctCount / totalQuestions) * 100);

  const getScoreColor = () => {
    if (isPassed) return 'success.main';
    if (score >= 70) return 'warning.main';
    return 'error.main';
  };

  const getScoreMessage = () => {
    if (isPassed) return 'Chúc mừng! Bạn đã đạt yêu cầu.';
    if (hasDiemLietWrong) return 'Bạn đã sai câu điểm liệt.';
    if (score >= 70) return 'Bạn cần cải thiện thêm một chút.';
    return 'Bạn cần ôn tập nhiều hơn.';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Kết quả bài thi
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<Home />}
          onClick={() => navigate('/')}
        >
          Về trang chủ
        </Button>
      </Box>

      {/* Score Summary */}
      <Paper sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h2" sx={{ 
            fontWeight: 'bold', 
            color: getScoreColor(),
            mb: 2
          }}>
            {score}%
          </Typography>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {getScoreMessage()}
          </Typography>
          <Chip 
            label={isPassed ? 'ĐẠT' : 'KHÔNG ĐẠT'} 
            color={isPassed ? 'success' : 'error'}
            size="large"
            sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {correctCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Câu đúng
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Cancel sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                {wrongCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Câu sai
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Warning sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                {unansweredCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chưa trả lời
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                {totalQuestions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng câu hỏi
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Requirements Check */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Kiểm tra yêu cầu
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {correctCount >= 21 ? (
                <CheckCircle sx={{ color: '#4caf50' }} />
              ) : (
                <Cancel sx={{ color: '#f44336' }} />
              )}
              <Typography variant="body1">
                Đúng ≥ 21 câu: {correctCount}/21
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {!hasDiemLietWrong ? (
                <CheckCircle sx={{ color: '#4caf50' }} />
              ) : (
                <Cancel sx={{ color: '#f44336' }} />
              )}
              <Typography variant="body1">
                Không sai câu điểm liệt: {hasDiemLietWrong ? 'Không đạt' : 'Đạt'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* All Answers */}
      {allAnswers && allAnswers.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Danh sách tất cả câu hỏi ({allAnswers.length} câu)
          </Typography>
          
          {hasDiemLietWrong && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Chú ý:</strong> Bạn đã sai {diemLietWrongCount} câu điểm liệt. 
                Đây là lý do chính khiến bạn không đạt bài thi.
              </Typography>
            </Alert>
          )}

          <Box sx={{ maxHeight: 600, overflowY: 'auto' }}>
            {allAnswers.map((answer, index) => (
              <Card key={index} sx={{ 
                mb: 2, 
                border: answer.isCorrect ? '1px solid #4caf50' : '1px solid #f44336',
                backgroundColor: answer.isCorrect ? 'success.50' : 'error.50'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 2 }}>
                      Câu {answer.questionNumber || answer.questionId}
                    </Typography>
                    {answer.isDiemLiet && (
                      <Chip 
                        label="Điểm liệt" 
                        color="error" 
                        size="small"
                        variant="outlined"
                      />
                    )}
                    {answer.isCorrect ? (
                      <Chip 
                        icon={<CheckCircle />}
                        label="Đúng" 
                        color="success" 
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    ) : (
                      <Chip 
                        icon={<Cancel />}
                        label="Sai" 
                        color="error" 
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                  
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                    {answer.question}
                  </Typography>

                  {/* Hình ảnh câu hỏi */}
                  {answer.image && (
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                      <img 
                        src={answer.image} 
                        alt="Hình ảnh câu hỏi"
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '200px', 
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </Box>
                  )}
                  
                  {/* Display all answers */}
                  <Box sx={{ mb: 2 }}>
                    {answer.answers.map((ans, ansIndex) => (
                      <Box 
                        key={ansIndex} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          mb: 1,
                          p: 1,
                          borderRadius: 1,
                          backgroundColor: 
                            ansIndex === answer.correctAnswer ? 'success.50' :
                            ansIndex === answer.selectedAnswer ? 'error.50' : 'background.default',
                          border: 
                            ansIndex === answer.correctAnswer ? '1px solid #4caf50' :
                            ansIndex === answer.selectedAnswer ? '1px solid #f44336' : '1px solid #e0e0e0'
                        }}
                      >
                        <Typography variant="body2" sx={{ 
                          fontWeight: 'bold', 
                          mr: 1,
                          color: 
                            ansIndex === answer.correctAnswer ? 'success.dark' :
                            ansIndex === answer.selectedAnswer ? 'error.dark' : 'inherit'
                        }}>
                          {String.fromCharCode(65 + ansIndex)}.
                        </Typography>
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {ans}
                        </Typography>
                        {ansIndex === answer.correctAnswer && (
                          <CheckCircle sx={{ color: '#4caf50', ml: 1 }} />
                        )}
                        {ansIndex === answer.selectedAnswer && !answer.isCorrect && (
                          <Cancel sx={{ color: '#f44336', ml: 1 }} />
                        )}
                      </Box>
                    ))}
                  </Box>
                  
                  {/* Answer summary */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Typography variant="body2" color={answer.isCorrect ? 'success.main' : 'error'}>
                      <strong>Bạn chọn:</strong> {String.fromCharCode(65 + answer.selectedAnswer)}
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      <strong>Đáp án đúng:</strong> {String.fromCharCode(65 + answer.correctAnswer)}
                    </Typography>
                  </Box>
                  
                  {/* Explanation */}
                  {answer.explanation && (
                    <Box sx={{ 
                      mt: 2, 
                      p: 2, 
                      backgroundColor: 'background.default', 
                      borderRadius: 1,
                      borderLeft: '4px solid #2196f3'
                    }}>
                      <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                        Giải thích:
                      </Typography>
                      <Typography variant="body2">
                        {answer.explanation}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        </Paper>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
        <Button 
          variant="contained" 
          size="large"
          startIcon={<Refresh />}
          onClick={() => navigate('/exam')}
          sx={{ 
            backgroundColor: 'primary.main',
            '&:hover': { backgroundColor: 'primary.dark' }
          }}
        >
          Thi lại
        </Button>
        
        <Button 
          variant="outlined" 
          size="large"
          onClick={() => navigate('/practice', { state: { mode: 'full' } })}
        >
          Ôn tập câu sai
        </Button>
      </Box>

      {/* Tips */}
      {!isPassed && (
        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="body2">
            <strong>Gợi ý:</strong> Hãy sử dụng chế độ "Ôn tập câu sai" để tập trung vào những câu hỏi 
            bạn đã trả lời sai. Điều này sẽ giúp bạn cải thiện kết quả trong lần thi tiếp theo.
          </Typography>
        </Alert>
      )}
    </Container>
  );
};

export default Result;
