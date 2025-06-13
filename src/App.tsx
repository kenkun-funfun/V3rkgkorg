// src/App.tsx

import { Router, Route } from '@solidjs/router';
import PlayScreen from './routes/PlayScreen';
import Toast from './components/Toast';

export default function App() {
  return (
    <>
      <Router>
        <Route path="/" component={PlayScreen} />
        {/* もう1ルートあるならここ */}
      </Router>
      <Toast /> {/* ✅ トースト表示をルートに追加 */}
    </>
  );
}
