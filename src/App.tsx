// src/App.tsx

import { Router, Route } from '@solidjs/router';
import PlayScreen from './routes/PlayScreen';
import Toast from './components/Toast';
import { themeStore } from './stores/themeStore';
import { lang } from './stores/i18nStore'; // ✅ 追加

// 呼び出すだけで副作用実行
themeStore;
lang(); // ✅ 言語変更によって App.tsx を再評価させる

export default function App() {
  return (
    <>
      <Router>
        <Route path="/" component={PlayScreen} />
      </Router>
      <Toast />
    </>
  );
}
