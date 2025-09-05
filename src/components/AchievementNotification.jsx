import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Slide,
  Fade,
  Grow,
} from "@mui/material";
import { Close, Celebration, EmojiEvents, Star } from "@mui/icons-material";
import { ACHIEVEMENT_META } from "./achievements";

const AchievementNotification = ({ achievementId, onClose }) => {
  const [show, setShow] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const achievement = ACHIEVEMENT_META[achievementId];

  useEffect(() => {
    if (achievementId) {
      setShow(true);

      // Animation sequence
      setTimeout(() => setShowIcon(true), 300);
      setTimeout(() => setShowContent(true), 600);

      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievementId]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!achievementId || !achievement) return null;

  return (
    <Slide direction="left" in={show} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 9999,
          maxWidth: 400,
          minWidth: 350,
        }}
      >
        <Card
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            borderRadius: 3,
            overflow: "visible",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              background:
                "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)",
              borderRadius: 4,
              zIndex: -1,
              animation: "gradientShift 3s ease infinite",
            },
            "@keyframes gradientShift": {
              "0%": {
                background:
                  "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)",
              },
              "25%": {
                background:
                  "linear-gradient(45deg, #4ecdc4, #45b7d1, #96ceb4, #ff6b6b)",
              },
              "50%": {
                background:
                  "linear-gradient(45deg, #45b7d1, #96ceb4, #ff6b6b, #4ecdc4)",
              },
              "75%": {
                background:
                  "linear-gradient(45deg, #96ceb4, #ff6b6b, #4ecdc4, #45b7d1)",
              },
              "100%": {
                background:
                  "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)",
              },
            },
          }}
        >
          <CardContent sx={{ p: 3, position: "relative" }}>
            {/* Close button */}
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "white",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <Close />
            </IconButton>

            {/* Achievement icon */}
            <Grow in={showIcon} timeout={500}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    animation: "pulse 2s infinite",
                    "@keyframes pulse": {
                      "0%": {
                        transform: "scale(1)",
                        boxShadow: "0 0 0 0 rgba(255, 255, 255, 0.7)",
                      },
                      "70%": {
                        transform: "scale(1.05)",
                        boxShadow: "0 0 0 10px rgba(255, 255, 255, 0)",
                      },
                      "100%": {
                        transform: "scale(1)",
                        boxShadow: "0 0 0 0 rgba(255, 255, 255, 0)",
                      },
                    },
                  }}
                >
                  <Typography component="span" sx={{ fontSize: 40 }}>
                    {achievement.icon}
                  </Typography>
                </Box>

                {/* Floating celebration icons */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -10,
                    left: -10,
                    animation: "float 3s ease-in-out infinite",
                    "@keyframes float": {
                      "0%, 100%": { transform: "translateY(0px)" },
                      "50%": { transform: "translateY(-10px)" },
                    },
                  }}
                >
                  <Celebration sx={{ color: "#FFD700", fontSize: 24 }} />
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    top: -5,
                    right: -15,
                    animation: "float 3s ease-in-out infinite 1s",
                  }}
                >
                  <Star sx={{ color: "#FFD700", fontSize: 20 }} />
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -10,
                    left: 10,
                    animation: "float 3s ease-in-out infinite 2s",
                  }}
                >
                  <EmojiEvents sx={{ color: "#FFD700", fontSize: 18 }} />
                </Box>
              </Box>
            </Grow>

            {/* Achievement content */}
            <Fade in={showContent} timeout={800}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  🎉 Thành tựu mới!
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {achievement.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.9,
                    lineHeight: 1.4,
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {achievement.description}
                </Typography>
              </Box>
            </Fade>
          </CardContent>
        </Card>
      </Box>
    </Slide>
  );
};

export default AchievementNotification;
