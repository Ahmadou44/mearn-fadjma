import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formValues, setFormValues] = useState({ nom: '', prix: '', description: '', pharmacie: '', zone: '', latitude: '', longitude: '', disponibilite: true });

  const fetchInventory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/medicaments', { params: { limit: 100 } });
      setInventory(response.data.docs || []);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Impossible de charger le stock.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await api.post('/medicaments', {
        nom: formValues.nom.trim(),
        prix: Number(formValues.prix),
        description: formValues.description.trim(),
        pharmacie: formValues.pharmacie.trim(),
        zone: formValues.zone.trim(),
        latitude: Number(formValues.latitude),
        longitude: Number(formValues.longitude),
        disponibilite: formValues.disponibilite
      });

      setInventory((current) => [response.data, ...current]);
      setFormValues({ nom: '', prix: '', description: '', pharmacie: '', zone: '', latitude: '', longitude: '', disponibilite: true });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible d’ajouter le médicament.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce médicament ?')) return;
    try {
      await api.delete(`/medicaments/${id}`);
      setInventory((current) => current.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de supprimer ce médicament.');
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const response = await api.put(`/medicaments/${item._id}`, { disponibilite: !item.disponibilite });
      setInventory((current) => current.map((med) => (med._id === item._id ? response.data : med)));
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de mettre à jour la disponibilité.');
    }
  };
  const availableCount = useMemo(() => inventory.filter((item) => item.disponibilite).length, [inventory]);

  return (
    <main className="dashboard-page">
      <style>{`
        :root { --bg: #060712; --surface: rgba(12, 22, 38, 0.96); --surface-soft: rgba(16, 28, 48, 0.94); --border: rgba(255,255,255,0.08); --primary: #4dfcfa; --accent: #7c5cff; --text: #eff7ff; --muted: #8aa3c3; }
        .dashboard-page { min-height: 100vh; padding: 28px 24px 42px; max-width: 1200px; margin: 0 auto; color: var(--text); }
        .dashboard-top { display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap; margin-bottom: 28px; }
        .dashboard-top h1 { margin: 0; font-size: clamp(2rem, 3vw, 3rem); letter-spacing: -0.04em; }
        .dashboard-top p { margin: 0; color: var(--muted); max-width: 680px; }
        .btn-primary { background: linear-gradient(135deg, var(--primary), var(--accent)); color: #020617; border: none; border-radius: 18px; padding: 14px 22px; font-weight: 800; cursor: pointer; }
        .dashboard-grid { display: grid; grid-template-columns: 1.45fr 0.9fr; gap: 24px; }
        .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 30px; padding: 28px; box-shadow: 0 32px 90px rgba(0,0,0,0.28); }
        .panel h2 { margin: 0 0 20px; font-size: 1.2rem; }
        .stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; margin-bottom: 24px; }
        .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(77,252,250,0.15); border-radius: 24px; padding: 20px; }
        .stat-card strong { display: block; font-size: 2rem; color: var(--primary); }
        .stat-card span { color: var(--muted); }
        .inventory-table { width: 100%; border-collapse: collapse; }
        .inventory-table th, .inventory-table td { padding: 16px 14px; border-bottom: 1px solid rgba(255,255,255,0.08); text-align: left; }
        .inventory-table th { color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; font-size: 0.84rem; }
        .inventory-table tbody tr { transition: background 180ms ease; }
        .inventory-table tbody tr:hover { background: rgba(255,255,255,0.04); }
        .inventory-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .inventory-actions button { border: none; border-radius: 14px; padding: 10px 14px; cursor: pointer; font-weight: 700; }
        .inventory-actions .btn-secondary { background: rgba(255,255,255,0.05); color: var(--text); }
        .inventory-actions .btn-danger { background: #ef4444; color: #fff; }
        .inventory-actions .btn-toggle { background: rgba(109, 250, 179, 0.14); color: #8ee7c5; }
        .form-group { display: grid; gap: 10px; margin-bottom: 16px; }
        .form-group label { font-weight: 600; color: var(--text); }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 14px 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); color: var(--text); }
        .form-footer { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 10px; }
        .form-footer button { min-width: 140px; }
        .small-note { color: var(--muted); font-size: 0.95rem; margin-top: 4px; }
        .loading-state, .error-state { padding: 16px 18px; border-radius: 20px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); margin-bottom: 20px; }
        @media (max-width: 1000px) { .dashboard-grid { grid-template-columns: 1fr; } }
        @media (max-width: 660px) { .stats { grid-template-columns: 1fr; } }
      `}</style>

      <div className="dashboard-top">
        <div>
          <h1>Dashboard pharmacien</h1>
          <p>Connecté à Atlas, ce tableau de bord vous permet d’ajouter et de gérer vos stocks de médicaments en direct.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? 'Fermer le formulaire' : 'Ajouter un médicament'}
        </button>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="stats">
            <div className="stat-card">
              <strong>{inventory.length}</strong>
              <span>Articles</span>
            </div>
            <div className="stat-card">
              <strong>{availableCount}</strong>
              <span>Disponibles</span>
            </div>
            <div className="stat-card">
              <strong>{inventory.length - availableCount}</strong>
              <span>En rupture</span>
            </div>
          </div>

          {error && <div className="error-state">{error}</div>}
          {loading && <div className="loading-state">Chargement du stock...</div>}

          {showForm && (
            <form onSubmit={handleSubmit} style={{ marginBottom: 28 }}>
              <div className="form-group">
                <label htmlFor="nom">Nom du médicament</label>
                <input
                  id="nom"
                  type="text"
                  value={formValues.nom}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, nom: event.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="prix">Prix (F CFA)</label>
                <input
                  id="prix"
                  type="number"
                  step="0.01"
                  value={formValues.prix}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, prix: event.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="pharmacie">Pharmacie</label>
                <input
                  id="pharmacie"
                  type="text"
                  value={formValues.pharmacie}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, pharmacie: event.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="zone">Zone</label>
                <input
                  id="zone"
                  type="text"
                  value={formValues.zone}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, zone: event.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="latitude">Latitude</label>
                <input
                  id="latitude"
                  type="number"
                  step="0.0001"
                  value={formValues.latitude}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, latitude: event.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="longitude">Longitude</label>
                <input
                  id="longitude"
                  type="number"
                  step="0.0001"
                  value={formValues.longitude}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, longitude: event.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  value={formValues.description}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, description: event.target.value }))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="disponibilite">Disponibilité</label>
                <select
                  id="disponibilite"
                  value={formValues.disponibilite ? 'true' : 'false'}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, disponibilite: event.target.value === 'true' }))}
                >
                  <option value="true">Disponible</option>
                  <option value="false">Rupture</option>
                </select>
              </div>

              <div className="form-footer">
                <button type="submit" className="btn-primary">Enregistrer</button>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                  Annuler
                </button>
              </div>
            </form>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prix</th>
                  <th>Pharmacie</th>
                  <th>Zone</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item._id}>
                    <td>{item.nom}</td>
                    <td>{item.prix.toFixed(0)} F CFA</td>
                    <td>{item.pharmacie}</td>
                    <td>{item.zone}</td>
                    <td>{item.disponibilite ? 'Disponible' : 'Rupture'}</td>
                    <td>
                      <div className="inventory-actions">
                        <button type="button" className="btn-toggle" onClick={() => handleToggleAvailability(item)}>
                          {item.disponibilite ? 'En rupture' : 'Restaurer'}
                        </button>
                        <button type="button" className="btn-danger" onClick={() => handleDelete(item._id)}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="panel">
          <h2>Raccourcis</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.8 }}>
            Ajoutez un produit avec sa zone et ses coordonnées GPS, puis suivez immédiatement les disponibilités dans la base Atlas.
          </p>
          <div style={{ marginTop: 22, display: 'grid', gap: 14 }}>
            <div style={{ padding: '18px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(77,252,250,0.12)' }}>
              <strong style={{ fontSize: '1.35rem', display: 'block' }}>{inventory.length}</strong>
              Total des lignes stockées
            </div>
            <div style={{ padding: '18px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(77,252,250,0.12)' }}>
              <strong style={{ fontSize: '1.35rem', display: 'block' }}>{availableCount}</strong>
              Produits disponibles
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
