import './bootstrap';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Catch-all untuk React Router */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

// Render ke DOM
const root = createRoot(document.getElementById('app'));
root.render(<AppRouter />);
