const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getMedicaments, createMedicament } = require('../controllers/medicamentController');
const Medicament = require('../models/Medicament');

router.get('/', getMedicaments);

router.get('/:id', async (req, res) => {
  try {
    const med = await Medicament.findById(req.params.id);
    if (!med) return res.status(404).json({ message: 'Médicament non trouvé' });
    res.json(med);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/', authMiddleware, createMedicament);

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Medicament.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Médicament non trouvé' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Données invalides', error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const removed = await Medicament.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Médicament non trouvé' });
    res.json({ message: 'Médicament supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
