// src/stores/themeStore.ts
import { createSignal, onMount } from 'solid-js';

const [theme, setTheme] = createSignal<'light' | 'dark'>('light');

onMount(() => {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') {
    setTheme('dark');
    document.documentElement.classList.add('dark');
  }
});

function toggleTheme() {
  const next = theme() === 'light' ? 'dark' : 'light';
  setTheme(next);
  localStorage.setItem('theme', next);
  document.documentElement.classList.toggle('dark', next === 'dark');
}

export { theme, toggleTheme };
