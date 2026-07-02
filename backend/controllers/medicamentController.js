const Medicament = require('../models/Medicament');

exports.getMedicaments = async (req, res) => {
  try {
    const { search, zone } = req.query;
    const filter = {};

    if (search) {
      filter.nom = { $regex: search, $options: 'i' };
    }

    if (zone && zone !== 'Toutes') {
      filter.zone = { $regex: `^${zone}$`, $options: 'i' };
    }

    const docs = await Medicament.find(filter).sort({ createdAt: -1 }).exec();
    res.json({ docs });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de la recherche' });
  }
};

exports.createMedicament = async (req, res) => {
  try {
    const { nom, description, prix, pharmacie, zone, latitude, longitude, disponibilite } = req.body;
    if (!nom || !prix || !pharmacie || !zone || typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ message: 'Nom, prix, pharmacie, zone, latitude et longitude sont requis' });
    }
    const med = new Medicament({
      nom,
      description: description || '',
      prix,
      pharmacie,
      zone,
      latitude,
      longitude,
      disponibilite: Boolean(disponibilite)
    });
    const saved = await med.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Impossible d’enregistrer le médicament', error: error.message });
  }
};
