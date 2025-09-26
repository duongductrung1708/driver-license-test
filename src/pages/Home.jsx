import React, { useState, useEffect, Suspense } from "react";
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
  Dialog,
  DialogContent,
  IconButton,
  Skeleton,
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
  Traffic,
  PlayArrow,
  Close,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  ACHIEVEMENT_META,
  getUnlockedAchievements,
  getCurrentStreak,
} from "../components/achievements";
import SoundControl from "../components/SoundControl";
import { useSound } from "../context/SoundContext";
import FacebookSkeleton from "../components/FacebookSkeleton";
const SearchQuestions = React.lazy(() =>
  import("../components/SearchQuestions")
);
const ExamGoalSetter = React.lazy(() => import("../components/ExamGoalSetter"));
const AchievementNotification = React.lazy(() =>
  import("../components/AchievementNotification")
);

const Home = () => {
  const navigate = useNavigate();
  const { playClickSound, playSuccessSound } = useSound();
  const [examHistory, setExamHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [streakCount, setStreakCount] = useState(0);
  const [newAchievement, setNewAchievement] = useState(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [diemLietCount, setDiemLietCount] = useState(0);
  const [trafficSignCount, setTrafficSignCount] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const [isMetaLoading, setIsMetaLoading] = useState(true);
  const [catKhaiNiemCount, setCatKhaiNiemCount] = useState(0);
  const [catVanHoaCount, setCatVanHoaCount] = useState(0);
  const [catKyThuatCount, setCatKyThuatCount] = useState(0);
  const [catSaHinhCount, setCatSaHinhCount] = useState(0);

  // Load exam history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("examHistory") || "[]");
    setExamHistory(history);
    setUnlockedAchievements(getUnlockedAchievements());
    setStreakCount(getCurrentStreak());
    const savedWrong = JSON.parse(localStorage.getItem("wrongAnswers") || "[]");
    setWrongCount(Array.isArray(savedWrong) ? savedWrong.length : 0);
  }, []);

  // Load questions metadata (counts) lazily
  useEffect(() => {
    (async () => {
      try {
        const { default: data } = await import("../data/questions.json");
        const isArray = Array.isArray(data);
        const total = isArray ? data.length : 0;
        const dl = isArray
          ? data.filter((q) => q.isDiemLiet === true).length
          : 0;
        const ts = isArray
          ? data.filter((q) => q.isTrafficSign === true).length
          : 0;
        setTotalQuestions(total);
        setDiemLietCount(dl);
        setTrafficSignCount(ts);
        const khaiNiem = isArray
          ? data.filter((q) => q.isKhaiNiemQuyTac === true).length
          : 0;
        const vanHoa = isArray
          ? data.filter((q) => q.isVanHoaGiaoThong === true).length
          : 0;
        const kyThuat = isArray
          ? data.filter((q) => q.isKyThuatLaiXe === true).length
          : 0;
        const saHinh = isArray
          ? data.filter((q) => q.isSaHinh === true).length
          : 0;
        setCatKhaiNiemCount(khaiNiem);
        setCatVanHoaCount(vanHoa);
        setCatKyThuatCount(kyThuat);
        setCatSaHinhCount(saHinh);
      } catch (_) {
        setTotalQuestions(0);
        setDiemLietCount(0);
        setTrafficSignCount(0);
        setCatKhaiNiemCount(0);
        setCatVanHoaCount(0);
        setCatKyThuatCount(0);
        setCatSaHinhCount(0);
      } finally {
        setIsMetaLoading(false);
      }
    })();
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

  // Hàm tải về file PDF có sẵn
  const handleDownloadDiemLiet = () => {
    playClickSound();
    // Tạo link tải file PDF có sẵn
    const link = document.createElement('a');
    link.href = '/documents/20-cau-diem-liet.pdf'; // Đường dẫn đến file PDF có sẵn
    link.download = '20-cau-diem-liet.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playSuccessSound();
  };

  const handleDownloadFullQuestions = () => {
    playClickSound();
    // Tạo link tải file PDF có sẵn
    const link = document.createElement('a');
    link.href = '/documents/250-cau-hoi-thi-bang-lai.pdf'; // Đường dẫn đến file PDF có sẵn
    link.download = '250-cau-hoi-thi-bang-lai.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playSuccessSound();
  };

  // Chế độ học
  const studyFeatures = [
    {
      icon: <School sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Ôn tập 25 câu",
      description: "Ôn tập với 25 câu hỏi ngẫu nhiên",
      action: () => {
        playClickSound();
        navigate("/practice", { state: { mode: "random" } });
      },
      buttonColor: "primary",
      buttonBg: "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
      buttonHoverBg: "linear-gradient(45deg, #1976d2 30%, #1cb5e0 90%)",
    },
    {
      icon: <School sx={{ fontSize: 40, color: "warning.main" }} />,
      title: "Ôn tập toàn bộ",
      description: "Ôn tập toàn bộ 250 câu hỏi",
      action: () => {
        playClickSound();
        navigate("/practice", { state: { mode: "full" } });
      },
      buttonColor: "warning",
      buttonBg: "linear-gradient(45deg, #ff9800 30%, #ffc107 90%)",
      buttonHoverBg: "linear-gradient(45deg, #f57c00 30%, #ff9800 90%)",
    },
    {
      icon: <Traffic sx={{ fontSize: 40, color: "info.main" }} />,
      title: `Học biển báo (${trafficSignCount})`,
      description: "Ôn tập các câu hỏi về biển báo giao thông",
      action: () => {
        playClickSound();
        navigate("/practice", { state: { mode: "trafficSign" } });
      },
      buttonColor: "info",
      buttonBg: "linear-gradient(45deg, #00bcd4 30%, #2196f3 90%)",
      buttonHoverBg: "linear-gradient(45deg, #0097a7 30%, #1976d2 90%)",
    },
    {
      icon: <School sx={{ fontSize: 40, color: "primary.light" }} />,
      title: `Khái Niệm & Quy Tắc (${catKhaiNiemCount})`,
      description: "Ôn tập nhóm Khái Niệm & Quy Tắc",
      action: () => {
        playClickSound();
        navigate("/practice", { state: { mode: "cat_khaiNiemQuyTac" } });
      },
      buttonColor: "primary",
    },
    {
      icon: <School sx={{ fontSize: 40, color: "success.main" }} />,
      title: `Văn Hóa Giao Thông (${catVanHoaCount})`,
      description: "Ôn tập nhóm Văn Hóa Giao Thông",
      action: () => {
        playClickSound();
        navigate("/practice", { state: { mode: "cat_vanHoaGiaoThong" } });
      },
      buttonColor: "success",
    },
    {
      icon: <School sx={{ fontSize: 40, color: "secondary.main" }} />,
      title: `Kỹ Thuật Lái Xe (${catKyThuatCount})`,
      description: "Ôn tập nhóm Kỹ Thuật Lái Xe",
      action: () => {
        playClickSound();
        navigate("/practice", { state: { mode: "cat_kyThuatLaiXe" } });
      },
      buttonColor: "secondary",
    },
    {
      icon: <School sx={{ fontSize: 40, color: "primary.dark" }} />,
      title: `Sa Hình (${catSaHinhCount})`,
      description: "Ôn tập nhóm Sa Hình",
      action: () => {
        playClickSound();
        navigate("/practice", { state: { mode: "cat_saHinh" } });
      },
      buttonColor: "primary",
    },
    {
      icon: <Warning sx={{ fontSize: 40, color: "error.main" }} />,
      title: "Học câu điểm liệt",
      description: "Ôn tập 20 câu điểm liệt quan trọng",
      action: () => {
        playClickSound();
        navigate("/practice", { state: { mode: "diemLiet" } });
      },
      buttonColor: "error",
      buttonBg: "linear-gradient(45deg, #f44336 30%, #ff7043 90%)",
      buttonHoverBg: "linear-gradient(45deg, #d32f2f 30%, #f4511e 90%)",
    },
    {
      icon: <History sx={{ fontSize: 40, color: "secondary.main" }} />,
      title: `Ôn tập các câu sai (${wrongCount})`,
      description:
        wrongCount > 0
          ? "Luyện tập lại những câu bạn đã làm sai"
          : "Bạn chưa có câu hỏi nào sai. Hãy làm bài thi thử trước.",
      action: () => {
        playClickSound();
        navigate("/practice", { state: { mode: "wrong" } });
      },
      buttonColor: "secondary",
      buttonBg: "linear-gradient(45deg, #7b1fa2 30%, #ab47bc 90%)",
      buttonHoverBg: "linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)",
      disabled: wrongCount === 0,
    },
  ];

  // Chế độ thi
  const examFeatures = [
    {
      icon: <Quiz sx={{ fontSize: 40, color: "success.main" }} />,
      title: "Thi thử",
      description: "Làm bài thi 25 câu trong 19 phút",
      action: () => {
        playClickSound();
        navigate("/exam");
      },
      buttonColor: "success",
      buttonBg: "linear-gradient(45deg, #43a047 30%, #66bb6a 90%)",
      buttonHoverBg: "linear-gradient(45deg, #388e3c 30%, #43a047 90%)",
    },
    {
      icon: <Quiz sx={{ fontSize: 40, color: "info.main" }} />,
      title: "Thi full bộ đề",
      description: "Thi toàn bộ câu hỏi trong 190 phút",
      action: () => {
        playClickSound();
        navigate("/exam", { state: { mode: "full" } });
      },
      buttonColor: "info",
      buttonBg: "linear-gradient(45deg, #03a9f4 30%, #00bcd4 90%)",
      buttonHoverBg: "linear-gradient(45deg, #0288d1 30%, #0097a7 90%)",
    },
    {
      icon: <Traffic sx={{ fontSize: 40, color: "primary.main" }} />,
      title: `Thi biển báo (${trafficSignCount})`,
      description: "Thi các câu hỏi về biển báo giao thông",
      action: () => {
        playClickSound();
        navigate("/exam", { state: { mode: "trafficSign" } });
      },
      buttonColor: "primary",
      buttonBg: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
      buttonHoverBg: "linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)",
    },
    {
      icon: <Quiz sx={{ fontSize: 40, color: "primary.light" }} />,
      title: `Thi Khái Niệm & Quy Tắc (${catKhaiNiemCount})`,
      description: "Thi theo nhóm Khái Niệm & Quy Tắc",
      action: () => {
        playClickSound();
        navigate("/exam", { state: { mode: "cat_khaiNiemQuyTac" } });
      },
      buttonColor: "primary",
    },
    {
      icon: <Quiz sx={{ fontSize: 40, color: "success.main" }} />,
      title: `Thi Văn Hóa Giao Thông (${catVanHoaCount})`,
      description: "Thi theo nhóm Văn Hóa Giao Thông",
      action: () => {
        playClickSound();
        navigate("/exam", { state: { mode: "cat_vanHoaGiaoThong" } });
      },
      buttonColor: "success",
    },
    {
      icon: <Quiz sx={{ fontSize: 40, color: "secondary.main" }} />,
      title: `Thi Kỹ Thuật Lái Xe (${catKyThuatCount})`,
      description: "Thi theo nhóm Kỹ Thuật Lái Xe",
      action: () => {
        playClickSound();
        navigate("/exam", { state: { mode: "cat_kyThuatLaiXe" } });
      },
      buttonColor: "secondary",
    },
    {
      icon: <Quiz sx={{ fontSize: 40, color: "primary.dark" }} />,
      title: `Thi Sa Hình (${catSaHinhCount})`,
      description: "Thi theo nhóm Sa Hình",
      action: () => {
        playClickSound();
        navigate("/exam", { state: { mode: "cat_saHinh" } });
      },
      buttonColor: "primary",
    },
    {
      icon: <Warning sx={{ fontSize: 40, color: "error.main" }} />,
      title: `Thi câu điểm liệt (${diemLietCount})`,
      description: "Thi 20 câu điểm liệt quan trọng",
      action: () => {
        playClickSound();
        navigate("/exam", { state: { mode: "diemLiet" } });
      },
      buttonColor: "error",
      buttonBg: "linear-gradient(45deg, #f44336 30%, #ef5350 90%)",
      buttonHoverBg: "linear-gradient(45deg, #d32f2f 30%, #e53935 90%)",
    },
    {
      icon: <Quiz sx={{ fontSize: 40, color: "secondary.main" }} />,
      title: `Thi các câu đã sai (${wrongCount})`,
      description:
        wrongCount > 0
          ? "Thi lại dựa trên danh sách câu sai"
          : "Bạn chưa có câu hỏi nào sai. Hãy làm bài thi thử trước.",
      action: () => {
        playClickSound();
        navigate("/exam", { state: { mode: "wrong" } });
      },
      buttonColor: "secondary",
      buttonBg: "linear-gradient(45deg, #7b1fa2 30%, #ab47bc 90%)",
      buttonHoverBg: "linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)",
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
      buttonColor: "warning",
      buttonBg: "linear-gradient(45deg, #ffa000 30%, #ffb300 90%)",
      buttonHoverBg: "linear-gradient(45deg, #fb8c00 30%, #ffa000 90%)",
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
      <Suspense fallback={<FacebookSkeleton lines={2} />}>
        <ExamGoalSetter />
      </Suspense>

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
          <Chip
            label={`Chuỗi ngày liên tiếp: ${streakCount}`}
            color={streakCount >= 1 ? "primary" : "default"}
          />
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(4, 1fr)",
              sm: "repeat(6, 1fr)",
              md: "repeat(8, 1fr)",
              lg: "repeat(10, 1fr)",
            },
            gap: 2,
            alignItems: "center",
            justifyItems: "center",
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
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      {meta.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {meta.description}
                    </Typography>
                  </Box>
                }
                arrow
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid",
                    borderColor: isUnlocked ? "primary.main" : "divider",
                    color: isUnlocked ? "primary.main" : "text.disabled",
                    backgroundColor: isUnlocked
                      ? "action.hover"
                      : "background.paper",
                    transition: "transform 0.2s ease",
                    cursor: "default",
                    "&:hover": { transform: "translateY(-2px)" },
                  }}
                >
                  <Typography
                    component="span"
                    sx={{ fontSize: 28, lineHeight: 1 }}
                  >
                    {meta.icon}
                  </Typography>
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Paper>

      {/* Tìm kiếm câu hỏi */}
      <Suspense fallback={<FacebookSkeleton lines={4} />}>
        <SearchQuestions />
      </Suspense>

      {/* Chế độ học */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: "background.default" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3, textAlign: "center", color: "primary.main" }}
        >
          📚 Chế độ học
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
          Ôn tập và học các câu hỏi theo từng chủ đề
        </Typography>
        {isMetaLoading ? (
          <Grid container spacing={{ lg: 4, md: 4, sm: 5, xs: 4 }} alignItems="stretch">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx} sx={{ display: "flex" }}>
                <Card sx={{ height: "100%", width: { lg: "21.5rem", sm: "27.5rem", xs: "24rem" } }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                      <Skeleton variant="circular" width={48} height={48} />
                    </Box>
                    <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={18} width="80%" />
                    <Skeleton variant="text" height={18} width="70%" />
                    <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                      <Skeleton variant="rounded" width={140} height={40} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid
            container
            spacing={{ lg: 4, md: 4, sm: 5, xs: 4 }}
            alignItems="stretch"
          >
            {studyFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: "flex" }}>
                <Card
                  className={`slide-in-left`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                  sx={{
                    height: "100%",
                    width: { lg: "21.5rem", sm: "27.5rem", xs: "24rem" },
                    display: "flex",
                    flexDirection: "column",
                    cursor: feature.disabled ? "not-allowed" : "pointer",
                    opacity: feature.disabled ? 0.6 : 1,
                    "&:hover": {
                      transform: feature.disabled ? "none" : "translateY(-8px)",
                      boxShadow: feature.disabled
                        ? "none"
                        : "0 8px 25px rgba(0, 0, 0, 0.15)",
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
                      background: feature.disabled
                        ? undefined
                        : feature.buttonBg || `${feature.buttonColor}.main`,
                      backgroundColor: feature.disabled
                        ? "grey.400"
                        : undefined,
                      "&:hover": {
                        background: feature.disabled
                          ? undefined
                          : feature.buttonHoverBg || `${feature.buttonColor}.dark`,
                        backgroundColor: feature.disabled
                          ? "grey.400"
                          : undefined,
                      },
                      }}
                    >
                      {feature.disabled ? "Không khả dụng" : "Bắt đầu"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Chế độ thi */}
      <Paper sx={{ p: 3, mb: 6, backgroundColor: "background.default" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3, textAlign: "center", color: "success.main" }}
        >
          🎯 Chế độ thi
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
          Thi thử và kiểm tra kiến thức với thời gian giới hạn
        </Typography>
        {isMetaLoading ? (
          <Grid container spacing={{ lg: 4, md: 4, sm: 5, xs: 4 }} alignItems="stretch">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx} sx={{ display: "flex" }}>
                <Card sx={{ height: "100%", width: { lg: "21.5rem", sm: "27.5rem", xs: "24rem" } }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                      <Skeleton variant="circular" width={48} height={48} />
                    </Box>
                    <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={18} width="80%" />
                    <Skeleton variant="text" height={18} width="70%" />
                    <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                      <Skeleton variant="rounded" width={140} height={40} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid
            container
            spacing={{ lg: 4, md: 4, sm: 5, xs: 4 }}
            alignItems="stretch"
          >
            {examFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: "flex" }}>
                <Card
                  className={`slide-in-left`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                  sx={{
                    height: "100%",
                    width: { lg: "21.5rem", sm: "27.5rem", xs: "24rem" },
                    display: "flex",
                    flexDirection: "column",
                    cursor: feature.disabled ? "not-allowed" : "pointer",
                    opacity: feature.disabled ? 0.6 : 1,
                    "&:hover": {
                      transform: feature.disabled ? "none" : "translateY(-8px)",
                      boxShadow: feature.disabled
                        ? "none"
                        : "0 8px 25px rgba(0, 0, 0, 0.15)",
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
                      background: feature.disabled
                        ? undefined
                        : feature.buttonBg || `${feature.buttonColor}.main`,
                      backgroundColor: feature.disabled
                        ? "grey.400"
                        : undefined,
                      "&:hover": {
                        background: feature.disabled
                          ? undefined
                          : feature.buttonHoverBg || `${feature.buttonColor}.dark`,
                        backgroundColor: feature.disabled
                          ? "grey.400"
                          : undefined,
                      },
                      }}
                    >
                      {feature.disabled ? "Không khả dụng" : "Bắt đầu"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Thống kê */}
      <Paper sx={{ p: 3, backgroundColor: "background.default", mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          Thống kê bộ câu hỏi
        </Typography>
        {isMetaLoading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Box sx={{ textAlign: "center" }}>
                  <Skeleton variant="text" height={44} sx={{ mx: "auto", width: 80 }} />
                  <Skeleton variant="text" width={120} sx={{ mx: "auto" }} />
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {totalQuestions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tổng số câu hỏi
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "error.main" }}
                >
                  {diemLietCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Câu điểm liệt
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "info.main" }}
                >
                  {trafficSignCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Câu biển báo
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "success.main" }}
                >
                  {Math.max(totalQuestions - diemLietCount - trafficSignCount, 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Câu khác
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Video hướng dẫn thi */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: "background.default" }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          🎥 Video hướng dẫn thi
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Xem video hướng dẫn chi tiết về cách thi và các mẹo làm bài hiệu quả
        </Typography>
        <Box 
          sx={{ 
            position: 'relative', 
            width: '100%', 
            height: 0, 
            paddingBottom: '56.25%', // 16:9 aspect ratio
            mb: 3,
            cursor: 'pointer',
            borderRadius: '8px',
            overflow: 'hidden',
            '&:hover': {
              transform: 'scale(1.02)',
              transition: 'transform 0.3s ease'
            }
          }}
          onClick={() => {
            playClickSound();
            setVideoOpen(true);
          }}
        >
          {/* Thumbnail background */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: 'white'
            }}
          >
            <PlayArrow sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Hướng dẫn thi bằng lái xe A1
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              Bấm để xem video hướng dẫn
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Tải tài liệu học tập */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: "background.default" }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}
        >
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
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  20 CÂU ĐIỂM LIỆT
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Tải về bộ tài liệu 20 câu điểm liệt quan trọng
                </Typography>
                <Typography
                  variant="caption"
                  color="error.main"
                  sx={{ fontWeight: "bold" }}
                >
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
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  BỘ ĐỀ 250 CÂU HỎI
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Tải về toàn bộ bộ đề 250 câu hỏi thi bằng lái xe
                </Typography>
                <Typography
                  variant="caption"
                  color="primary.main"
                  sx={{ fontWeight: "bold" }}
                >
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
      <Suspense fallback={<FacebookSkeleton lines={1} withAvatar={false} />}>
        {newAchievement && (
          <AchievementNotification
            achievementId={newAchievement}
            onClose={handleAchievementClose}
          />
        )}
      </Suspense>
      <SoundControl />

      {/* Video Popup Modal */}
      <Dialog
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible'
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setVideoOpen(false)}
            sx={{
              position: 'absolute',
              top: -10,
              right: -10,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
              }
            }}
          >
            <Close />
          </IconButton>
          <Box sx={{ 
            position: 'relative', 
            width: '100%', 
            height: 0, 
            paddingBottom: '56.25%', // 16:9 aspect ratio
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/ISJeeUw_xKs?si=7yKLf7TaQvJufvsk"
              title="Hướng dẫn thi bằng lái xe A1"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '8px'
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 8,
          py: 3,
          px: 2,
          backgroundColor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            © 2025 Ôn Thi Bằng Lái Xe Online. Phát triển bởi{" "}
            <Typography
              component="span"
              variant="body2"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                fontStyle: "italic",
              }}
            >
              HanKoonE
            </Typography>
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Hệ thống ôn tập và thi thử bằng lái xe máy A1 với 250 câu hỏi mẫu
          </Typography>
        </Container>
      </Box>
    </Container>
  );
};

export default Home;
