import React, { useState, useEffect } from "react";
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
  Paper,
  Skeleton,
} from "@mui/material";
import {
  NavigateBefore,
  NavigateNext,
  Home,
  FilterList,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useMemo } from "react";
import QuizQuestion from "../components/QuizQuestion";
import ProgressBar from "../components/ProgressBar";
import DiemLietStats from "../components/DiemLietStats";
import { CATEGORY, inferCategory } from "../utils/category";
import questionsData from "../data/questions.json";
import useSound from "../hooks/useSound";
import SoundControl from "../components/SoundControl";

const Practice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const practiceMode = location.state?.mode || "full"; // Default to full mode
  const customQuestionIds = useMemo(
    () => location.state?.questionIds || [],
    [location.state?.questionIds]
  );
  const searchTerm = location.state?.searchTerm || "";
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [filter, setFilter] = useState("all");
  const [filteredQuestions, setFilteredQuestions] = useState(questionsData);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [randomQuestions, setRandomQuestions] = useState([]);
  const { playCorrect, playIncorrect } = useSound();
  const [isQuestionLoading, setIsQuestionLoading] = useState(true);

  // Load wrong answers from localStorage
  useEffect(() => {
    const savedWrongAnswers = localStorage.getItem("wrongAnswers");
    if (savedWrongAnswers) {
      setWrongAnswers(JSON.parse(savedWrongAnswers));
    }
  }, []);

  // Generate random questions once when entering random mode
  useEffect(() => {
    if (practiceMode === "random" && randomQuestions.length === 0) {
      // For random mode, select 25 random questions with exactly 2 diem liet
      const DIEM_LIET_NEEDED = 2;
      const TOTAL = 25;
      const diemLiet = questionsData.filter((q) => q.isDiemLiet);
      const nonDiemLiet = questionsData.filter((q) => !q.isDiemLiet);

      const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

      const pick = (arr, n) => shuffle(arr).slice(0, Math.min(n, arr.length));

      const selectedDiemLiet = pick(diemLiet, DIEM_LIET_NEEDED);
      const remaining = TOTAL - selectedDiemLiet.length;
      const selectedNonDiemLiet = pick(nonDiemLiet, remaining);
      const newRandomQuestions = shuffle([
        ...selectedDiemLiet,
        ...selectedNonDiemLiet,
      ]);
      setRandomQuestions(newRandomQuestions);
    } else if (practiceMode !== "random") {
      // Clear random questions when switching to other modes
      setRandomQuestions([]);
    }
  }, [practiceMode, randomQuestions.length]);

  // Filter questions based on selected filter and practice mode
  useEffect(() => {
    setIsQuestionLoading(true);
    let filtered = questionsData;

    // Apply practice mode filter first
    if (practiceMode === "random") {
      // Use stored random questions instead of generating new ones
      filtered = randomQuestions.length > 0 ? randomQuestions : questionsData;
    } else if (practiceMode === "diemLiet") {
      // For diemLiet mode, select only diemLiet questions
      filtered = questionsData.filter((q) => q.isDiemLiet);
    } else if (practiceMode === "trafficSign") {
      // For trafficSign mode, select only traffic sign questions
      filtered = questionsData.filter((q) => q.isTrafficSign);
    } else if (practiceMode === "cat_khaiNiemQuyTac") {
      filtered = questionsData.filter(
        (q) => inferCategory(q) === CATEGORY.KHAI_NIEM_QUY_TAC
      );
    } else if (practiceMode === "cat_vanHoaGiaoThong") {
      filtered = questionsData.filter(
        (q) => inferCategory(q) === CATEGORY.VAN_HOA_GIAO_THONG
      );
    } else if (practiceMode === "cat_kyThuatLaiXe") {
      filtered = questionsData.filter(
        (q) => inferCategory(q) === CATEGORY.KY_THUAT_LAI_XE
      );
    } else if (practiceMode === "cat_saHinh") {
      filtered = questionsData.filter(
        (q) => inferCategory(q) === CATEGORY.SA_HINH
      );
    } else if (practiceMode === "wrong") {
      // Practice only wrong questions from state
      const wrongQuestionIds = wrongAnswers.map((w) => w.questionId);
      filtered = questionsData.filter((q) => wrongQuestionIds.includes(q.id));
    } else if (practiceMode === "custom") {
      // Practice custom questions from search
      filtered = questionsData.filter((q) => customQuestionIds.includes(q.id));
    }

    // Then apply additional filters
    switch (filter) {
      case "diemLiet":
        filtered = filtered.filter((q) => q.isDiemLiet);
        break;
      case "trafficSign":
        filtered = filtered.filter((q) => q.isTrafficSign);
        break;
      case "cat_khaiNiemQuyTac":
        filtered = filtered.filter(
          (q) => inferCategory(q) === CATEGORY.KHAI_NIEM_QUY_TAC
        );
        break;
      case "cat_vanHoaGiaoThong":
        filtered = filtered.filter(
          (q) => inferCategory(q) === CATEGORY.VAN_HOA_GIAO_THONG
        );
        break;
      case "cat_kyThuatLaiXe":
        filtered = filtered.filter(
          (q) => inferCategory(q) === CATEGORY.KY_THUAT_LAI_XE
        );
        break;
      case "cat_saHinh":
        filtered = filtered.filter(
          (q) => inferCategory(q) === CATEGORY.SA_HINH
        );
        break;
      case "wrong":
        {
          const wrongQuestionIds = wrongAnswers.map((w) => w.questionId);
          filtered = filtered.filter((q) => wrongQuestionIds.includes(q.id));
        }
        break;
      default:
        // Keep the current filtered questions
        break;
    }

    setFilteredQuestions(filtered);

    // Keep position stable; only reset if the current index is out of bounds
    if (currentQuestionIndex >= filtered.length) {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }

    // If we're in wrong practice mode and the current question is no longer in the filtered list,
    // adjust the index to stay within bounds
    if (
      practiceMode === "wrong" &&
      filtered.length > 0 &&
      currentQuestionIndex >= filtered.length
    ) {
      setCurrentQuestionIndex(Math.max(0, filtered.length - 1));
      setSelectedAnswer(null);
      setIsAnswered(false);
    }

    // In wrong practice mode, ensure we don't have an invalid question index
    if (
      practiceMode === "wrong" &&
      filtered.length > 0 &&
      currentQuestionIndex < filtered.length
    ) {
      // Check if current question is still valid
      const currentQuestionValid = filtered[currentQuestionIndex];
      if (!currentQuestionValid) {
        // Find the closest valid index
        const validIndex = Math.min(currentQuestionIndex, filtered.length - 1);
        setCurrentQuestionIndex(validIndex);
        setSelectedAnswer(null);
        setIsAnswered(false);
      }
    }
    // Simulate lightweight loading for nicer UX
    const timeout = setTimeout(() => setIsQuestionLoading(false), 250);
    return () => clearTimeout(timeout);
  }, [
    filter,
    practiceMode,
    customQuestionIds,
    wrongAnswers,
    randomQuestions,
    currentQuestionIndex,
  ]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  // Show skeleton while loading current question
  const renderQuestionSkeleton = () => (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Skeleton variant="text" height={28} width="60%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={18} width="40%" sx={{ mb: 2 }} />
      {currentQuestion?.image && (
        <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 1 }} />
      )}
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} variant="rounded" height={44} sx={{ mb: 1.5, borderRadius: 1 }} />
      ))}
    </Paper>
  );

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
    setAnsweredQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: true,
    }));

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    // sound feedback
    if (isCorrect) {
      playCorrect();
      // If this question was previously wrong, remove it from localStorage and state
      const savedWrong = JSON.parse(
        localStorage.getItem("wrongAnswers") || "[]"
      );
      const filteredWrong = savedWrong.filter(
        (w) => w.questionId !== currentQuestion.id
      );
      if (filteredWrong.length !== savedWrong.length) {
        localStorage.setItem("wrongAnswers", JSON.stringify(filteredWrong));
        setWrongAnswers(filteredWrong);

        // If we're in wrong practice mode and this was the last wrong question, reset to beginning
        if (practiceMode === "wrong" && filteredWrong.length === 0) {
          setCurrentQuestionIndex(0);
          setSelectedAnswer(null);
          setIsAnswered(false);
        }
      }
    } else {
      playIncorrect();
    }

    // Save wrong answer to localStorage
    if (!isCorrect) {
      const newWrongAnswer = {
        questionId: currentQuestion.id,
        selectedAnswer: selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        timestamp: new Date().toISOString(),
      };

      // Deduplicate by questionId
      const existing = JSON.parse(localStorage.getItem("wrongAnswers") || "[]");
      const withoutThis = existing.filter(
        (w) => w.questionId !== newWrongAnswer.questionId
      );
      const updatedWrongAnswers = [...withoutThis, newWrongAnswer];
      localStorage.setItem("wrongAnswers", JSON.stringify(updatedWrongAnswers));
      setWrongAnswers(updatedWrongAnswers);
    }
  };

  // Handle automatic transition to next question when current question is removed from wrong answers
  useEffect(() => {
    if (practiceMode === "wrong" && filteredQuestions.length > 0) {
      // Check if current question still exists in filtered questions
      const currentQuestionExists = filteredQuestions.some(
        (q) => q.id === currentQuestion?.id
      );

      if (!currentQuestionExists && currentQuestion) {
        // Current question was removed, find the next valid question
        const nextIndex = Math.min(
          currentQuestionIndex,
          filteredQuestions.length - 1
        );
        if (nextIndex !== currentQuestionIndex) {
          setCurrentQuestionIndex(nextIndex);
          setSelectedAnswer(null);
          setIsAnswered(false);
        }
      }
    }
  }, [filteredQuestions, currentQuestion, currentQuestionIndex, practiceMode]);

  const getAnsweredCount = () => {
    return filteredQuestions.reduce(
      (count, q) => count + (answeredQuestions[q.id] ? 1 : 0),
      0
    );
  };

  const getDiemLietStats = () => {
    const diemLietQuestions = questionsData.filter((q) => q.isDiemLiet);
    const answeredDiemLiet = diemLietQuestions.filter(
      (q) => answeredQuestions[q.id]
    ).length;
    const correctDiemLiet = diemLietQuestions.filter(
      (q) =>
        answeredQuestions[q.id] &&
        !wrongAnswers.some((w) => w.questionId === q.id)
    ).length;
    const wrongDiemLiet = diemLietQuestions.filter((q) =>
      wrongAnswers.some((w) => w.questionId === q.id)
    ).length;

    return {
      totalDiemLiet: diemLietQuestions.length,
      answeredDiemLiet,
      correctDiemLiet,
      wrongDiemLiet,
    };
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          {practiceMode === "random"
            ? "Ôn tập 25 câu"
            : practiceMode === "diemLiet"
            ? "Học câu điểm liệt"
            : practiceMode === "trafficSign"
            ? "Học biển báo"
            : practiceMode === "cat_khaiNiemQuyTac"
            ? CATEGORY.KHAI_NIEM_QUY_TAC
            : practiceMode === "cat_vanHoaGiaoThong"
            ? CATEGORY.VAN_HOA_GIAO_THONG
            : practiceMode === "cat_kyThuatLaiXe"
            ? CATEGORY.KY_THUAT_LAI_XE
            : practiceMode === "cat_saHinh"
            ? CATEGORY.SA_HINH
            : practiceMode === "wrong"
            ? "Ôn tập các câu đã sai"
            : practiceMode === "custom"
            ? `Ôn tập từ khóa: "${searchTerm}"`
            : "Ôn tập full"}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Home />}
          onClick={() => navigate("/")}
        >
          Về trang chủ
        </Button>
      </Box>

      {/* Practice Mode Info */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: "background.default" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {practiceMode === "random"
              ? "Chế độ ôn tập với 25 câu hỏi ngẫu nhiên từ bộ đề"
              : practiceMode === "diemLiet"
              ? "Chế độ học 20 câu điểm liệt quan trọng"
              : practiceMode === "trafficSign"
              ? "Chế độ học các câu hỏi về biển báo giao thông"
              : practiceMode === "cat_khaiNiemQuyTac"
              ? "Học nhóm Khái Niệm & Quy Tắc"
              : practiceMode === "cat_vanHoaGiaoThong"
              ? "Học nhóm Văn Hóa Giao Thông"
              : practiceMode === "cat_kyThuatLaiXe"
              ? "Học nhóm Kỹ Thuật Lái Xe"
              : practiceMode === "cat_saHinh"
              ? "Học nhóm Sa Hình"
              : practiceMode === "wrong"
              ? "Luyện tập lại các câu bạn đã làm sai trước đó"
              : practiceMode === "custom"
              ? `Ôn tập ${customQuestionIds.length} câu hỏi liên quan đến từ khóa: "${searchTerm}"`
              : "Chế độ ôn tập toàn bộ 250 câu hỏi"}
          </Typography>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", rowGap: 1.5 }}>
            {practiceMode !== "diemLiet" && practiceMode !== "custom" && (
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  navigate("/practice", {
                    state: {
                      mode: practiceMode === "random" ? "full" : "random",
                    },
                  })
                }
              >
                Chuyển sang{" "}
                {practiceMode === "random" ? "Ôn tập full" : "Ôn tập 25 câu"}
              </Button>
            )}
            {practiceMode !== "custom" && (
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  navigate("/practice", { state: { mode: "wrong" } })
                }
              >
                Học các câu đã sai
              </Button>
            )}
            {practiceMode !== "custom" && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    navigate("/practice", { state: { mode: "cat_khaiNiemQuyTac" } })
                  }
                >
                  {CATEGORY.KHAI_NIEM_QUY_TAC}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    navigate("/practice", { state: { mode: "cat_vanHoaGiaoThong" } })
                  }
                >
                  {CATEGORY.VAN_HOA_GIAO_THONG}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    navigate("/practice", { state: { mode: "cat_kyThuatLaiXe" } })
                  }
                >
                  {CATEGORY.KY_THUAT_LAI_XE}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    navigate("/practice", { state: { mode: "cat_saHinh" } })
                  }
                >
                  {CATEGORY.SA_HINH}
                </Button>
              </>
            )}
            {practiceMode !== "custom" && (
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={() =>
                  navigate("/practice", {
                    state: { mode: "diemLiet" },
                  })
                }
              >
                Học câu điểm liệt
              </Button>
            )}
            {practiceMode === "custom" && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate("/")}
              >
                Về trang tìm kiếm
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FilterList />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Bộ lọc</InputLabel>
            <Select
              value={filter}
              label="Bộ lọc"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">
                Tất cả câu hỏi (
                {practiceMode === "random"
                  ? "25 câu ngẫu nhiên"
                  : practiceMode === "diemLiet"
                  ? "20 câu điểm liệt"
                  : practiceMode === "trafficSign"
                  ? `${filteredQuestions.length} câu biển báo`
                  : practiceMode === "custom"
                  ? `${customQuestionIds.length} câu tìm kiếm`
                  : questionsData.length}
                )
              </MenuItem>
              {practiceMode !== "diemLiet" && practiceMode !== "custom" && (
                <MenuItem value="diemLiet">
                  Chỉ câu điểm liệt (
                  {practiceMode === "random"
                    ? "Trong 25 câu"
                    : questionsData.filter((q) => q.isDiemLiet).length}
                  )
                </MenuItem>
              )}
              {practiceMode !== "trafficSign" && practiceMode !== "custom" && (
                <MenuItem value="trafficSign">
                  Chỉ câu biển báo (
                  {practiceMode === "random"
                    ? "Trong 25 câu"
                    : questionsData.filter((q) => q.isTrafficSign).length}
                  )
                </MenuItem>
              )}
              <MenuItem value="cat_khaiNiemQuyTac">{CATEGORY.KHAI_NIEM_QUY_TAC}</MenuItem>
              <MenuItem value="cat_vanHoaGiaoThong">{CATEGORY.VAN_HOA_GIAO_THONG}</MenuItem>
              <MenuItem value="cat_kyThuatLaiXe">{CATEGORY.KY_THUAT_LAI_XE}</MenuItem>
              <MenuItem value="cat_saHinh">{CATEGORY.SA_HINH}</MenuItem>
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

      {/* DiemLiet Stats */}
      {practiceMode === "diemLiet" && <DiemLietStats {...getDiemLietStats()} />}

      {/* DiemLiet Warning */}
      {practiceMode === "diemLiet" && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>⚠️ Cảnh báo:</strong> Đây là câu điểm liệt! Nếu sai câu này
            trong bài thi thật, bạn sẽ bị trượt ngay lập tức. Hãy học kỹ và ghi
            nhớ đáp án chính xác.
          </Typography>
        </Alert>
      )}

      {/* Question */}
      {isQuestionLoading || !currentQuestion ? (
        renderQuestionSkeleton()
      ) : (
        currentQuestion && (
          <QuizQuestion
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            isAnswered={isAnswered}
            questionNumber={currentQuestionIndex + 1}
          />
        )
      )}

      {/* Navigation Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          variant="outlined"
          startIcon={<NavigateBefore />}
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Câu trước
        </Button>

        <Box sx={{ display: "flex", gap: 2 }}>
          {!isAnswered && selectedAnswer !== null && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ backgroundColor: "success.main" }}
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
          <strong>Hướng dẫn:</strong> Chọn đáp án và nhấn "Kiểm tra đáp án" để
          xem kết quả. Sau đó bạn có thể chuyển sang câu tiếp theo hoặc câu
          trước đó.
          {practiceMode === "random" &&
            " Trong chế độ ôn tập 25 câu, các câu hỏi được chọn ngẫu nhiên từ bộ đề."}
          {practiceMode === "diemLiet" &&
            " Trong chế độ học câu điểm liệt, bạn sẽ học 20 câu hỏi quan trọng nhất."}
          {practiceMode === "trafficSign" &&
            " Trong chế độ học biển báo, bạn sẽ học các câu hỏi về biển báo giao thông."}
        </Typography>
      </Alert>

      {/* Empty state for wrong answers filter */}
      {filter === "wrong" && wrongAnswers.length === 0 && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="body2">
            Bạn chưa có câu hỏi nào sai. Hãy làm bài thi thử để tạo danh sách
            câu sai.
          </Typography>
        </Alert>
      )}
      <SoundControl />
    </Container>
  );
};

export default Practice;
