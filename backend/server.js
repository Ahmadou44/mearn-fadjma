const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const medicamentRoutes = require('./routes/medicamentRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const missingEnv = ['MONGO_URI', 'JWT_SECRET'].filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`Erreur : variables d'environnement manquantes => ${missingEnv.join(', ')}`);
  console.error('Ajoute-les dans Render sous Environment > Environment Variables.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/medicaments', medicamentRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  // Serve index.html for non-API GET requests (avoid path-to-regexp wildcard issues)
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    }
    next();
  });
}
app.get('/', (req, res) => {
  res.json({ message: 'API Fadj ma fonctionnelle' });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
});

module.exports = app;
