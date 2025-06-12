// src/App.tsx

import { Router, Route } from '@solidjs/router';
import PlayScreen from './routes/PlayScreen';
import ManageScreen from './routes/ManageScreen';

export default function App() {
  return (
    <Router>
      <Route path="/" component={PlayScreen} />
      <Route path="/manage" component={ManageScreen} />
    </Router>
  );
}