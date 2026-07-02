import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <div className="app-root">
      <style>{`
        :root { --primary: #4dfcfa; --bg: #070914; --surface: rgba(13, 23, 42, 0.95); --text: #eff7ff; --muted: #8aa3c2; --border: rgba(255,255,255,0.08); }
        body { margin: 0; min-height: 100vh; font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background: radial-gradient(circle at top, rgba(79, 255, 255, 0.08), transparent 28%), linear-gradient(180deg, #05070f 0%, #090f1b 100%); color: var(--text); }
        .app-root main { padding: 20px 0; max-width: 1240px; margin: 0 auto; }
        a { color: inherit; text-decoration: none; }
      `}</style>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
