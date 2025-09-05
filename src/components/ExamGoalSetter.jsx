import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  Event,
  Edit,
  Delete,
  CalendarToday,
  AccessTime,
  TrendingUp,
  EmojiEvents,
} from "@mui/icons-material";

const ExamGoalSetter = () => {
  const [examDate, setExamDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [minutesRemaining, setMinutesRemaining] = useState(0);
  const [progress, setProgress] = useState(0);

  // Helpers to parse date string (YYYY-MM-DD) as LOCAL date to avoid UTC shift
  const parseLocalDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // End of day for countdown so the selected day counts until 23:59:59 local
  const parseLocalDateEndOfDay = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day, 23, 59, 59, 999);
  };

  // Load exam date from localStorage
  useEffect(() => {
    const savedDate = localStorage.getItem("examGoalDate");
    if (savedDate) {
      setExamDate(savedDate);
    }
  }, []);

  // Calculate countdown
  useEffect(() => {
    if (!examDate) return;

    const updateCountdown = () => {
      const now = new Date();
      const exam = parseLocalDateEndOfDay(examDate);
      const diff = exam - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setDaysRemaining(days);
        setHoursRemaining(hours);
        setMinutesRemaining(minutes);

        // Calculate progress (assuming 90 days preparation period)
        const totalDays = 90;
        const daysPassed = totalDays - days;
        const progressPercent = Math.max(
          0,
          Math.min(100, (daysPassed / totalDays) * 100)
        );
        setProgress(progressPercent);
      } else {
        setDaysRemaining(0);
        setHoursRemaining(0);
        setMinutesRemaining(0);
        setProgress(100);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [examDate]);

  const handleSetDate = () => {
    if (examDate) {
      localStorage.setItem("examGoalDate", examDate);
      setShowDatePicker(false);
    }
  };

  const handleClearDate = () => {
    localStorage.removeItem("examGoalDate");
    setExamDate("");
    setDaysRemaining(0);
    setHoursRemaining(0);
    setMinutesRemaining(0);
    setProgress(0);
  };

  const handleOpenDatePicker = () => {
    console.log("Opening date picker...");
    setShowDatePicker(true);
  };

  const getMotivationalMessage = () => {
    if (daysRemaining === 0) {
      return "🎉 Chúc mừng! Hôm nay là ngày thi của bạn!";
    } else if (daysRemaining <= 7) {
      return "🔥 Chỉ còn vài ngày nữa! Hãy ôn tập thật kỹ!";
    } else if (daysRemaining <= 30) {
      return "⚡ Còn 1 tháng nữa! Tăng tốc độ ôn tập!";
    } else if (daysRemaining <= 60) {
      return "📚 Còn 2 tháng nữa! Hãy lập kế hoạch ôn tập!";
    } else {
      return "🎯 Bạn có đủ thời gian để chuẩn bị tốt!";
    }
  };

  const getProgressColor = () => {
    if (progress >= 80) return "success";
    if (progress >= 60) return "warning";
    return "primary";
  };

  const getDaysText = (days) => {
    if (days === 0) return "Hôm nay";
    if (days === 1) return "1 ngày";
    return `${days} ngày`;
  };

  return (
    <>
      {!examDate ? (
        <Card
          sx={{
            mb: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Event sx={{ fontSize: 60, mb: 2, opacity: 0.8 }} />
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              🎯 Đặt Mục Tiêu Ngày Thi
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Chọn ngày thi dự kiến của bạn để nhận lời nhắc và tạo động lực!
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<CalendarToday />}
              onClick={handleOpenDatePicker}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              Đặt ngày thi
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card
          sx={{
            mb: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                  🎯 Mục Tiêu Ngày Thi
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {getMotivationalMessage()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={handleOpenDatePicker}
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={handleClearDate}
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Event sx={{ fontSize: 24 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {parseLocalDate(examDate)?.toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>

            {daysRemaining > 0 ? (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", mb: 1, textAlign: "center" }}
                >
                  {getDaysText(daysRemaining)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textAlign: "center", opacity: 0.8 }}
                >
                  {hoursRemaining} giờ {minutesRemaining} phút
                </Typography>
              </Box>
            ) : (
              <Alert
                severity="success"
                sx={{ mb: 3, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  🎉 Hôm nay là ngày thi của bạn!
                </Typography>
                <Typography variant="body2">
                  Chúc bạn thi tốt và đạt kết quả cao!
                </Typography>
              </Alert>
            )}

            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Tiến độ chuẩn bị
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {Math.round(progress)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                color={getProgressColor()}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                  },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                icon={<AccessTime />}
                label={`Còn ${daysRemaining} ngày`}
                variant="outlined"
                sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.5)" }}
              />
              <Chip
                icon={<TrendingUp />}
                label={`${Math.round(progress)}% hoàn thành`}
                variant="outlined"
                sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.5)" }}
              />
              {daysRemaining <= 7 && (
                <Chip
                  icon={<EmojiEvents />}
                  label="Giai đoạn nước rút!"
                  color="warning"
                  sx={{ backgroundColor: "rgba(255, 193, 7, 0.2)" }}
                />
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Date Picker Dialog */}
      <Dialog
        open={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarToday />
            Đặt ngày thi dự kiến
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Chọn ngày thi dự kiến để nhận lời nhắc và theo dõi tiến độ chuẩn bị.
          </Typography>
          <TextField
            fullWidth
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: new Date().toISOString().split("T")[0],
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDatePicker(false)}>Hủy</Button>
          <Button
            onClick={handleSetDate}
            variant="contained"
            disabled={!examDate}
          >
            Đặt ngày
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExamGoalSetter;
