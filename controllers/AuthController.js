const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
require('dotenv').config({ path: '.env' });
const Usuario = require('../models/Usuario');



const autenticarUsuario = async (req, res) => {

    // Mostrar mensajes de error de express validator
    const errores = validationResult(req);

    if(!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        });
    }


    // Revisar si hay errores
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });

    if(!usuario) {
        res.status(401).json({
            msg: 'El usuario no existe'
        });

        return next();
    }

    // Verificar el password y autenticar usuario
    if(bcrypt.compareSync(password, usuario.password)) {
        
        // Crear JWT
        const token = jwt.sign({
            id: usuario._id,
            nombre: usuario.nombre   
        }, process.env.SECRET_WORD, {
            expiresIn: '8h'
        });

        res.json({ token });

    } else {
        res.status(401).json({
            msg: 'El password es incorrecto'
        });

        return next();
    }

    // Buscar el usuario para saber si está registrado

    
}

const usuarioAutenticado = async (req, res, next) => {
   res.json({ usuario: req.usuario });
}

module.exports = {
    autenticarUsuario,
    usuarioAutenticado
}