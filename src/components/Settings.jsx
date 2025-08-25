import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Slider,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Brightness4,
  Brightness7,
  ZoomIn,
  ZoomOut,
  RestartAlt,
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const [open, setOpen] = useState(false);
  const {
    darkMode,
    fontSize,
    toggleDarkMode,
    increaseFontSize,
    decreaseFontSize,
    setFontSizeDirectly,
    resetFontSize,
  } = useTheme();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFontSizeChange = (event, newValue) => {
    setFontSizeDirectly(newValue);
  };

  return (
    <>
      <Tooltip title="Cài đặt">
        <IconButton
          onClick={handleOpen}
          className="icon-scale"
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 1000,
            backgroundColor: 'background.paper',
            boxShadow: 3,
            '&:hover': {
              backgroundColor: 'action.hover',
              transform: 'rotate(90deg)',
            },
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        TransitionProps={{
          timeout: 400,
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <SettingsIcon />
            <Typography variant="h6">Cài đặt</Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ py: 2 }}>
            {/* Theme Settings */}
            <Typography variant="h6" gutterBottom>
              Giao diện
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  icon={<Brightness7 />}
                  checkedIcon={<Brightness4 />}
                />
              }
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography>
                    {darkMode ? 'Dark Mode' : 'Light Mode'}
                  </Typography>
                </Box>
              }
            />

            <Divider sx={{ my: 3 }} />

            {/* Font Size Settings */}
            <Typography variant="h6" gutterBottom>
              Cỡ chữ
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Tooltip title="Giảm cỡ chữ">
                  <IconButton onClick={decreaseFontSize} disabled={fontSize <= 12}>
                    <ZoomOut />
                  </IconButton>
                </Tooltip>
                
                <Typography variant="h6" sx={{ minWidth: 60, textAlign: 'center' }}>
                  {fontSize}px
                </Typography>
                
                <Tooltip title="Tăng cỡ chữ">
                  <IconButton onClick={increaseFontSize} disabled={fontSize >= 24}>
                    <ZoomIn />
                  </IconButton>
                </Tooltip>
              </Box>

              <Slider
                value={fontSize}
                onChange={handleFontSizeChange}
                min={12}
                max={24}
                step={2}
                marks={[
                  { value: 12, label: '12px' },
                  { value: 16, label: '16px' },
                  { value: 20, label: '20px' },
                  { value: 24, label: '24px' },
                ]}
                valueLabelDisplay="auto"
                sx={{ mb: 2 }}
              />

              <Button
                variant="outlined"
                startIcon={<RestartAlt />}
                onClick={resetFontSize}
                size="small"
              >
                Đặt lại cỡ chữ
              </Button>
            </Box>

            {/* Preview */}
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Xem trước
            </Typography>
            
            <Box
              sx={{
                p: 2,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                backgroundColor: 'background.paper',
              }}
            >
              <Typography variant="h1" gutterBottom>
                Tiêu đề H1
              </Typography>
              <Typography variant="h2" gutterBottom>
                Tiêu đề H2
              </Typography>
              <Typography variant="body1" gutterBottom>
                Đây là văn bản mẫu với cỡ chữ hiện tại ({fontSize}px). 
                Bạn có thể điều chỉnh cỡ chữ để phù hợp với nhu cầu đọc của mình.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Văn bản phụ với cỡ chữ nhỏ hơn.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Settings;
