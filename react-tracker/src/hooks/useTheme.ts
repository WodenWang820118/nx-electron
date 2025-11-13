import { useEffect, useState } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    initTheme();
  }, []);

  const initTheme = () => {
    const saved = localStorage.getItem('theme');
    const prefersDark = globalThis.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    const useDark = saved ? saved === 'dark' : prefersDark;

    if (useDark) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setTheme(newTheme);
  };

  return { theme, toggleTheme, initTheme };
};
