import React, { createContext, useContext, useEffect, useState } from 'react';
import { detectColorScheme, setThemePreference, initTheme } from '../../config/themeConfig';

// Create context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');
  
  useEffect(() => {
    // Initialize theme on component mount
    initTheme();
    setCurrentTheme(detectColorScheme());
    
    // Add event listener for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setCurrentTheme(newTheme);
      setThemePreference(newTheme);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    setThemePreference(newTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;