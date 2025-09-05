import React from "react";
import {
  IconButton,
  Tooltip,
  Box,
  Typography,
  Slider,
  Button,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  ZoomIn,
  ZoomOut,
  RestartAlt,
} from "@mui/icons-material";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const {
    darkMode,
    fontSize,
    toggleDarkMode,
    increaseFontSize,
    decreaseFontSize,
    setFontSizeDirectly,
    resetFontSize,
  } = useTheme();

  const handleFontSizeChange = (event, newValue) => {
    setFontSizeDirectly(newValue);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        backgroundColor: "background.paper",
        borderRadius: 2,
        p: 2,
        boxShadow: 3,
        minWidth: 200,
      }}
    >
      {/* Theme Toggle */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip
          title={darkMode ? "Chuyển sang Light Mode" : "Chuyển sang Dark Mode"}
        >
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Tooltip>
        <Typography variant="body2">
          {darkMode ? "Dark Mode" : "Light Mode"}
        </Typography>
      </Box>

      {/* Font Size Controls */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip title="Giảm cỡ chữ">
          <IconButton onClick={decreaseFontSize} color="inherit" size="small">
            <ZoomOut />
          </IconButton>
        </Tooltip>
        <Typography variant="body2" sx={{ minWidth: 40, textAlign: "center" }}>
          {fontSize}px
        </Typography>
        <Tooltip title="Tăng cỡ chữ">
          <IconButton onClick={increaseFontSize} color="inherit" size="small">
            <ZoomIn />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Font Size Slider */}
      <Box sx={{ width: "100%", mt: 1 }}>
        <Slider
          value={fontSize}
          onChange={handleFontSizeChange}
          min={12}
          max={24}
          step={2}
          marks
          size="small"
          valueLabelDisplay="auto"
        />
      </Box>

      {/* Reset Button */}
      <Button
        variant="outlined"
        size="small"
        startIcon={<RestartAlt />}
        onClick={resetFontSize}
        sx={{ mt: 1 }}
      >
        Reset Font
      </Button>
    </Box>
  );
};

export default ThemeToggle;
