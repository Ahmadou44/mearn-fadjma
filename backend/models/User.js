const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    nomPharmacie: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    quartier: { type: String, required: true, trim: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
