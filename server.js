// backend/server.js
const express = require('express');
const connectDB = require('./models/BD.js');
const Contract = require('./models/Contrato.js');
const nuevaONG = require('./models/ONG.js');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const contrato=require("./Contrato2.js")

connectDB();

app.use(cors());
app.use(express.json());


app.get('/api/organizations', async (req, res) => {
    try {
        const contracts = await Contract.find();
        res.json(contracts);
    } catch (error) {
        res.status(500).send('Error al obtener las organizaciones');
    }
});

app.post('/register',async (req, res)=> {
    try{
        const {nombre, descripcion, email, contrasena}=req.body;
        const nueONG=new nuevaONG({nombre, descripcion, email, contrasena})
        await nueONG.save();
        res.status(201).send('Ong registrada');

    }catch (err){
        res.status(500).send('Error al registrar ONG');

    }

})

app.get('/api/contracts', async (req, res) => {
    try {
        const contracts = await Contract.find(); // Obtiene todos los contratos de la base de datos
        res.json(contracts); // Devuelve los contratos en formato JSON
    } catch (error) {
        res.status(500).send('Error al obtener los contratos');
    }
});

app.post('/api/crearContrato', async (req,res ) => {
    const { name, contractAddress, description, owner } = req.body;
    contrato.CrearContrato(name, description, owner);
    try {
        const newContract=new Contract({name, contractAddress, description, owner})
            await newContract.save();
            res.status(201).json(newContract);
    } catch (error) {
        res.status(500).send('ERROR al guardar el contrato')
    }

});

//GUARDAR CONTRATOS 
app.post('/api/contracts', async (req, res) => {

    const { name, contractAddress, description, owner } = req.body;
    try {
        const newContract = new Contract({ name, contractAddress, description, owner });
        await newContract.save();
        res.status(201).json(newContract);
    } catch (error) {
        res.status(500).send('Error al guardar el contrato');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
