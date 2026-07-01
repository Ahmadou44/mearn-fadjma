# Fadj ma — MERN (local)

Instructions rapides pour lancer le projet localement.

Backend (API)

1. Aller dans le dossier backend et installer les dépendances :

```bash
cd backend
npm install
```

2. Créer un fichier `.env` contenant `MONGO_URI` si besoin, exemple :

```
MONGO_URI=mongodb://127.0.0.1:27017/fadjma
PORT=5000
```

3. Démarrer le serveur en développement :

```bash
npm run dev
```

Frontend (UI)

1. Aller dans le dossier frontend et installer les dépendances :

```bash
cd frontend
npm install
```

2. Démarrer le serveur de développement (Vite) :

```bash
npm run dev
```

Remarques

- L'API backend écoute par défaut sur le port `5000` et expose les routes `GET /api/medicaments`, `POST /api/medicaments`, `PUT /api/medicaments/:id`, `DELETE /api/medicaments/:id`.
- Le frontend attend l'API sur `http://localhost:5000` pour récupérer la liste des médicaments depuis la page d'accueil.
