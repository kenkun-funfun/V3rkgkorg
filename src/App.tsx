// src/App.tsx

import { Router, Route } from '@solidjs/router';
import { createEffect, onMount } from 'solid-js';
import PlayScreen from './routes/PlayScreen';
import Toast from './components/Toast';
import { themeStore } from './stores/themeStore';
import { lang } from './stores/i18nStore'; // ✅ 言語管理ストア

// ✅ 呼び出すだけで副作用実行（テーマ適用）
themeStore;

export default function App() {
  // ✅ 初期langを反映
  onMount(() => {
    document.documentElement.lang = lang();
  });

  // ✅ langが変更されたら反映
  createEffect(() => {
    document.documentElement.lang = lang();
  });

  return (
    <>
      <Router>
        <Route path="/" component={PlayScreen} />
      </Router>
      <Toast />
    </>
  );
}
