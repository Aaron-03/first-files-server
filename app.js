const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();

// Conectar a MongoDB
connectDB();

// Puerto de la app
const port = process.env.PORT || 4000;

// Habilitar valores de un body
app.use(express.json());

// Habilitar carpeta pública
app.use(express.static('uploads'));

// Opciones Cors
const corsOption = {
    origin: process.env.FRONTEND_URL
};

// Habilitar Cors
app.use(cors());

// Rutas de la App
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));

// Lanzar app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor funciona en el puerto ${port}`);
});