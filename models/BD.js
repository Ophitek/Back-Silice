const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://Lion:Lion27563@bd.cedcc.mongodb.net/?retryWrites=true&w=majority&appName=BD', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1); // Detener la aplicación si falla la conexión
    }
};

module.exports = connectDB;
