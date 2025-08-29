import React, { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Collapse,
  Alert,
  Grid,
  Divider,
} from '@mui/material';
import {
  Search,
  Clear,
  ExpandMore,
  ExpandLess,
  Quiz,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import questionsData from '../data/questions.json';

const SearchQuestions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

  // Trích xuất từ khóa từ câu hỏi
  const extractKeywords = (question) => {
    const commonKeywords = [
      'biển báo', 'biển', 'tốc độ', 'điểm liệt', 'nồng độ cồn',
      'giao thông', 'đường bộ', 'xe mô tô', 'xe gắn máy',
      'quy tắc', 'luật giao thông', 'vi phạm', 'cấm',
      'được phép', 'không được', 'bắt buộc', 'báo hiệu',
      'quay đầu', 'rẽ trái', 'rẽ phải', 'dừng xe', 'đỗ xe',
      'vượt xe', 'làn đường', 'ưu tiên', 'giao nhau'
    ];
    
    const foundKeywords = commonKeywords.filter(keyword => 
      question.toLowerCase().includes(keyword.toLowerCase())
    );
    
    return foundKeywords.length > 0 ? foundKeywords : ['Khác'];
  };

  // Tìm kiếm câu hỏi dựa trên từ khóa
  const filteredQuestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const searchLower = searchTerm.toLowerCase();
    return questionsData.filter(question => {
      // Tìm kiếm trong câu hỏi
      if (question.question.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Tìm kiếm trong các đáp án
      if (question.answers.some(answer => 
        answer.toLowerCase().includes(searchLower)
      )) {
        return true;
      }
      
      // Tìm kiếm trong giải thích
      if (question.explanation && 
          question.explanation.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      return false;
    });
  }, [searchTerm]);

  // Nhóm câu hỏi theo chủ đề (dựa trên từ khóa chung)
  const groupedQuestions = useMemo(() => {
    if (filteredQuestions.length === 0) return [];
    
    const groups = {};
    
    filteredQuestions.forEach(question => {
      // Tìm từ khóa chính trong câu hỏi
      const keywords = extractKeywords(question.question);
      const mainKeyword = keywords[0] || 'Khác';
      
      if (!groups[mainKeyword]) {
        groups[mainKeyword] = [];
      }
      groups[mainKeyword].push(question);
    });
    
    return Object.entries(groups).map(([keyword, questions]) => ({
      keyword,
      questions,
      count: questions.length
    }));
  }, [filteredQuestions]);

  const toggleQuestionExpansion = (questionId) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const startPracticeWithQuestions = (questions) => {
    const questionIds = questions.map(q => q.id);
    navigate('/practice', { 
      state: { 
        mode: 'custom',
        questionIds,
        searchTerm 
      } 
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
    setExpandedQuestions(new Set());
  };

  return (
    <Paper sx={{ p: 3, mb: 4, backgroundColor: 'background.default' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        🔍 Tìm kiếm câu hỏi theo từ khóa
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Nhập từ khóa tìm kiếm (ví dụ: biển báo, tốc độ, nồng độ cồn...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="primary" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={clearSearch} size="small">
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        
        {searchTerm && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Tìm thấy {filteredQuestions.length} câu hỏi liên quan
            </Typography>
            {filteredQuestions.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={`${filteredQuestions.filter(q => q.isDiemLiet).length} điểm liệt`} 
                  size="small" 
                  color="error" 
                  variant="outlined"
                />
                <Chip 
                  label={`${filteredQuestions.filter(q => !q.isDiemLiet).length} thường`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
              </Box>
            )}
          </Box>
        )}
        
        {!searchTerm && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Gợi ý từ khóa tìm kiếm:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {[
                'biển báo', 'tốc độ', 'nồng độ cồn', 'điểm liệt', 'giao thông',
                'xe mô tô', 'quy tắc', 'vi phạm', 'cấm', 'được phép',
                'báo hiệu', 'đường bộ', 'xe gắn máy', 'bắt buộc',
                'quay đầu', 'rẽ trái', 'rẽ phải', 'dừng xe', 'đỗ xe',
                'vượt xe', 'làn đường', 'ưu tiên', 'giao nhau'
              ].map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  size="small"
                  variant="outlined"
                  onClick={() => setSearchTerm(keyword)}
                  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {searchTerm && (
        <Collapse in={true}>
          {filteredQuestions.length === 0 ? (
            <Alert severity="info">
              <Typography variant="body2">
                Không tìm thấy câu hỏi nào phù hợp với từ khóa "{searchTerm}". 
                Hãy thử từ khóa khác hoặc kiểm tra chính tả.
              </Typography>
            </Alert>
          ) : (
            <Box>
              {groupedQuestions.map((group, groupIndex) => (
                <Card key={groupIndex} sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mb: 2 
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {group.keyword}
                        </Typography>
                        <Chip 
                          label={`${group.count} câu`} 
                          size="small" 
                          color="primary" 
                        />
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => startPracticeWithQuestions(group.questions)}
                        startIcon={<Quiz />}
                      >
                        Ôn tập nhóm này
                      </Button>
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                                         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                       {group.questions.map((question, index) => (
                         <Card key={question.id} variant="outlined" sx={{ 
                           borderColor: question.isDiemLiet ? 'error.main' : 'divider',
                           backgroundColor: question.isDiemLiet ? 'error.light' : 'background.paper',
                           width: '100%'
                         }}>
                           <CardContent sx={{ py: 2, px: 2 }}>
                             <Box sx={{ 
                               display: 'flex', 
                               justifyContent: 'space-between', 
                               alignItems: 'flex-start',
                               mb: 1
                             }}>
                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                                 <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                   Câu {question.id}
                                 </Typography>
                                 {question.isDiemLiet && (
                                   <Chip 
                                     label="Điểm liệt" 
                                     size="small" 
                                     color="error" 
                                     icon={<Warning />}
                                   />
                                 )}
                               </Box>
                               <IconButton
                                 size="small"
                                 onClick={() => toggleQuestionExpansion(question.id)}
                               >
                                 {expandedQuestions.has(question.id) ? 
                                   <ExpandLess /> : <ExpandMore />
                                 }
                               </IconButton>
                             </Box>
                             
                             <Typography variant="body2" sx={{ mb: 1 }}>
                               {question.question}
                             </Typography>
                             
                             {question.image && (
                               <Box sx={{ mb: 1 }}>
                                 <img 
                                   src={question.image} 
                                   alt="Câu hỏi"
                                   style={{ 
                                     maxWidth: '100%', 
                                     maxHeight: 150,
                                     borderRadius: 4
                                   }}
                                 />
                               </Box>
                             )}
                             
                             <Collapse in={expandedQuestions.has(question.id)}>
                               <Box sx={{ mt: 2 }}>
                                 <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                   Các đáp án:
                                 </Typography>
                                 {question.answers.map((answer, answerIndex) => (
                                   <Box 
                                     key={answerIndex}
                                     sx={{ 
                                       display: 'flex', 
                                       alignItems: 'center', 
                                       gap: 1,
                                       mb: 0.5,
                                       p: 1,
                                       borderRadius: 1,
                                       backgroundColor: answerIndex === question.correctAnswer ? 
                                         'success.light' : 'background.default',
                                       border: answerIndex === question.correctAnswer ? 
                                         '1px solid' : '1px solid transparent',
                                       borderColor: answerIndex === question.correctAnswer ? 
                                         'success.main' : 'transparent'
                                     }}
                                   >
                                     {answerIndex === question.correctAnswer && (
                                       <CheckCircle color="success" fontSize="small" />
                                     )}
                                     <Typography variant="body2">
                                       {String.fromCharCode(65 + answerIndex)}. {answer}
                                     </Typography>
                                   </Box>
                                 ))}
                                 
                                 {question.explanation && (
                                   <Box sx={{ mt: 2 }}>
                                     <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                       Giải thích:
                                     </Typography>
                                     <Typography variant="body2" color="text.secondary">
                                       {question.explanation}
                                     </Typography>
                                   </Box>
                                 )}
                               </Box>
                             </Collapse>
                           </CardContent>
                         </Card>
                       ))}
                     </Box>
                  </CardContent>
                </Card>
              ))}
              
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => startPracticeWithQuestions(filteredQuestions)}
                  startIcon={<Quiz />}
                  sx={{ minWidth: 200 }}
                >
                  Ôn tập tất cả ({filteredQuestions.length} câu)
                </Button>
              </Box>
            </Box>
          )}
        </Collapse>
      )}
    </Paper>
  );
};

export default SearchQuestions;
