const mongoose = require('mongoose');

const ongSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    email: String,
    contrasena: String,
});

module.exports = mongoose.model('ONG', ongSchema);
