import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from '@mui/material';
import { 
  Home, 
  Warning,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import QuizQuestion from '../components/QuizQuestion';
import ProgressBar from '../components/ProgressBar';
import Timer from '../components/Timer';
import questionsData from '../data/questions.json';
import { evaluateAndUnlockAchievements } from '../components/achievements';

const Exam = () => {
  const navigate = useNavigate();
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [hasDiemLietWrong, setHasDiemLietWrong] = useState(false);
  const [examStartTime, setExamStartTime] = useState(null);

  // Support multiple exam modes via location.state
  const urlParamsMode = typeof window !== 'undefined' && window.history?.state?.usr?.mode;
  const isFullExam = urlParamsMode === 'full';
  const isWrongExam = urlParamsMode === 'wrong';
  const isSpeedExam = urlParamsMode === 'speed';

  const EXAM_DURATION = isFullExam ? 190 * 60 : isSpeedExam ? 5 * 60 : 19 * 60; // seconds
  const TOTAL_QUESTIONS = isFullExam ? questionsData.length : 25;

  // Generate random exam questions
  const generateExamQuestions = () => {
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
    const pick = (arr, n) => shuffle(arr).slice(0, Math.min(n, arr.length));

    // Wrong-only exam
    if (isWrongExam) {
      const savedWrongAnswers = JSON.parse(localStorage.getItem('wrongAnswers') || '[]');
      const wrongIds = savedWrongAnswers.map(w => w.questionId);
      const wrongQs = questionsData.filter(q => wrongIds.includes(q.id));
      return shuffle(wrongQs).slice(0, TOTAL_QUESTIONS);
    }

    // Full exam: all questions shuffled
    if (isFullExam) {
      return shuffle([...questionsData]).slice(0, TOTAL_QUESTIONS);
    }

    // Default (25-question exams): ensure 2 diem liet
    const DIEM_LIET_NEEDED = 2;
    const diemLiet = questionsData.filter(q => q.isDiemLiet);
    const nonDiemLiet = questionsData.filter(q => !q.isDiemLiet);
    const selectedDiemLiet = pick(diemLiet, DIEM_LIET_NEEDED);
    const selectedNonDiemLiet = pick(nonDiemLiet, TOTAL_QUESTIONS - selectedDiemLiet.length);
    return shuffle([...selectedDiemLiet, ...selectedNonDiemLiet]);
  };

  const startExam = () => {
    const questions = generateExamQuestions();
    setExamQuestions(questions);
    setIsExamStarted(true);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setIsExamFinished(false);
    setHasDiemLietWrong(false);
    setExamStartTime(new Date());
  };

  const handleAnswerSelect = (answerIndex) => {
    if (isExamFinished) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinishExam = () => {
    // Calculate results
    let correctCount = 0;
    let diemLietWrongCount = 0;
    const wrongAnswersList = [];
    const allAnswersList = [];

    examQuestions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      const isAnswered = userAnswer !== undefined;
      
      if (isCorrect) {
        correctCount++;
      } else if (isAnswered) {
        wrongAnswersList.push({
          questionId: question.id,
          question: question.question,
          selectedAnswer: userAnswer,
          correctAnswer: question.correctAnswer,
          isDiemLiet: question.isDiemLiet
        });
        
        if (question.isDiemLiet) {
          diemLietWrongCount++;
        }
      }

      // Add all answered questions to the list
      if (isAnswered) {
        allAnswersList.push({
          questionId: question.id,
          questionNumber: index + 1, // Add question number (1-based index)
          question: question.question,
          image: question.image,
          answers: question.answers,
          selectedAnswer: userAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect: isCorrect,
          isDiemLiet: question.isDiemLiet,
          explanation: question.explanation
        });
      }
    });

    const isPassed = correctCount >= 21 && diemLietWrongCount === 0;
    setHasDiemLietWrong(diemLietWrongCount > 0);

    // Save wrong answers to localStorage
    const existingWrongAnswers = JSON.parse(localStorage.getItem('wrongAnswers') || '[]');
    const newWrongAnswers = wrongAnswersList.map(w => ({
      questionId: w.questionId,
      selectedAnswer: w.selectedAnswer,
      correctAnswer: w.correctAnswer,
      timestamp: new Date().toISOString()
    }));
    
    const updatedWrongAnswers = [...existingWrongAnswers, ...newWrongAnswers];
    localStorage.setItem('wrongAnswers', JSON.stringify(updatedWrongAnswers));

    // Save exam history to localStorage
    const examResult = {
      timestamp: new Date().toISOString(),
      score: Math.round((correctCount / TOTAL_QUESTIONS) * 100),
      correctCount,
      wrongCount: TOTAL_QUESTIONS - correctCount,
      unansweredCount: TOTAL_QUESTIONS - Object.keys(answers).length,
      totalQuestions: TOTAL_QUESTIONS,
      isPassed,
      hasDiemLietWrong: diemLietWrongCount > 0,
      diemLietWrongCount
    };

    const existingHistory = JSON.parse(localStorage.getItem('examHistory') || '[]');
    const updatedHistory = [examResult, ...existingHistory];
    localStorage.setItem('examHistory', JSON.stringify(updatedHistory));

    // Compute duration & mode for achievements
    const finishedAt = new Date();
    const durationSeconds = examStartTime ? Math.max(0, Math.floor((finishedAt - examStartTime) / 1000)) : undefined;
    const mode = isFullExam ? 'full' : isWrongExam ? 'wrong' : isSpeedExam ? 'speed' : 'default';

    // Evaluate and unlock achievements
    const achievementResult = evaluateAndUnlockAchievements({
      isPassed,
      score: Math.round((correctCount / TOTAL_QUESTIONS) * 100),
      totalQuestions: TOTAL_QUESTIONS,
      wrongAnswers: wrongAnswersList,
      allAnswers: allAnswersList,
      mode,
      durationSeconds,
      finishedAtISOString: finishedAt.toISOString(),
      hasDiemLietWrong: diemLietWrongCount > 0,
      diemLietWrongCount
    });

    // Add newly unlocked achievements to exam result
    examResult.newAchievements = achievementResult.newlyUnlocked;

    // Navigate to result page with data
    navigate('/result', {
      state: {
        totalQuestions: TOTAL_QUESTIONS,
        correctCount,
        wrongCount: TOTAL_QUESTIONS - correctCount,
        unansweredCount: TOTAL_QUESTIONS - Object.keys(answers).length,
        wrongAnswers: wrongAnswersList,
        allAnswers: allAnswersList,
        isPassed,
        hasDiemLietWrong: diemLietWrongCount > 0,
        diemLietWrongCount,
        newlyUnlockedAchievements: achievementResult.newlyUnlocked
      }
    });
  };

  const handleTimeUp = () => {
    setIsExamFinished(true);
    handleFinishExam();
  };

  const currentQuestion = examQuestions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;

  if (!isExamStarted) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Thi thử
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<Home />}
            onClick={() => navigate('/')}
          >
            Về trang chủ
          </Button>
        </Box>

        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            {isFullExam ? 'Thi full bộ đề' : isWrongExam ? 'Thi các câu đã sai' : isSpeedExam ? 'Thi tốc độ 25 câu' : 'Bài thi thử bằng lái xe A1'}
          </Typography>
          
          <Box sx={{ my: 4 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              • Số câu hỏi: <strong>{TOTAL_QUESTIONS} câu</strong>
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              • Thời gian: <strong>{isFullExam ? '190 phút' : isSpeedExam ? '5 phút' : '19 phút'}</strong>
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              • Điểm đạt: <strong>≥ 21 câu đúng</strong>
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              • Yêu cầu: <strong>Không được sai câu điểm liệt</strong>
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Lưu ý:</strong> Bài thi sẽ tự động kết thúc khi hết thời gian. 
              Hãy đảm bảo trả lời tất cả câu hỏi trước khi hết giờ.
            </Typography>
          </Alert>

          <Button 
            variant="contained" 
            size="large"
            onClick={startExam}
            sx={{ 
              backgroundColor: 'success.main',
              '&:hover': { backgroundColor: 'success.dark' }
            }}
          >
            Bắt đầu thi
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Thi thử
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<Home />}
          onClick={() => setShowConfirmDialog(true)}
        >
          Về trang chủ
        </Button>
      </Box>

      {/* Timer */}
      <Timer 
        duration={EXAM_DURATION}
        onTimeUp={handleTimeUp}
        isRunning={!isExamFinished}
      />

      {/* Progress Bar */}
      <ProgressBar 
        current={currentQuestionIndex + 1} 
        total={examQuestions.length}
        answeredCount={answeredCount}
      />

      {/* Question */}
      {currentQuestion && (
        <QuizQuestion
          key={currentQuestionIndex}
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          isAnswered={false}
          questionNumber={currentQuestionIndex + 1}
        />
      )}

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Câu trước
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleNext}
            disabled={currentQuestionIndex === examQuestions.length - 1}
          >
            Câu tiếp
          </Button>

          <Button
            variant="contained"
            onClick={handleFinishExam}
            sx={{ backgroundColor: 'error.main' }}
          >
            Nộp bài
          </Button>
        </Box>
      </Box>

      {/* Warning for unanswered questions */}
      {answeredCount < examQuestions.length && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="body2">
            Bạn còn <strong>{examQuestions.length - answeredCount} câu</strong> chưa trả lời. 
            Hãy kiểm tra lại trước khi nộp bài.
          </Typography>
        </Alert>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <DialogTitle>Xác nhận</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn thoát khỏi bài thi? Tiến độ hiện tại sẽ bị mất.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>
            Hủy
          </Button>
          <Button 
            onClick={() => navigate('/')} 
            color="error"
            variant="contained"
          >
            Thoát
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Exam;
