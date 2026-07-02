import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [nomPharmacie, setNomPharmacie] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [quartier, setQuartier] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      const { data } = await api.post('/auth/register', { nomPharmacie, email, password, quartier });
      localStorage.setItem('fadjma_token', data.token);
      localStorage.setItem('fadjma_user', JSON.stringify(data.user));
      setSuccess('Inscription réussie ! Redirection...');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l’inscription');
    }
  };

  return (
    <div className="auth-page">
      <style>{`
        :root { --primary: #00a86b; --bg: #f8fafc; --surface: #fff; --text: #111827; --border: #d1d5db; }
        .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 32px; background: var(--bg); }
        .auth-card { width: 100%; max-width: 460px; background: var(--surface); padding: 32px; border-radius: 28px; box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08); }
        .auth-card h2 { margin: 0 0 20px; color: var(--primary); font-size: 2rem; }
        .form-group { display: grid; gap: 10px; margin-bottom: 16px; }
        .form-group label { color: var(--text); font-weight: 600; }
        .form-group input { width: 100%; padding: 14px 16px; border: 1px solid var(--border); border-radius: 16px; background: #fff; font-size: 1rem; color: var(--text); }
        .auth-actions { display: flex; flex-direction: column; gap: 14px; margin-top: 20px; }
        .btn-submit { background: var(--primary); color: #fff; border: none; border-radius: 16px; padding: 14px 18px; font-weight: 700; cursor: pointer; }
        .message { color: #dc2626; margin-top: 12px; }
        .success { color: #047857; margin-top: 12px; }
        .auth-note { margin-top: 18px; color: #475569; font-size: 0.95rem; }
        .auth-link { color: var(--primary); text-decoration: none; }
        @media (max-width: 520px) { .auth-card { padding: 22px; } }
      `}</style>
      <div className="auth-card">
        <h2>Inscription</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom de la pharmacie</label>
            <input value={nomPharmacie} onChange={(e) => setNomPharmacie(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Quartier</label>
            <input value={quartier} onChange={(e) => setQuartier(e.target.value)} required />
          </div>
          <div className="auth-actions">
            <button className="btn-submit" type="submit">Créer mon compte</button>
          </div>
        </form>
        {error && <div className="message">{error}</div>}
        {success && <div className="success">{success}</div>}
        <p className="auth-note">Déjà inscrit ? <a className="auth-link" href="/login">Se connecter</a></p>
      </div>
    </div>
  );
}
