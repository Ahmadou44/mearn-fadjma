const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI manquante. Ajoute-la dans les variables d’environnement Render.');
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connecté au Cloud Atlas !');
  } catch (error) {
    console.error('Erreur de connexion MongoDB :', error.message);
    console.error('Détails MongoDB Atlas :', error);
    console.error('Vérifie MONGO_URI et l’accès réseau depuis Render.');
    process.exit(1);
  }
};

module.exports = connectDB;
