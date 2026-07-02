import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const savedNotification = localStorage.getItem('fadjma_notification');
    if (savedNotification) {
      setNotification(savedNotification);
      localStorage.removeItem('fadjma_notification');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('fadjma_token', data.token);
      localStorage.setItem('fadjma_user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de la connexion');
    }
  };

  return (
    <div className="login-page">
      <style>{`
        :root { --primary: #00a86b; --bg: #f8fafc; --surface: #fff; --border: #d1d5db; --text: #111827; --muted: #475569; }
        .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 28px; background: var(--bg); }
        .card { width: 100%; max-width: 440px; background: var(--surface); border-radius: 28px; padding: 32px; box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08); }
        .card h2 { margin: 0 0 18px; color: var(--primary); font-size: 2rem; }
        .form-group { display: grid; gap: 10px; margin-bottom: 16px; }
        .form-group label { color: var(--text); font-weight: 600; }
        .form-group input { width: 100%; padding: 14px 16px; border: 1px solid var(--border); border-radius: 16px; background: #fff; color: var(--text); }
        .btn { width: 100%; background: var(--primary); color: #fff; border: none; border-radius: 16px; padding: 14px 16px; font-weight: 700; cursor: pointer; }
        .muted { margin-top: 18px; color: var(--muted); font-size: 0.96rem; }
        .muted a { color: var(--primary); text-decoration: none; }
        .message { margin-top: 14px; color: #dc2626; font-size: 0.95rem; }
        .success { margin-top: 14pcest sa ou
        x; color: #059669; font-size: 0.95rem; }
        @media (max-width: 520px) { .card { padding: 24px; } }
      `}</style>
      <div className="card">
        <h2>Se connecter</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn" type="submit">Se connecter</button>
        </form>
        {notification && <div className="success">{notification}</div>}
        {error && <div className="message">{error}</div>}
        <div className="muted">Pas de compte ? <a href="/register">Créer un compte</a></div>
      </div>
    </div>
  );
}
