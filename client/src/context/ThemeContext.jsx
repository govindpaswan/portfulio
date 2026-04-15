import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// ── All theme-aware color tokens ──────────────────────────────────────
export function getColors(isDark) {
  return {
    bg1:         isDark ? '#0a0a14'                    : '#f0f4ff',
    bg2:         isDark ? '#0d0d1a'                    : '#e6ecff',
    surface:     isDark ? '#161626'                    : '#ffffff',
    surface2:    isDark ? '#1e1e35'                    : '#eef1ff',
    surfaceHover:isDark ? 'rgba(255,255,255,0.04)'    : 'rgba(0,0,0,0.04)',
    text:        isDark ? '#ffffff'                    : '#0d0d1a',
    textMuted:   isDark ? 'rgba(255,255,255,0.50)'    : 'rgba(13,13,26,0.60)',
    textDim:     isDark ? 'rgba(255,255,255,0.28)'    : 'rgba(13,13,26,0.35)',
    border:      isDark ? 'rgba(255,255,255,0.07)'    : 'rgba(0,0,0,0.09)',
    borderMd:    isDark ? 'rgba(255,255,255,0.12)'    : 'rgba(0,0,0,0.14)',
    cardBg:      isDark ? '#161626'                    : '#ffffff',
    cardBorder:  isDark ? 'rgba(255,255,255,0.07)'    : 'rgba(0,0,0,0.09)',
    inputBg:     isDark ? '#1e1e35'                    : '#f3f6ff',
    navBg:       isDark ? 'rgba(10,10,20,0.92)'       : 'rgba(240,244,255,0.95)',
    navBorder:   isDark ? 'rgba(255,255,255,0.06)'    : 'rgba(0,0,0,0.08)',
    footerBg:    isDark ? '#080812'                    : '#dde5ff',
    marqueeCard1:isDark ? 'rgba(255,255,255,0.03)'    : 'rgba(255,255,255,0.85)',
    marqueeCard2:isDark ? 'rgba(0,212,255,0.04)'      : 'rgba(0,212,255,0.08)',
    marqueeBrd1: isDark ? 'rgba(255,255,255,0.07)'    : 'rgba(0,0,0,0.08)',
    marqueeBrd2: isDark ? 'rgba(0,212,255,0.1)'       : 'rgba(0,212,255,0.2)',
    marqueeText1:isDark ? 'rgba(255,255,255,0.60)'    : 'rgba(13,13,26,0.75)',
    marqueeText2:isDark ? 'rgba(0,212,255,0.55)'      : 'rgba(0,150,180,0.85)',
    sectionLabel:isDark ? 'rgba(255,255,255,0.20)'    : 'rgba(13,13,26,0.30)',
    skillBg:     isDark ? 'rgba(255,255,255,0.02)'    : 'rgba(0,0,0,0.03)',
    orb1:        isDark ? 'rgba(0,212,255,0.07)'      : 'rgba(0,212,255,0.12)',
    orb2:        isDark ? 'rgba(139,92,246,0.07)'     : 'rgba(139,92,246,0.10)',
    gradientBrd: isDark
      ? 'linear-gradient(#161626,#161626) padding-box, linear-gradient(135deg,rgba(0,212,255,0.2),rgba(139,92,246,0.2)) border-box'
      : 'linear-gradient(#ffffff,#ffffff) padding-box, linear-gradient(135deg,rgba(0,212,255,0.3),rgba(139,92,246,0.3)) border-box',
    shadow:      isDark ? '0 20px 40px rgba(0,212,255,0.05)' : '0 8px 30px rgba(0,0,0,0.08)',
  };
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('gp-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('gp-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  const isDark = theme === 'dark';

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
