import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import { AccessTime } from "@mui/icons-material";

const Timer = ({ duration, onTimeUp, isRunning = true }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, onTimeUp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;
  const isWarning = timeLeft <= 300; // Cảnh báo khi còn 5 phút
  const isCritical = timeLeft <= 60; // Cảnh báo khi còn 1 phút

  return (
    <Box
      className={`slide-in-right ${isCritical ? "shake-animation" : ""}`}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        backgroundColor: isCritical
          ? "#ffebee"
          : isWarning
          ? "#fff3e0"
          : "#f5f5f5",
        borderRadius: 2,
        border: isCritical
          ? "2px solid #f44336"
          : isWarning
          ? "2px solid #ff9800"
          : "1px solid #e0e0e0",
      }}
    >
      <AccessTime
        className={isCritical ? "pulse-animation" : ""}
        sx={{
          color: isCritical ? "#f44336" : isWarning ? "#ff9800" : "#666",
          fontSize: 24,
        }}
      />

      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: "bold",
            color: isCritical ? "#f44336" : isWarning ? "#ff9800" : "#333",
          }}
        >
          {formatTime(timeLeft)}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            mt: 1,
            height: 6,
            borderRadius: 3,
            backgroundColor: "#e0e0e0",
            "& .MuiLinearProgress-bar": {
              backgroundColor: isCritical
                ? "#f44336"
                : isWarning
                ? "#ff9800"
                : "#2196f3",
            },
          }}
        />
      </Box>

      {isWarning && (
        <Typography
          variant="body2"
          sx={{
            color: isCritical ? "#f44336" : "#ff9800",
            fontWeight: "bold",
          }}
        >
          {isCritical ? "Hết thời gian!" : "Còn ít thời gian!"}
        </Typography>
      )}
    </Box>
  );
};

export default Timer;
