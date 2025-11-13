import { ref, watch } from 'vue';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const theme = ref<Theme>('light');

  // Initialize theme from localStorage or system preference
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      theme.value = savedTheme;
    } else if (globalThis.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.value = 'dark';
    }
    applyTheme(theme.value);
  };

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  };

  // Watch theme changes and apply
  watch(theme, (newTheme) => {
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });

  return {
    theme,
    toggleTheme,
    initTheme,
  };
}
