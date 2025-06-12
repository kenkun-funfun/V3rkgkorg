// src/App.tsx

import { Router, Route } from '@solidjs/router';
import PlayScreen from './routes/PlayScreen';

export default function App() {
  return (
    <Router>
      <Route path="/" component={PlayScreen} />
    </Router>
  );
}
