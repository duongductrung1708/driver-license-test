import React, { useState, useEffect } from "react";
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
  Alert,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import {
  School,
  Quiz,
  DirectionsBike,
  Speed,
  Warning,
  CheckCircle,
  History,
  Delete,
  Download,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import questionsData from "../data/questions.json";
import { ACHIEVEMENT_META, getUnlockedAchievements, getCurrentStreak } from "../components/achievements";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import SearchQuestions from "../components/SearchQuestions";
import ExamGoalSetter from "../components/ExamGoalSetter";
import AchievementNotification from "../components/AchievementNotification";
import SoundControl from "../components/SoundControl";
import { useSound } from "../context/SoundContext";

const Home = () => {
  const navigate = useNavigate();
  const { playClickSound, playSuccessSound } = useSound();
  const [examHistory, setExamHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [streakCount, setStreakCount] = useState(0);
  const [newAchievement, setNewAchievement] = useState(null);
  const [wrongCount, setWrongCount] = useState(0);

  // Load exam history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("examHistory") || "[]");
    setExamHistory(history);
    setUnlockedAchievements(getUnlockedAchievements());
    setStreakCount(getCurrentStreak());
    const savedWrong = JSON.parse(localStorage.getItem("wrongAnswers") || "[]");
    setWrongCount(Array.isArray(savedWrong) ? savedWrong.length : 0);
  }, []);

  // Check for new achievements from exam history
  useEffect(() => {
    if (examHistory.length > 0) {
      const latestExam = examHistory[0]; // Most recent exam
      if (latestExam.newAchievements && latestExam.newAchievements.length > 0) {
        // Show the first new achievement
        setNewAchievement(latestExam.newAchievements[0]);
        // Remove the newAchievements flag to prevent showing again
        const updatedHistory = examHistory.map((exam, index) => 
          index === 0 ? { ...exam, newAchievements: undefined } : exam
        );
        localStorage.setItem("examHistory", JSON.stringify(updatedHistory));
        setExamHistory(updatedHistory);
      }
    }
  }, [examHistory]);

  const handleAchievementClose = () => {
    setNewAchievement(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (score) => {
    if (score >= 84) return "success.main"; // >= 21/25
    if (score >= 70) return "warning.main";
    return "error.main";
  };

  const handleClearHistory = () => {
    if (examHistory.length === 0) return;
    playClickSound();
    const confirmClear = window.confirm(
      "Bạn có chắc muốn xóa toàn bộ lịch sử thi?"
    );
    if (!confirmClear) return;
    localStorage.removeItem("examHistory");
    setExamHistory([]);
    playSuccessSound();
  };

  // Hàm tạo và tải về PDF 20 câu điểm liệt
  const handleDownloadDiemLiet = () => {
    playClickSound();
    const diemLietQuestions = questionsData.filter(q => q.isDiemLiet === true);
    
    const doc = new jsPDF();
    
    // Thiết lập font mặc định (có hỗ trợ Unicode tốt hơn)
    doc.setFont('helvetica');
    
    // Tiêu đề
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    const titleText = '20 CAU DIEM LIET - THI BANG LAI XE';
    const titleLines = doc.splitTextToSize(titleText, 180);
    doc.text(titleLines, 105, 20, { align: 'center' });
    
    // Cảnh báo
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(255, 0, 0);
    const warningText = 'CANH BAO: Sai 1 cau diem liet = Truot ngay lap tuc!';
    const warningLines = doc.splitTextToSize(warningText, 180);
    doc.text(warningLines, 105, 30, { align: 'center' });
    
    let yPosition = 40;
    doc.setTextColor(0, 0, 0);
    
    diemLietQuestions.forEach((question, index) => {
      // Kiểm tra nếu cần thêm trang mới
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Số câu hỏi
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      const questionText = `${index + 1}. ${question.question}`;
      const questionLines = doc.splitTextToSize(questionText, 160);
      doc.text(questionLines, 20, yPosition);
      yPosition += questionLines.length * 6 + 5;
      
      // Hình ảnh (nếu có)
      if (question.image) {
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(100, 100, 100);
        const imageText = `[Hinh anh: ${question.image}]`;
        const imageLines = doc.splitTextToSize(imageText, 160);
        doc.text(imageLines, 25, yPosition);
        yPosition += imageLines.length * 5 + 3;
      }
      
      // Các đáp án
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0);
      question.answers.forEach((answer, ansIndex) => {
        const marker = ansIndex === question.correctAnswer ? "✓" : "○";
        const answerText = `${marker} ${answer}`;
        const answerLines = doc.splitTextToSize(answerText, 150);
        const color = ansIndex === question.correctAnswer ? [0, 128, 0] : [0, 0, 0];
        doc.setTextColor(...color);
        doc.text(answerLines, 30, yPosition);
        yPosition += answerLines.length * 5 + 3;
      });
      
      // Giải thích
      doc.setTextColor(0, 0, 128);
      const explanationText = `Giai thich: ${question.explanation}`;
      const explanationLines = doc.splitTextToSize(explanationText, 150);
      doc.text(explanationLines, 25, yPosition);
      yPosition += explanationLines.length * 5 + 8;
    });
    
    doc.save('20-cau-diem-liet.pdf');
    playSuccessSound();
  };

  // Hàm tạo và tải về PDF 250 câu hỏi
  const handleDownloadFullQuestions = () => {
    playClickSound();
    const doc = new jsPDF();
    
    // Thiết lập font mặc định (có hỗ trợ Unicode tốt hơn)
    doc.setFont('helvetica');
    
    // Tiêu đề
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    const titleText = 'BO DE 250 CAU HOI THI BANG LAI XE';
    const titleLines = doc.splitTextToSize(titleText, 180);
    doc.text(titleLines, 105, 20, { align: 'center' });
    
    let yPosition = 35;
    doc.setTextColor(0, 0, 0);
    
    questionsData.forEach((question, index) => {
      // Kiểm tra nếu cần thêm trang mới
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Số câu hỏi và nội dung
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      const diemLietMarker = question.isDiemLiet ? " [DIEM LIET]" : "";
      const questionText = `${index + 1}. ${question.question}${diemLietMarker}`;
      const questionLines = doc.splitTextToSize(questionText, 160);
      doc.text(questionLines, 20, yPosition);
      yPosition += questionLines.length * 6 + 5;
      
      // Hình ảnh (nếu có)
      if (question.image) {
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(100, 100, 100);
        const imageText = `[Hinh anh: ${question.image}]`;
        const imageLines = doc.splitTextToSize(imageText, 160);
        doc.text(imageLines, 25, yPosition);
        yPosition += imageLines.length * 5 + 3;
      }
      
      // Các đáp án
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0);
      question.answers.forEach((answer, ansIndex) => {
        const marker = ansIndex === question.correctAnswer ? "✓" : "○";
        const answerText = `${marker} ${answer}`;
        const answerLines = doc.splitTextToSize(answerText, 150);
        const color = ansIndex === question.correctAnswer ? [0, 128, 0] : [0, 0, 0];
        doc.setTextColor(...color);
        doc.text(answerLines, 30, yPosition);
        yPosition += answerLines.length * 5 + 3;
      });
      
      // Giải thích
      doc.setTextColor(0, 0, 128);
      const explanationText = `Giai thich: ${question.explanation}`;
      const explanationLines = doc.splitTextToSize(explanationText, 150);
      doc.text(explanationLines, 25, yPosition);
      yPosition += explanationLines.length * 5 + 8;
    });
    
    doc.save('250-cau-hoi-thi-bang-lai.pdf');
    playSuccessSound();
  };



  const features = [
    {
      icon: <School sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Ôn tập 25 câu",
      description: "Ôn tập với 25 câu hỏi ngẫu nhiên",
      action: () => {
        playClickSound();
        navigate("/practice", { state: { mode: "random" } });
      },
      buttonColor: 'primary',
    },
    {
      icon: <School sx={{ fontSize: 40, color: "warning.main" }} />,
      title: "Ôn tập toàn bộ",
      description: "Ôn tập toàn bộ 250 câu hỏi",
      action: () => {
        playClickSound();
        navigate("/practice", { state: { mode: "full" } });
      },
      buttonColor: 'warning',
    },
    {
      icon: <History sx={{ fontSize: 40, color: "secondary.main" }} />,
      title: `Ôn tập các câu sai (${wrongCount})`,
      description: wrongCount > 0 
        ? "Luyện tập lại những câu bạn đã làm sai"
        : "Bạn chưa có câu hỏi nào sai. Hãy làm bài thi thử trước.",
      action: () => {
        playClickSound();
        navigate("/practice", { state: { mode: "wrong" } });
      },
      buttonColor: 'secondary',
      disabled: wrongCount === 0,
    },
    {
      icon: <Warning sx={{ fontSize: 40, color: "error.main" }} />,
      title: "Học câu điểm liệt",
      description: "Ôn tập 20 câu điểm liệt quan trọng",
      action: () => {
        playClickSound();
        navigate("/practice", { state: { mode: "diemLiet" } });
      },
      buttonColor: 'error',
    },
    {
      icon: <Quiz sx={{ fontSize: 40, color: "success.main" }} />,
      title: "Thi thử",
      description: "Làm bài thi 25 câu trong 19 phút",
      action: () => {
        playClickSound();
        navigate("/exam");
      },
      buttonColor: 'success',
    },
    {
      icon: <Quiz sx={{ fontSize: 40, color: "info.main" }} />,
      title: "Thi full bộ đề",
      description: "Thi toàn bộ câu hỏi trong 190 phút",
      action: () => {
        playClickSound();
        navigate("/exam", { state: { mode: "full" } });
      },
      buttonColor: 'info',
    },
    {
      icon: <Quiz sx={{ fontSize: 40, color: "secondary.main" }} />,
      title: `Thi các câu đã sai (${wrongCount})`,
      description: wrongCount > 0 
        ? "Thi lại dựa trên danh sách câu sai"
        : "Bạn chưa có câu hỏi nào sai. Hãy làm bài thi thử trước.",
      action: () => {
        playClickSound();
        navigate("/exam", { state: { mode: "wrong" } });
      },
      buttonColor: 'secondary',
      disabled: wrongCount === 0,
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: "warning.main" }} />,
      title: "Thi tốc độ 5 phút",
      description: "25 câu trong 5 phút (tốc độ)",
      action: () => {
        playClickSound();
        navigate("/exam", { state: { mode: "speed" } });
      },
      buttonColor: 'warning',
    },
  ];

  const examInfo = [
    {
      icon: <Speed sx={{ fontSize: 24, color: "warning.main" }} />,
      text: "Thời gian: 19 phút",
    },
    {
      icon: <Quiz sx={{ fontSize: 24, color: "primary.main" }} />,
      text: "Số câu: 25 câu",
    },
    {
      icon: <CheckCircle sx={{ fontSize: 24, color: "success.main" }} />,
      text: "Điểm đạt: ≥ 21 câu đúng",
    },
    {
      icon: <Warning sx={{ fontSize: 24, color: "error.main" }} />,
      text: "Không được sai câu điểm liệt",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <DirectionsBike
          className="icon-scale bounce-animation"
          sx={{ fontSize: 80, color: "primary.main", mb: 2 }}
        />
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Ôn Thi Bằng Lái Xe Máy A1 Online
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Hệ thống ôn tập và thi thử bằng lái xe máy A1 với 250 câu hỏi mẫu
        </Typography>
      </Box>

      {/* Thông tin kỳ thi */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: "background.default" }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Thông tin kỳ thi
        </Typography>
        <Grid container spacing={2}>
          {examInfo.map((info, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {info.icon}
                <Typography variant="body1">{info.text}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Đặt mục tiêu ngày thi */}
      <ExamGoalSetter />

      {/* Thành tích & Huy hiệu */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: "background.default" }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          Thành tích & Huy hiệu 🏆
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Chip label={`Chuỗi ngày liên tiếp: ${streakCount}`} color={streakCount >= 1 ? "primary" : "default"} />
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(4, 1fr)',
              sm: 'repeat(6, 1fr)',
              md: 'repeat(8, 1fr)',
              lg: 'repeat(10, 1fr)'
            },
            gap: 2,
            alignItems: 'center',
            justifyItems: 'center'
          }}
        >
          {Object.keys(ACHIEVEMENT_META).map((id) => {
            const meta = ACHIEVEMENT_META[id];
            const isUnlocked = unlockedAchievements.includes(id);
            return (
              <Tooltip 
                key={id}
                title={
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{meta.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{meta.description}</Typography>
                  </Box>
                }
                arrow
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid',
                    borderColor: isUnlocked ? 'primary.main' : 'divider',
                    color: isUnlocked ? 'primary.main' : 'text.disabled',
                    backgroundColor: isUnlocked ? 'action.hover' : 'background.paper',
                    transition: 'transform 0.2s ease',
                    cursor: 'default',
                    '&:hover': { transform: 'translateY(-2px)' }
                  }}
                >
                  <Typography component="span" sx={{ fontSize: 28, lineHeight: 1 }}>{meta.icon}</Typography>
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Paper>

      {/* Tìm kiếm câu hỏi */}
      <SearchQuestions />

      {/* Các chế độ học */}
      <Grid container spacing={{lg: 4, md: 4, sm: 5, xs: 4}} alignItems="stretch" sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: "flex" }}>
            <Card
              className={`slide-in-left`}
              style={{ animationDelay: `${index * 0.2}s` }}
              sx={{
                height: "100%",
                width: {lg: "22.5rem", sm: "28.5rem", xs: "25rem"},
                display: "flex",
                flexDirection: "column",
                cursor: feature.disabled ? "not-allowed" : "pointer",
                opacity: feature.disabled ? 0.6 : 1,
                "&:hover": {
                  transform: feature.disabled ? "none" : "translateY(-8px)",
                  boxShadow: feature.disabled ? "none" : "0 8px 25px rgba(0, 0, 0, 0.15)",
                },
              }}
              onClick={feature.disabled ? undefined : feature.action}
            >
              <CardContent
                sx={{
                  textAlign: "center",
                  p: 4,
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Box sx={{ mb: 2 }} className="icon-scale">
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      mx: "auto",
                      width: { xs: "100%", sm: 260 },
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: 1.4,
                      minHeight: "4.2em",
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="large"
                  onClick={feature.disabled ? undefined : feature.action}
                  disabled={feature.disabled}
                  sx={{
                    minWidth: 120,
                    backgroundColor: feature.disabled ? 'grey.400' : `${feature.buttonColor}.main`,
                    "&:hover": {
                      backgroundColor: feature.disabled ? 'grey.400' : `${feature.buttonColor}.dark`,
                    },
                  }}
                >
                  {feature.disabled ? 'Không khả dụng' : 'Bắt đầu'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Thống kê */}
      <Paper sx={{ p: 3, backgroundColor: "background.default", mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          Thống kê bộ câu hỏi
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                250
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số câu hỏi
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "error.main" }}
              >
                {questionsData.filter((q) => q.isDiemLiet).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Câu điểm liệt
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "success.main" }}
              >
                230
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Câu thường
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tải tài liệu học tập */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: "background.default" }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
          📥 Tải tài liệu học tập
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Tải về các tài liệu học tập để ôn luyện offline hoặc in ra giấy
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                height: "100%",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                },
                transition: "all 0.3s ease",
              }}
              onClick={handleDownloadDiemLiet}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Download sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: "bold" }}>
                  20 CÂU ĐIỂM LIỆT
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Tải về bộ tài liệu 20 câu điểm liệt quan trọng
                </Typography>
                <Typography variant="caption" color="error.main" sx={{ fontWeight: "bold" }}>
                  ⚠️ Cảnh báo: Sai 1 câu điểm liệt = Trượt ngay lập tức!
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                height: "100%",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                },
                transition: "all 0.3s ease",
              }}
              onClick={handleDownloadFullQuestions}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Download sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: "bold" }}>
                  BỘ ĐỀ 250 CÂU HỎI
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Tải về toàn bộ bộ đề 250 câu hỏi thi bằng lái xe
                </Typography>
                <Typography variant="caption" color="primary.main" sx={{ fontWeight: "bold" }}>
                  📚 Bao gồm cả câu điểm liệt và câu thường
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Lịch sử thi thử */}
      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Lịch sử thi thử
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
                         <Button
               variant="outlined"
               startIcon={<History />}
               onClick={() => {
                 playClickSound();
                 setShowHistory(!showHistory);
               }}
             >
               {showHistory ? "Ẩn lịch sử" : "Xem lịch sử"}
             </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleClearHistory}
              disabled={examHistory.length === 0}
            >
              Xóa lịch sử
            </Button>
          </Box>
        </Box>

        {showHistory && (
          <>
            {examHistory.length === 0 ? (
              <Alert severity="info">
                <Typography variant="body2">
                  Bạn chưa có lịch sử thi thử nào. Hãy bắt đầu thi thử để xem
                  kết quả ở đây!
                </Typography>
              </Alert>
            ) : (
              <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                {examHistory.slice(0, 10).map((exam, index) => (
                  <Card key={index} sx={{ mb: 2, border: "1px solid #e0e0e0" }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Lần thi #{examHistory.length - index}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(exam.timestamp)}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: "bold",
                            color: getScoreColor(exam.score),
                          }}
                        >
                          {exam.score}%
                        </Typography>
                        <Chip
                          label={exam.isPassed ? "ĐẠT" : "KHÔNG ĐẠT"}
                          color={exam.isPassed ? "success" : "error"}
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
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", color: "#4caf50" }}
                            >
                              {exam.correctCount}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Câu đúng
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", color: "#f44336" }}
                            >
                              {exam.wrongCount}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Câu sai
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", color: "#ff9800" }}
                            >
                              {exam.unansweredCount}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Chưa trả lời
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", color: "#2196f3" }}
                            >
                              {exam.totalQuestions}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
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

      {/* Achievement Notification */}
      {newAchievement && (
        <AchievementNotification
          achievementId={newAchievement}
          onClose={handleAchievementClose}
        />
      )}
      <SoundControl />
      
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 8,
          py: 3,
          px: 2,
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            © 2025 Ôn Thi Bằng Lái Xe Online. Phát triển bởi{' '}
            <Typography
              component="span"
              variant="body2"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                fontStyle: 'italic',
              }}
            >
              HanKoonE
            </Typography>
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Hệ thống ôn tập và thi thử bằng lái xe máy A1 với 250 câu hỏi mẫu
          </Typography>
        </Container>
      </Box>

    </Container>
  );
};

export default Home;
