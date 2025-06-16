// src/App.tsx

import { Router, Route } from '@solidjs/router';
import PlayScreen from './routes/PlayScreen';
import Toast from './components/Toast';
import { themeStore } from './stores/themeStore'; // ✅ 追加（副作用発動）
import ImageJsonMaker from './routes/ImageJsonMaker';


// 呼び出すだけで副作用実行
themeStore;

export default function App() {
  return (
    <>
      <Router>
        <Route path="/" component={PlayScreen} />
        <Route path="/json-maker" component={ImageJsonMaker} />
        {/* もう1ルートあるならここ */}
      </Router>
      <Toast /> {/* ✅ トースト表示をルートに追加 */}
    </>
  );
}
