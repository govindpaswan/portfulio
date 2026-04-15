import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function getColors(isDark) {
  if (isDark) {
    return {
      bg1: '#0a0a14', bg2: '#0d0d1a',
      surface: '#161626', surface2: '#1e1e35',
      surfaceHover: 'rgba(255,255,255,0.04)',
      text: '#ffffff', textMuted: 'rgba(255,255,255,0.55)', textDim: 'rgba(255,255,255,0.28)',
      border: 'rgba(255,255,255,0.07)', borderMd: 'rgba(255,255,255,0.13)',
      navBg: 'rgba(10,10,20,0.92)', navBorder: 'rgba(255,255,255,0.07)',
      footerBg: '#080812',
      marqueeCard1: 'rgba(255,255,255,0.03)', marqueeCard2: 'rgba(0,212,255,0.04)',
      marqueeBrd1: 'rgba(255,255,255,0.07)', marqueeBrd2: 'rgba(0,212,255,0.1)',
      marqueeText1: 'rgba(255,255,255,0.60)', marqueeText2: 'rgba(0,212,255,0.55)',
      sectionLabel: 'rgba(255,255,255,0.20)',
      shadow: '0 4px 24px rgba(0,0,0,0.3)', inputBg: '#1e1e35',
      heroBg: '#0a0a14', heroText: '#ffffff', heroTextSub: 'rgba(255,255,255,0.45)',
      skillBg: '#0d0d1a',
    };
  }
  // ── LIGHT ── Clean white/gray, NO blue tints
  return {
    bg1: '#ffffff',       // pure white
    bg2: '#f8f9fa',       // very light gray
    surface: '#ffffff',
    surface2: '#f3f4f6',
    surfaceHover: 'rgba(0,0,0,0.04)',
    text: '#111827',      // near black
    textMuted: '#4b5563', // medium gray
    textDim: '#9ca3af',   // light gray
    border: '#e5e7eb',    // light border
    borderMd: '#d1d5db',
    navBg: 'rgba(255,255,255,0.95)',
    navBorder: '#e5e7eb',
    footerBg: '#111827',  // dark footer on light mode (looks good)
    marqueeCard1: '#ffffff', marqueeCard2: 'rgba(0,212,255,0.06)',
    marqueeBrd1: '#e5e7eb', marqueeBrd2: 'rgba(0,212,255,0.2)',
    marqueeText1: '#4b5563', marqueeText2: '#0891b2',
    sectionLabel: '#9ca3af',
    shadow: '0 1px 12px rgba(0,0,0,0.08)', inputBg: '#f9fafb',
    heroBg: '#ffffff',
    heroText: '#111827',
    heroTextSub: '#6b7280',
    skillBg: '#f8f9fa',
  };
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('gp-theme') || 'dark');
  const isDark = theme === 'dark';
  const colors = getColors(isDark);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.backgroundColor = colors.bg1;
    document.body.style.color = colors.text;
    localStorage.setItem('gp-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
};
