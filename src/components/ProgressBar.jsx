import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

const ProgressBar = ({ current, total, answeredCount }) => {
  const progress = (current / total) * 100;

  return (
    <Box sx={{ mb: 3 }} className="slide-in-left">
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Câu {current} / {total}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {Math.round(progress)}% hoàn thành
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#2196f3",
            borderRadius: 4,
          },
        }}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Đã trả lời: {answeredCount}/{total}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Còn lại: {total - answeredCount}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProgressBar;
