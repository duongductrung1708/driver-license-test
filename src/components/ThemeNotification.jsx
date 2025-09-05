import React, { useEffect, useState } from "react";
import { Snackbar, Alert, Box, Typography } from "@mui/material";
import { useTheme } from "../context/ThemeContext";

const ThemeNotification = () => {
  const { darkMode, fontSize } = useTheme();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  useEffect(() => {
    // Hiển thị thông báo khi thay đổi theme
    setMessage(`Đã chuyển sang ${darkMode ? "Dark Mode" : "Light Mode"}`);
    setSeverity("success");
    setOpen(true);
  }, [darkMode]);

  useEffect(() => {
    // Hiển thị thông báo khi thay đổi font size
    if (fontSize !== 16) {
      // Chỉ hiển thị khi không phải size mặc định
      setMessage(`Cỡ chữ đã được thay đổi thành ${fontSize}px`);
      setSeverity("info");
      setOpen(true);
    }
  }, [fontSize]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      TransitionProps={{
        timeout: 400,
      }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2">{message}</Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default ThemeNotification;
