const mongoose = require('mongoose');

const donadorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  apellidos: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const Donador = mongoose.model('Donador', donadorSchema);
module.exports = Donador;
