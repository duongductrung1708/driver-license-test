import React from "react";
import { Chip, Box, Tooltip } from "@mui/material";
import { useTheme } from "../context/ThemeContext";

const ThemeInfo = () => {
  const { darkMode, fontSize } = useTheme();

  return (
    <Box
      className="slide-in-left"
      sx={{
        position: "fixed",
        bottom: 16,
        left: 16,
        zIndex: 1000,
        display: "flex",
        gap: 1,
      }}
    >
      <Tooltip title="Chế độ giao diện hiện tại">
        <Chip
          label={darkMode ? "🌙 Dark" : "☀️ Light"}
          size="small"
          variant="outlined"
          sx={{
            backgroundColor: "background.paper",
            opacity: 0.8,
            "&:hover": {
              opacity: 1,
            },
          }}
        />
      </Tooltip>

      <Tooltip title="Cỡ chữ hiện tại">
        <Chip
          label={`${fontSize}px`}
          size="small"
          variant="outlined"
          sx={{
            backgroundColor: "background.paper",
            opacity: 0.8,
            "&:hover": {
              opacity: 1,
            },
          }}
        />
      </Tooltip>
    </Box>
  );
};

export default ThemeInfo;
