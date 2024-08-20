const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Asegúrate de que esta contraseña esté en texto plano
  isOng: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);