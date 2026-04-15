import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function getColors(isDark) {
  return {
    // Backgrounds
    bg1:         isDark ? '#0a0a14'                      : '#f8fafc',
    bg2:         isDark ? '#0d0d1a'                      : '#f1f5f9',
    // Cards/surfaces
    surface:     isDark ? '#161626'                      : '#ffffff',
    surface2:    isDark ? '#1e1e35'                      : '#f8fafc',
    surfaceHover:isDark ? 'rgba(255,255,255,0.04)'       : 'rgba(15,23,42,0.04)',
    // Text
    text:        isDark ? '#ffffff'                      : '#0f172a',
    textMuted:   isDark ? 'rgba(255,255,255,0.55)'       : '#475569',
    textDim:     isDark ? 'rgba(255,255,255,0.28)'       : '#94a3b8',
    // Borders
    border:      isDark ? 'rgba(255,255,255,0.07)'       : '#e2e8f0',
    borderMd:    isDark ? 'rgba(255,255,255,0.13)'       : '#cbd5e1',
    // Nav
    navBg:       isDark ? 'rgba(10,10,20,0.92)'          : 'rgba(248,250,252,0.95)',
    navBorder:   isDark ? 'rgba(255,255,255,0.07)'       : '#e2e8f0',
    // Admin
    adminSide:   isDark ? '#0c0c1d'                      : '#1e293b',
    adminSideTxt:isDark ? 'rgba(255,255,255,0.45)'       : 'rgba(255,255,255,0.65)',
    adminMain:   isDark ? '#0a0a14'                      : '#f1f5f9',
    adminHead:   isDark ? 'rgba(10,10,20,0.88)'          : 'rgba(241,245,249,0.95)',
    // Footer
    footerBg:    isDark ? '#080812'                      : '#1e293b',
    // Marquee
    marqueeCard1:isDark ? 'rgba(255,255,255,0.03)'       : '#ffffff',
    marqueeCard2:isDark ? 'rgba(0,212,255,0.04)'         : 'rgba(0,212,255,0.07)',
    marqueeBrd1: isDark ? 'rgba(255,255,255,0.07)'       : '#e2e8f0',
    marqueeBrd2: isDark ? 'rgba(0,212,255,0.1)'          : 'rgba(0,212,255,0.22)',
    marqueeText1:isDark ? 'rgba(255,255,255,0.60)'       : '#475569',
    marqueeText2:isDark ? 'rgba(0,212,255,0.55)'         : '#0ea5e9',
    sectionLabel:isDark ? 'rgba(255,255,255,0.20)'       : '#94a3b8',
    // Misc
    shadow:      isDark ? '0 4px 24px rgba(0,0,0,0.3)'  : '0 4px 16px rgba(15,23,42,0.08)',
    cardShadow:  isDark ? 'none'                         : '0 1px 8px rgba(15,23,42,0.06)',
    inputBg:     isDark ? '#1e1e35'                      : '#f8fafc',
  };
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('gp-theme') || 'dark');
  const isDark = theme === 'dark';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    document.body.style.backgroundColor = isDark ? '#0a0a14' : '#f8fafc';
    localStorage.setItem('gp-theme', theme);
  }, [theme, isDark]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark, colors: getColors(isDark) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
};
