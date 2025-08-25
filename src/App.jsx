import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';
import Home from './pages/Home';
import Practice from './pages/Practice';
import Exam from './pages/Exam';
import Result from './pages/Result';
import Settings from './components/Settings';
import ThemeNotification from './components/ThemeNotification';
import ThemeInfo from './components/ThemeInfo';
import './styles/theme.css';

// Component để tạo theme động
const AppContent = () => {
  const { darkMode, fontSize } = useTheme();

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2196f3',
        dark: '#1976d2',
        light: '#64b5f6',
      },
      secondary: {
        main: '#4caf50',
      },
      error: {
        main: '#f44336',
      },
      warning: {
        main: '#ff9800',
      },
      info: {
        main: '#2196f3',
      },
      success: {
        main: '#4caf50',
      },
      background: {
        default: darkMode ? '#121212' : '#ffffff',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      success: {
        main: '#4caf50',
        dark: '#388e3c',
        light: '#81c784',
        50: darkMode ? '#1b5e20' : '#e8f5e8',
      },
      error: {
        main: '#f44336',
        dark: '#d32f2f',
        light: '#e57373',
        50: darkMode ? '#b71c1c' : '#ffebee',
      },
      warning: {
        main: '#ff9800',
        dark: '#f57c00',
        light: '#ffb74d',
      },
    },
    typography: {
      fontSize: fontSize,
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontWeight: 700,
        fontSize: `${fontSize * 2.5}px`,
      },
      h2: {
        fontWeight: 700,
        fontSize: `${fontSize * 2}px`,
      },
      h3: {
        fontWeight: 600,
        fontSize: `${fontSize * 1.75}px`,
      },
      h4: {
        fontWeight: 600,
        fontSize: `${fontSize * 1.5}px`,
      },
      h5: {
        fontWeight: 600,
        fontSize: `${fontSize * 1.25}px`,
      },
      h6: {
        fontWeight: 600,
        fontSize: `${fontSize * 1.125}px`,
      },
      body1: {
        fontSize: `${fontSize}px`,
      },
      body2: {
        fontSize: `${fontSize * 0.875}px`,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 500,
            fontSize: `${fontSize}px`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: darkMode 
              ? '0 2px 8px rgba(255,255,255,0.1)' 
              : '0 2px 8px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div className={`${darkMode ? 'dark-mode-scrollbar' : 'light-mode-scrollbar'} page-transition`}>
        <Router>
          <Settings />
          <ThemeNotification />
          <ThemeInfo />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </Router>
      </div>
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
