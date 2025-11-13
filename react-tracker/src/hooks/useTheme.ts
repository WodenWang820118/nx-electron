import { useEffect, useState } from 'react';
import { themes } from '../themes';

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    initTheme();
  }, []);

  const switchPrimeReactTheme = (isDark: boolean) => {
    const themeUrl = isDark ? themes.dark : themes.light;

    // Find and update the theme link
    let themeLink = document.getElementById('app-theme') as HTMLLinkElement;

    if (!themeLink) {
      // Create if it doesn't exist
      themeLink = document.createElement('link');
      themeLink.id = 'app-theme';
      themeLink.rel = 'stylesheet';
      document.head.appendChild(themeLink);
    }

    themeLink.href = themeUrl;
  };

  const initTheme = () => {
    const saved = localStorage.getItem('theme');
    const prefersDark = globalThis.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    const useDark = saved ? saved === 'dark' : prefersDark;

    if (useDark) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
      switchPrimeReactTheme(true);
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
      switchPrimeReactTheme(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      switchPrimeReactTheme(true);
    } else {
      document.documentElement.classList.remove('dark');
      switchPrimeReactTheme(false);
    }

    setTheme(newTheme);
  };

  return { theme, toggleTheme, initTheme };
};
