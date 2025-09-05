// Achievements utility: definitions, storage, evaluation

const STORAGE_KEYS = {
  achievements: "achievements",
  lastExamDate: "lastExamDate",
  streakCount: "streakCount",
};

export const ACHIEVEMENTS = {
  FIRST_PASS: "first_pass",
  PERFECT_SCORE: "perfect_score",
  SPEED_RUN: "speed_run",
  LEARN_FROM_MISTAKES: "learn_from_mistakes",
  SIGN_MASTER: "sign_master",
  NIGHT_OWL: "night_owl",
  DIEM_LIET_MASTER: "diem_liet_master",
  STREAK_3: "streak_3",
  STREAK_7: "streak_7",
  STREAK_30: "streak_30",
};

export const ACHIEVEMENT_META = {
  [ACHIEVEMENTS.FIRST_PASS]: {
    title: "Lần Đầu Vượt Ải",
    description: "Chúc mừng bạn đã vượt qua bài thi đầu tiên!",
    icon: "🏁",
  },
  [ACHIEVEMENTS.PERFECT_SCORE]: {
    title: "Điểm Tuyệt Đối",
    description: "Đạt điểm tuyệt đối trong một bài thi.",
    icon: "💯",
  },
  [ACHIEVEMENTS.SPEED_RUN]: {
    title: "Tốc Độ Bàn Thờ",
    description: "Hoàn thành một bài thi trong vòng 5 phút.",
    icon: "⚡",
  },
  [ACHIEVEMENTS.LEARN_FROM_MISTAKES]: {
    title: "Học Từ Lỗi Sai",
    description: "Vượt qua bài thi ôn tập các câu bạn đã trả.",
    icon: "📘",
  },
  [ACHIEVEMENTS.SIGN_MASTER]: {
    title: "Vua Biển Báo",
    description: "Trả lời đúng 100% câu hỏi biển báo trong bài thi ĐẠT.",
    icon: "🚧",
  },
  [ACHIEVEMENTS.NIGHT_OWL]: {
    title: "Cú Đêm",
    description: "Hoàn thành một bài thi trong khoảng 0-4h sáng.",
    icon: "🌙",
  },
  [ACHIEVEMENTS.DIEM_LIET_MASTER]: {
    title: "Chuyên Gia Điểm Liệt",
    description: "Vượt qua bài thi câu điểm liệt.",
    icon: "🛡️",
  },
  [ACHIEVEMENTS.STREAK_3]: {
    title: "Bắt Đầu Nóng Máy",
    description: "Hoàn thành bài thi trong 3 ngày liên tiếp.",
    icon: "🔥",
  },
  [ACHIEVEMENTS.STREAK_7]: {
    title: "Bền Bỉ Cả Tuần",
    description: "Hoàn thành bài thi trong 7 ngày liên tiếp.",
    icon: "🏋️",
  },
  [ACHIEVEMENTS.STREAK_30]: {
    title: "Thói Quen Vàng",
    description: "Hoàn thành bài thi trong 30 ngày liên tiếp.",
    icon: "🏆",
  },
};

function getStoredAchievements() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.achievements) || "[]");
  } catch {
    return [];
  }
}

function storeAchievements(ids) {
  localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(ids));
}

function getDateString(date) {
  return date.toISOString().substring(0, 10); // YYYY-MM-DD
}

function updateStreakOnExamComplete(now = new Date()) {
  const today = getDateString(now);
  const lastDate = localStorage.getItem(STORAGE_KEYS.lastExamDate);
  let streak = parseInt(
    localStorage.getItem(STORAGE_KEYS.streakCount) || "0",
    10
  );

  if (!lastDate) {
    streak = 1;
  } else {
    const last = new Date(lastDate);
    const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      // same day, keep streak unchanged
    } else if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      streak = 1;
    }
  }

  localStorage.setItem(STORAGE_KEYS.lastExamDate, today);
  localStorage.setItem(STORAGE_KEYS.streakCount, String(streak));
  return streak;
}

export function getCurrentStreak() {
  return parseInt(localStorage.getItem(STORAGE_KEYS.streakCount) || "0", 10);
}

export function getUnlockedAchievements() {
  return getStoredAchievements();
}

export function evaluateAndUnlockAchievements(context) {
  // context: { isPassed, score, totalQuestions, wrongAnswers, allAnswers, mode, durationSeconds, finishedAtISOString, hasDiemLietWrong, diemLietWrongCount }
  const unlocked = new Set(getStoredAchievements());
  const newlyUnlocked = [];

  // Streaks (count per day regardless of pass/fail)
  const streak = updateStreakOnExamComplete(
    new Date(context.finishedAtISOString || Date.now())
  );
  if (streak >= 3 && !unlocked.has(ACHIEVEMENTS.STREAK_3)) {
    unlocked.add(ACHIEVEMENTS.STREAK_3);
    newlyUnlocked.push(ACHIEVEMENTS.STREAK_3);
  }
  if (streak >= 7 && !unlocked.has(ACHIEVEMENTS.STREAK_7)) {
    unlocked.add(ACHIEVEMENTS.STREAK_7);
    newlyUnlocked.push(ACHIEVEMENTS.STREAK_7);
  }
  if (streak >= 30 && !unlocked.has(ACHIEVEMENTS.STREAK_30)) {
    unlocked.add(ACHIEVEMENTS.STREAK_30);
    newlyUnlocked.push(ACHIEVEMENTS.STREAK_30);
  }

  if (context.isPassed) {
    // First pass: first time achieving a passed exam
    if (!unlocked.has(ACHIEVEMENTS.FIRST_PASS)) {
      unlocked.add(ACHIEVEMENTS.FIRST_PASS);
      newlyUnlocked.push(ACHIEVEMENTS.FIRST_PASS);
    }

    // Perfect score
    if (context.score === 100 && !unlocked.has(ACHIEVEMENTS.PERFECT_SCORE)) {
      unlocked.add(ACHIEVEMENTS.PERFECT_SCORE);
      newlyUnlocked.push(ACHIEVEMENTS.PERFECT_SCORE);
    }

    // Night owl: finish time between 00:00 and 04:00 local
    try {
      const finished = new Date(context.finishedAtISOString || Date.now());
      const hour = finished.getHours();
      if (hour >= 0 && hour < 4 && !unlocked.has(ACHIEVEMENTS.NIGHT_OWL)) {
        unlocked.add(ACHIEVEMENTS.NIGHT_OWL);
        newlyUnlocked.push(ACHIEVEMENTS.NIGHT_OWL);
      }
    } catch {}

    // Speed run: duration <= 5 minutes (applies to any mode completed within 5 minutes)
    if (
      context.durationSeconds !== undefined &&
      context.durationSeconds <= 5 * 60 &&
      !unlocked.has(ACHIEVEMENTS.SPEED_RUN)
    ) {
      unlocked.add(ACHIEVEMENTS.SPEED_RUN);
      newlyUnlocked.push(ACHIEVEMENTS.SPEED_RUN);
    }

    // Learn from mistakes: pass an exam in 'wrong' practice/exam mode
    if (
      context.mode === "wrong" &&
      !unlocked.has(ACHIEVEMENTS.LEARN_FROM_MISTAKES)
    ) {
      unlocked.add(ACHIEVEMENTS.LEARN_FROM_MISTAKES);
      newlyUnlocked.push(ACHIEVEMENTS.LEARN_FROM_MISTAKES);
    }

    // Diem liet master: pass without any diem liet wrong
    if (
      !context.hasDiemLietWrong &&
      !unlocked.has(ACHIEVEMENTS.DIEM_LIET_MASTER)
    ) {
      unlocked.add(ACHIEVEMENTS.DIEM_LIET_MASTER);
      newlyUnlocked.push(ACHIEVEMENTS.DIEM_LIET_MASTER);
    }

    // Sign master: in passed exam, 100% correct on questions that have images (proxy for biển báo)
    if (Array.isArray(context.allAnswers)) {
      const signAnswers = context.allAnswers.filter((a) => !!a.image);
      if (
        signAnswers.length > 0 &&
        signAnswers.every((a) => a.isCorrect) &&
        !unlocked.has(ACHIEVEMENTS.SIGN_MASTER)
      ) {
        unlocked.add(ACHIEVEMENTS.SIGN_MASTER);
        newlyUnlocked.push(ACHIEVEMENTS.SIGN_MASTER);
      }
    }
  }

  const list = Array.from(unlocked);
  storeAchievements(list);

  // Return both the full list and newly unlocked achievements
  return {
    allAchievements: list,
    newlyUnlocked: newlyUnlocked,
  };
}

export function resetAchievements() {
  storeAchievements([]);
}
