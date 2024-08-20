const mongoose = require('mongoose');

const ONGSchema = new mongoose.Schema({
  organization: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Especifica el nombre de la colección como 'register'
module.exports = mongoose.model('ONG', ONGSchema);
