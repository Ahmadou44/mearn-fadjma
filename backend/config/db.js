const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connecté au Cloud Atlas !');
  } catch (error) {
    console.error('Erreur de connexion MongoDB :', error.message);
    console.error('Détails MongoDB Atlas :', error);
    console.error('Vérifiez la variable MONGO_URI et l’accès IP dans Atlas.');
    process.exit(1);
  }
};

module.exports = connectDB;
