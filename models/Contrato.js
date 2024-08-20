const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    name: String,
    contractAddress: String,
    description: String,
    owner: String, // Puedes almacenar la dirección del propietario del contrato
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contract', contractSchema);
