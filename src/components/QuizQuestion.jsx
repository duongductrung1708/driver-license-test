import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Box,
  Chip
} from '@mui/material';
import { CheckCircle, Cancel, Warning } from '@mui/icons-material';

const QuizQuestion = ({ 
  question, 
  selectedAnswer, 
  onAnswerSelect, 
  showCorrectAnswer = false,
  isAnswered = false,
  questionNumber = null
}) => {
  const getAnswerStyle = (answerIndex) => {
    if (!isAnswered) {
      return selectedAnswer !== undefined && selectedAnswer === answerIndex ? { backgroundColor: '#e3f2fd' } : {};
    }

    if (answerIndex === question.correctAnswer) {
      return { 
        backgroundColor: '#c8e6c9', 
        border: '2px solid #4caf50' 
      };
    }

    if (selectedAnswer === answerIndex && selectedAnswer !== question.correctAnswer) {
      return { 
        backgroundColor: '#ffcdd2', 
        border: '2px solid #f44336' 
      };
    }

    return {};
  };

  const getAnswerIcon = (answerIndex) => {
    if (!isAnswered) return null;

    if (answerIndex === question.correctAnswer) {
      return <CheckCircle sx={{ color: '#4caf50', ml: 1 }} />;
    }

    if (selectedAnswer !== undefined && selectedAnswer === answerIndex && selectedAnswer !== question.correctAnswer) {
      return <Cancel sx={{ color: '#f44336', ml: 1 }} />;
    }

    return null;
  };

  return (
    <Card sx={{ mb: 3, maxWidth: '100%' }}>
      <CardContent>
        {/* Header với ID câu hỏi và badge điểm liệt */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ mr: 2 }}>
            Câu {questionNumber !== null ? questionNumber : question.id}
          </Typography>
          {question.isDiemLiet && (
            <Chip 
              icon={<Warning />}
              label="Điểm liệt" 
              color="error" 
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        {/* Nội dung câu hỏi */}
        <Typography variant="body1" sx={{ mb: 3, fontWeight: 500 }}>
          {question.question}
        </Typography>

        {/* Hình ảnh câu hỏi */}
        {question.image && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <img 
              src={question.image} 
              alt="Hình ảnh câu hỏi"
              style={{ 
                maxWidth: '100%', 
                maxHeight: '300px', 
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </Box>
        )}

        {/* Các đáp án */}
        <RadioGroup
          value={selectedAnswer !== undefined ? selectedAnswer : ''}
          onChange={(e) => onAnswerSelect(parseInt(e.target.value))}
        >
          {question.answers.map((answer, index) => (
            <FormControlLabel
              key={index}
              value={index}
              control={<Radio />}
              label={
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  width: '100%',
                  p: 1,
                  borderRadius: 1,
                  ...getAnswerStyle(index)
                }}>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {String.fromCharCode(65 + index)}. {answer}
                  </Typography>
                  {getAnswerIcon(index)}
                </Box>
              }
              sx={{ 
                width: '100%', 
                margin: 0,
                '& .MuiFormControlLabel-label': { width: '100%' }
              }}
            />
          ))}
        </RadioGroup>

        {/* Giải thích đáp án (chỉ hiển thị khi đã trả lời) */}
        {isAnswered && question.explanation && (
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            backgroundColor: '#f5f5f5', 
            borderRadius: 1,
            borderLeft: '4px solid #2196f3'
          }}>
            <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
              Giải thích:
            </Typography>
            <Typography variant="body2">
              {question.explanation}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizQuestion;
