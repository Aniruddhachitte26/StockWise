const themeConfig = {
  light: {
    primary: '#1E88E5',
    secondary: '#00ACC1',
    accent: '#43A047',
    danger: '#E53935',
    neutralBg: '#F9FAFB',
    card: '#FFFFFF',
    textPrimary: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0'
  },
  dark: {
    primary: '#90CAF9',
    secondary: '#80DEEA',
    accent: '#A5D6A7',
    danger: '#EF9A9A',
    neutralBg: '#121212',
    card: '#1E1E1E',
    textPrimary: '#E0E0E0',
    textSecondary: '#BDBDBD',
    border: '#2E2E2E'
  }
};

// Detect preferred color scheme
const detectColorScheme = () => {
  // Check for saved preference
  const savedTheme = localStorage.getItem('stockwise-theme');
  if (savedTheme) {
    return savedTheme;
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

// Set theme in localStorage
const setThemePreference = (theme) => {
  localStorage.setItem('stockwise-theme', theme);
  applyTheme(theme);
};

// Apply theme to document
const applyTheme = (theme) => {
  const root = document.documentElement;
  const colors = themeConfig[theme];
  
  // Set CSS variables
  Object.keys(colors).forEach(key => {
    root.style.setProperty(`--${key}`, colors[key]);
  });
  
  // Set data-theme attribute
  document.body.setAttribute('data-theme', theme);
  
  // Add/remove dark class
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
};

// Initialize theme
const initTheme = () => {
  const theme = detectColorScheme();
  applyTheme(theme);
  
  // Listen for system preference changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      const newTheme = event.matches ? 'dark' : 'light';
      setThemePreference(newTheme);
    });
  }
};

export { themeConfig, detectColorScheme, setThemePreference, applyTheme, initTheme };