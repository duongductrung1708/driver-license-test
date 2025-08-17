import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Alert,
  Paper
} from '@mui/material';
import { 
  NavigateBefore, 
  NavigateNext, 
  Home,
  FilterList
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import QuizQuestion from '../components/QuizQuestion';
import ProgressBar from '../components/ProgressBar';
import questionsData from '../data/questions.json';

const Practice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const practiceMode = location.state?.mode || 'full'; // Default to full mode
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [filter, setFilter] = useState('all');
  const [filteredQuestions, setFilteredQuestions] = useState(questionsData);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  // Load wrong answers from localStorage
  useEffect(() => {
    const savedWrongAnswers = localStorage.getItem('wrongAnswers');
    if (savedWrongAnswers) {
      setWrongAnswers(JSON.parse(savedWrongAnswers));
    }
  }, []);

  // Filter questions based on selected filter and practice mode
  useEffect(() => {
    let filtered = questionsData;
    
    // Apply practice mode filter first
    if (practiceMode === 'random') {
      // For random mode, select 25 random questions
      const shuffled = [...questionsData].sort(() => 0.5 - Math.random());
      filtered = shuffled.slice(0, 25);
    }
    
    // Then apply additional filters
    switch (filter) {
      case 'diemLiet':
        filtered = filtered.filter(q => q.isDiemLiet);
        break;
      case 'wrong':
        const wrongQuestionIds = wrongAnswers.map(w => w.questionId);
        filtered = filtered.filter(q => wrongQuestionIds.includes(q.id));
        break;
      default:
        // Keep the current filtered questions
        break;
    }
    
    setFilteredQuestions(filtered);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [filter, practiceMode]); // Removed wrongAnswers from dependencies

  // Separate effect to handle wrongAnswers changes only when in wrong filter mode
  useEffect(() => {
    if (filter === 'wrong') {
      const wrongQuestionIds = wrongAnswers.map(w => w.questionId);
      const filtered = questionsData.filter(q => wrongQuestionIds.includes(q.id));
      setFilteredQuestions(filtered);
      
      // Only reset if current question index is out of bounds
      if (currentQuestionIndex >= filtered.length) {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
      }
    }
  }, [wrongAnswers, filter, currentQuestionIndex]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex) => {
    if (isAnswered) return;
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setIsAnswered(true);
    
    // Save wrong answer to localStorage
    if (selectedAnswer !== currentQuestion.correctAnswer) {
      const newWrongAnswer = {
        questionId: currentQuestion.id,
        selectedAnswer: selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        timestamp: new Date().toISOString()
      };
      
      const updatedWrongAnswers = [...wrongAnswers, newWrongAnswer];
      setWrongAnswers(updatedWrongAnswers);
      localStorage.setItem('wrongAnswers', JSON.stringify(updatedWrongAnswers));
    }
  };

  const getAnsweredCount = () => {
    // Count questions that have been answered in current session
    return 1; // For practice mode, we only track current question
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          {practiceMode === 'random' ? 'Ôn tập 25 câu' : 'Ôn tập full'}
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<Home />}
          onClick={() => navigate('/')}
        >
          Về trang chủ
        </Button>
      </Box>

      {/* Practice Mode Info */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: '#e3f2fd' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {practiceMode === 'random' 
              ? 'Chế độ ôn tập với 25 câu hỏi ngẫu nhiên từ bộ đề'
              : 'Chế độ ôn tập toàn bộ 250 câu hỏi'
            }
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate('/practice', { 
              state: { mode: practiceMode === 'random' ? 'full' : 'random' } 
            })}
          >
            Chuyển sang {practiceMode === 'random' ? 'Ôn tập full' : 'Ôn tập 25 câu'}
          </Button>
        </Box>
      </Paper>

      {/* Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FilterList />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Bộ lọc</InputLabel>
            <Select
              value={filter}
              label="Bộ lọc"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">
                Tất cả câu hỏi ({practiceMode === 'random' ? '25 câu ngẫu nhiên' : questionsData.length})
              </MenuItem>
              <MenuItem value="diemLiet">
                Chỉ câu điểm liệt ({practiceMode === 'random' ? 'Trong 25 câu' : questionsData.filter(q => q.isDiemLiet).length})
              </MenuItem>
              <MenuItem value="wrong">
                Câu đã sai trước đó ({wrongAnswers.length})
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Progress Bar */}
      <ProgressBar 
        current={currentQuestionIndex + 1} 
        total={filteredQuestions.length}
        answeredCount={getAnsweredCount()}
      />

      {/* Question */}
      {currentQuestion && (
        <QuizQuestion
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          isAnswered={isAnswered}
          questionNumber={currentQuestionIndex + 1}
        />
      )}

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          startIcon={<NavigateBefore />}
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Câu trước
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {!isAnswered && selectedAnswer !== null && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ backgroundColor: '#4caf50' }}
            >
              Kiểm tra đáp án
            </Button>
          )}
          
          {isAnswered && (
            <Button
              variant="contained"
              endIcon={<NavigateNext />}
              onClick={handleNext}
              disabled={currentQuestionIndex === filteredQuestions.length - 1}
            >
              Câu tiếp
            </Button>
          )}
        </Box>
      </Box>

      {/* Info */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Hướng dẫn:</strong> Chọn đáp án và nhấn "Kiểm tra đáp án" để xem kết quả. 
          Sau đó bạn có thể chuyển sang câu tiếp theo hoặc câu trước đó.
          {practiceMode === 'random' && ' Trong chế độ ôn tập 25 câu, các câu hỏi được chọn ngẫu nhiên từ bộ đề.'}
        </Typography>
      </Alert>

      {/* Empty state for wrong answers filter */}
      {filter === 'wrong' && wrongAnswers.length === 0 && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="body2">
            Bạn chưa có câu hỏi nào sai. Hãy làm bài thi thử để tạo danh sách câu sai.
          </Typography>
        </Alert>
      )}
    </Container>
  );
};

export default Practice;
