import React, { useEffect, useState } from 'react';
import axios from 'axios';

const zones = ['Tous', 'Plateau', 'Almadies', 'Medina', 'Yoff', 'Dakar Centre'];
const sortOptions = [
  { value: 'none', label: 'Trier' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' }
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [zone, setZone] = useState('Tous');
  const [sort, setSort] = useState('none');
  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, zone, sort]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchMedicaments = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:5000/api/medicaments', {
          params: {
            nom: search.trim() || undefined,
            zone: zone !== 'Tous' ? zone : undefined,
            sort: sort !== 'none' ? sort : undefined,
            page,
            limit
          },
          signal: controller.signal
        });
        const data = response.data;
        setMedicaments(page === 1 ? data.docs : (prev) => [...prev, ...data.docs]);
        setTotalPages(data.pages || 1);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err.response?.data?.message || err.message || 'Impossible de charger les résultats');
        }
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchMedicaments, 240);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [search, zone, sort, page, limit]);

  return (
    <div className="home-page">
      <style>{`
        :root { --bg: #060712; --surface: rgba(18, 28, 48, 0.96); --surface-soft: rgba(24, 38, 64, 0.9); --border: rgba(255,255,255,0.08); --primary: #4dfcfa; --accent: #7c5cff; --text: #e9f3ff; --muted: #89a3c3; }
        .home-page { min-height: 100vh; padding: 28px 24px 48px; max-width: 1300px; margin: 0 auto; color: var(--text); }
        .hero { position: relative; overflow: hidden; border-radius: 32px; padding: 42px 38px; background: linear-gradient(135deg, rgba(18, 26, 48, 0.96), rgba(24, 38, 64, 0.96)); border: 1px solid rgba(77,252,250,0.18); box-shadow: 0 30px 80px rgba(0,0,0,0.35); }
        .hero:before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at top left, rgba(77,252,250,0.14), transparent 30%), radial-gradient(circle at bottom right, rgba(124,92,255,0.12), transparent 28%); pointer-events: none; }
        .hero h1 { margin: 0 0 18px; font-size: clamp(2.5rem, 4vw, 4rem); line-height: 1.01; letter-spacing: -0.04em; color: #f8ffff; }
        .hero p { margin: 0; max-width: 760px; color: var(--muted); font-size: 1.05rem; line-height: 1.8; }
        .hero .hero-actions { display: grid; gap: 16px; margin-top: 34px; grid-template-columns: 1fr auto; }
        .search-panel { display: grid; grid-template-columns: 1.8fr 1fr 1fr auto; gap: 16px; align-items: center; margin-top: 32px; }
        .search-panel input, .search-panel select { width: 100%; border-radius: 18px; border: 1px solid var(--border); padding: 16px 18px; font-size: 1rem; background: rgba(10,17,32,0.88); color: var(--text); }
        .search-panel input::placeholder { color: var(--muted); }
        .search-panel button { min-height: 56px; border-radius: 18px; border: none; padding: 0 24px; background: linear-gradient(135deg, var(--primary), var(--accent)); color: #020617; font-weight: 800; letter-spacing: 0.02em; cursor: pointer; }
        .search-panel button:hover { opacity: 0.95; }
        .tags { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
        .tag { border: 1px solid rgba(255,255,255,0.08); color: var(--muted); background: rgba(255,255,255,0.03); border-radius: 999px; padding: 11px 18px; cursor: pointer; transition: all 180ms ease; }
        .tag.active { background: rgba(77,252,250,0.15); border-color: rgba(77,252,250,0.3); color: #fff; }
        .overview { display: grid; grid-template-columns: 1.4fr 1fr; gap: 22px; margin-top: 32px; }
        .overview-card { background: var(--surface); border: 1px solid var(--border); border-radius: 28px; padding: 28px; min-height: 170px; }
        .overview-card h3 { margin: 0 0 12px; font-size: 1rem; color: var(--primary); text-transform: uppercase; letter-spacing: 0.12em; }
        .overview-card p { margin: 0; color: var(--muted); line-height: 1.8; }
        .status-row { display: flex; justify-content: space-between; gap: 16px; align-items: center; flex-wrap: wrap; margin: 32px 0 18px; }
        .status-row p { margin: 0; color: var(--muted); }
        .status-row strong { color: #fff; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        .card { background: var(--surface); border: 1px solid var(--border); border-radius: 28px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; min-height: 260px; }
        .card-header { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; }
        .card-title { margin: 0 0 4px; font-size: 1.2rem; color: #fff; }
        .card-subtitle { margin: 0; color: var(--muted); font-size: 0.95rem; }
        .meta-pill { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 999px; background: rgba(77,252,250,0.08); color: var(--primary); font-size: 0.82rem; font-weight: 700; }
        .price { margin: 18px 0 0; font-size: 1.5rem; color: var(--primary); font-weight: 800; }
        .description { margin: 16px 0 0; color: var(--muted); font-size: 0.96rem; line-height: 1.7; min-height: 72px; }
        .badge { display: inline-flex; align-items: center; justify-content: center; padding: 9px 14px; border-radius: 999px; font-size: 0.8rem; font-weight: 700; }
        .badge.available { color: #6ee7b7; background: rgba(46, 204, 113, 0.14); }
        .badge.unavailable { color: #fca5a5; background: rgba(248, 113, 113, 0.15); }
        .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; }
        .btn { border: none; border-radius: 16px; padding: 12px 18px; cursor: pointer; font-weight: 700; transition: transform 160ms ease, opacity 160ms ease; }
        .btn-primary { background: linear-gradient(135deg, var(--primary), var(--accent)); color: #020617; }
        .btn-secondary { background: rgba(255,255,255,0.04); color: var(--text); }
        .btn:hover { transform: translateY(-1px); opacity: 0.96; }
        .map-panel { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px; margin-top: 34px; }
        .map-card { background: var(--surface); border: 1px solid var(--border); border-radius: 28px; overflow: hidden; min-height: 340px; }
        .map-card header { padding: 24px 24px 0; display: flex; justify-content: space-between; align-items: center; }
        .map-card header h2 { margin: 0; font-size: 1.05rem; color: #fff; }
        .map-card iframe { width: 100%; height: 100%; min-height: 260px; border: 0; }
        .load-more { display: inline-flex; align-items: center; justify-content: center; min-width: 220px; margin: 0 auto; }
        .empty-state { text-align: center; color: var(--muted); margin-top: 30px; }
        @media (max-width: 1120px) { .overview { grid-template-columns: 1fr; } .map-panel { grid-template-columns: 1fr; } }
        @media (max-width: 860px) { .search-panel { grid-template-columns: 1fr; } }
        @media (max-width: 620px) { .hero { padding: 28px 20px; } }
      `}</style>

      <section className="hero">
        <h1>Recherche de médicaments à Dakar en temps réel</h1>
        <p>Explorez les stocks des pharmacies locales, filtrez par zone et trouvez les meilleurs tarifs en F CFA.</p>

        <div className="search-panel">
          <input
            type="search"
            placeholder="Nom du médicament..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select value={zone} onChange={(event) => setZone(event.target.value)}>
            {zones.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <button type="button" onClick={() => setPage(1)}>Rechercher</button>
        </div>

        <div className="tags">
          {zones.slice(1).map((item) => (
            <button
              key={item}
              type="button"
              className={`tag ${item === zone ? 'active' : ''}`}
              onClick={() => setZone(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <div className="overview">
        <div className="overview-card">
          <h3>Filtres dynamiques</h3>
          <p>La recherche utilise le nom et la zone avec des correspondances partielles pour retrouver tous les médicaments disponibles à Dakar.</p>
        </div>
        <div className="overview-card">
          <h3>Carte des pharmacies</h3>
          <p>Visualisez rapidement les zones de distribution et concentrez-vous sur les pharmacies proches de votre localisation.</p>
        </div>
      </div>

      <div className="status-row">
        <p><strong>{medicaments.length}</strong> résultats affichés</p>
        <p>{loading ? 'Chargement…' : `Page ${page} sur ${totalPages}`}</p>
      </div>

      {error && <div className="empty-state">{error}</div>}

      <div className="grid">
        {medicaments.map((med) => (
          <article key={med._id} className="card">
            <div>
              <div className="card-header">
                <div>
                  <h3 className="card-title">{med.nom}</h3>
                  <p className="card-subtitle">{med.pharmacie || 'Pharmacie locale'}</p>
                </div>
                <span className={`badge ${med.disponibilite ? 'available' : 'unavailable'}`}>
                  {med.disponibilite ? 'Disponible' : 'Rupture'}
                </span>
              </div>

              <p className="description">{med.description || 'Aucune description disponible pour ce produit.'}</p>
            </div>

            <div>
              <span className="meta-pill">Zone : {med.zone || 'N/A'}</span>
              <p className="price">{med.prix ? `${Number(med.prix).toFixed(0)} F CFA` : 'Prix indisponible'}</p>
              <div className="actions">
                <button type="button" className="btn btn-primary" onClick={() => window.alert(`Localisation : ${med.zone}`)}>
                  Voir la pharmacie
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => window.alert(`Coordonnées GPS : ${med.latitude}, ${med.longitude}`)}>
                  Coordonnées
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!loading && medicaments.length === 0 && (
        <div className="empty-state">
          <p>Aucun médicament trouvé avec ces filtres.</p>
        </div>
      )}

      {!loading && page < totalPages && (
        <div className="load-more">
          <button type="button" className="btn btn-secondary" onClick={() => setPage((prev) => prev + 1)}>
            Charger plus de résultats
          </button>
        </div>
      )}

      <div className="map-panel">
        <section className="map-card">
          <header>
            <h2>Carte Dakar</h2>
          </header>
          <iframe
            title="Carte Dakar"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-17.5359%2C14.6558%2C-17.4499%2C14.7370&layer=mapnik"
            loading="lazy"
          />
        </section>
        <section className="map-card" style={{ padding: '24px' }}>
          <h2>Zones populaires</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.9 }}>
            Plateau, Almadies, Medina et Yoff restent les secteurs les plus actifs pour la distribution de médicaments à Dakar. Utilisez les filtres pour affiner les résultats et trouver rapidement le bon produit.
          </p>
        </section>
      </div>
    </div>
  );
}
