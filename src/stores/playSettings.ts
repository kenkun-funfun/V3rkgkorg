// src/stores/playSettings.ts
import { createSignal } from 'solid-js';

const [chimeEnabled, setChimeEnabled] = createSignal<boolean>(() => {
  return localStorage.getItem('chimeEnabled') !== 'false';
});

export { chimeEnabled, setChimeEnabled };
