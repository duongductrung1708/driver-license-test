import { useTheme } from '../context/ThemeContext';

export const useAppTheme = () => {
  const themeContext = useTheme();
  
  return {
    ...themeContext,
    // Thêm các helper functions
    isDark: themeContext.darkMode,
    isLight: !themeContext.darkMode,
    fontSize: themeContext.fontSize,
    // Các preset font sizes
    fontSizes: {
      small: Math.max(themeContext.fontSize - 4, 8),
      medium: themeContext.fontSize,
      large: Math.min(themeContext.fontSize + 4, 28),
    },
  };
};
