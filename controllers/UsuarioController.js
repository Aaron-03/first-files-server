const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const { validationResult } = require('express-validator');



const newUser = async (req, res) => {
    
    try {

        // Mostrar mensajes de error de express validator
        const errores = validationResult(req);

        if(!errores.isEmpty()) {
            return res.status(400).json({
                errores: errores.array()
            });
        }

        const { email, password } = req.body;

        const userTemp = await Usuario.findOne({ email });

        if(userTemp) {
            return res.status(401).json({
                msg: 'Usuario ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);
        // Hashear el password
        const salt = bcrypt.genSaltSync(10);
        usuario.password = bcrypt.hashSync(password, salt);
        await usuario.save();

        res.json({
            msg: 'Usuario creado correctamente'
        });
    } catch (error) {
        console.log(error);
        res.json({
            msg: 'Ocurrió un error',
            error
        });
    }
}

module.exports = {
    newUser
}