// src/stores/themeStore.ts
import { createSignal, createRoot } from 'solid-js';

export const themeStore = createRoot(() => {
  const [theme, setTheme] = createSignal<'light' | 'dark'>('dark');

  const applyTheme = (t: 'light' | 'dark') => {
    document.documentElement.classList.toggle('dark', t === 'dark');
    localStorage.setItem('theme', t);
  };

  const toggleTheme = () => {
    const newTheme = theme() === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // 初期化処理
  const stored = localStorage.getItem('theme');
  const initial = stored === 'light' ? 'light' : 'dark';
  setTheme(initial);
  applyTheme(initial);

  return { theme, toggleTheme };
});
