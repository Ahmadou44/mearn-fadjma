const mongoose = require('mongoose');
const MedicamentSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  prix: { type: Number, required: true, min: 0 },
  pharmacie: { type: String, required: true, trim: true },
  zone: { type: String, required: true, trim: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  disponibilite: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('Medicament', MedicamentSchema);
