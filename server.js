// backend/server.js
const express = require('express');
const connectDB = require('./models/BD.js');
const Contract = require('./models/Contrato.js');
const ONG = require('./models/ONG.js');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;
const contrato=require("./Contrato2.js")
const Donador= require("./models/Donador.js")
const User= require("./models/user.js")
const {deployContract} = require('./Contrato2.js')
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'nan_alan_ponce_cris_pao'; 
connectDB();

app.use(cors());
app.use(express.json());




// Ruta para manejar el registro de donadores
app.post('/donadores/register', async (req, res) => {
    console.log('Solicitud recibida:', req.body);
  
    try {
      const { nombre, apellidos, email, password } = req.body;
  
      // Crear un nuevo donador
      const newDonador = new Donador({
        nombre,
        apellidos,
        email,
        password
      });
  
      // Guardar en la base de datos
      await newDonador.save();
      res.status(201).json({ message: 'Donador registrado con éxito' });
    } catch (error) {
      console.error('Error al registrar el donador:', error);
      res.status(500).json({ message: 'Error al registrar el donador' });
    }
  });
  
  // Ruta para manejar el registro de ONGs
  app.post('/register', async (req, res) => {
    console.log('Solicitud recibida:', req.body);
  
    try {
      const { organization, description, email, password } = req.body;
  
      // Crear una nueva ONG
      const newONG = new ONG({
        organization,
        description,
        email,
        password
      });
  
      // Guardar en la base de datos
      await newONG.save();
      res.status(201).json({ message: 'ONG registrada con éxito' });
    } catch (error) {
      console.error('Error al registrar la ONG:', error);
      res.status(500).json({ message: 'Error al registrar la ONG' });
    }
  });
  
  // Ruta para manejar el inicio de sesión
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
        // Buscar usuario en la base de datos
        const donador = await Donador.findOne({ email, password });
        const ong = await ONG.findOne({ email, password });
    
        if (!donador && !ong) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
    
        // Determinar el tipo de usuario y construir el mensaje
        let userType, userName, userLastName;
        if (donador) {
            userType = 'donador';
            userName = donador.nombre; // Suponiendo que tienes un campo 'nombre' en tu modelo
            userLastName = donador.apellidos; // Suponiendo que tienes un campo 'apellidos' en tu modelo
        } else if (ong) {
            userType = 'ONG';
            userName = ong.organization; // Suponiendo que tienes un campo 'organization' en tu modelo
            userLastName = ong.email; // Suponiendo que tienes un campo 'email' en tu modelo
            description= ong.description
          }

        // Construir el mensaje
        const message = `Usuario encontrado como Nombre: ${userName} Apellido: ${userLastName}`;

        // Generar el token JWT
        const token = jwt.sign({
            id: donador ? donador._id : ong._id,
            userType: userType,
            name: userName,
            lastName: userLastName,
            email: email,
            description: donador ? null : ong.description 
        }, SECRET_KEY, { expiresIn: '1h' }); // Expiración en 1 hora
    
        // Responder con el token y el mensaje
        res.status(200).json({ message, token,userType });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});

  

  //Ruta para obtener las organizaciones
app.get('/api/organizations', async (req, res) => {
    try {
        const contracts = await Contract.find();
        res.json(contracts);
    } catch (error) {
        res.status(500).send('Error al obtener las organizaciones');
    }
});
    //Ruta para obtener los contratos
app.get('/api/contracts', async (req, res) => {
    try {
        const contracts = await Contract.find(); // Obtiene todos los contratos de la base de datos
        res.json(contracts); // Devuelve los contratos en formato JSON
    } catch (error) {
        res.status(500).send('Error al obtener los contratos');
    }
});

// Ruta para crear y desplegar un contrato
app.post('/api/crearContrato', async (req, res) => {
    const { name, description, publicId, pass, owner} = req.body;
    try {
        // Desplegar el contrato
        await deployContract(name, description, publicId, pass, owner);
        res.status(201).json({ message: 'Contrato desplegado y guardado con éxito' });
    } catch (error) {
        console.error('Error al desplegar y guardar el contrato:', error);
        res.status(500).send('Error al desplegar el contrato');
    }
});


//GUARDAR CONTRATOS 

app.post('/api/contracts', async (req, res) => {

    const { name, contractAddress, description, publicId, owner } = req.body;
    try {
        const newContract = new Contract({ name, contractAddress, description, publicId,owner });
        await newContract.save();
        res.status(201).json(newContract);
    } catch (error) {
        res.status(500).send('Error al guardar el contrato');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
