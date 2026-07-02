import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isLogged = Boolean(localStorage.getItem('fadjma_token'));

  const handleToggle = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('fadjma_token');
    localStorage.removeItem('fadjma_user');
    closeMenu();
    navigate('/login');
  };

  return (
    <header className="fm-navbar">
      <div className="fm-container">
        <NavLink to="/" className="fm-logo" onClick={closeMenu}>
          <span>Fadj</span> ma
        </NavLink>

        <button
          className={`fm-burger ${open ? 'open' : ''}`}
          onClick={handleToggle}
          aria-label="Menu mobile"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`fm-links ${open ? 'open' : ''}`}>
          <NavLink to="/" className="fm-link" onClick={closeMenu}>
            Accueil
          </NavLink>
          <NavLink to="/" className="fm-link" onClick={closeMenu}>
            Pharmacies
          </NavLink>
          {isLogged && (
            <NavLink to="/dashboard" className="fm-link" onClick={closeMenu}>
              Dashboard
            </NavLink>
          )}
          {!isLogged && (
            <>
              <NavLink to="/login" className="fm-link" onClick={closeMenu}>
                Se connecter
              </NavLink>
              <NavLink to="/register" className="fm-link" onClick={closeMenu}>
                S'inscrire
              </NavLink>
            </>
          )}
          {isLogged && (
            <button className="fm-link fm-logout" type="button" onClick={handleLogout}>
              Déconnexion
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
