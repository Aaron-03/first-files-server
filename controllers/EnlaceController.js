const Enlace = require('../models/Enlace');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const nuevoEnlace = async (req, res, next) => {
    // Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        });
    }

    // Almacenar en la BD
    const { nombre_original, nombre } = req.body;

    const enlace = new Enlace();
    enlace.url = shortid.generate();
    enlace.nombre = nombre;
    enlace.nombre_original = nombre_original;

    // Si es usuario está autenticado
    if(req.usuario) {
        const { password, descargas } = req.body;

        // Asignar a enlace el número de descargas
        if(descargas) {
            enlace.descargas = descargas;
        }

        // Asignar un password
        if(password) {
            const salt = bcrypt.genSaltSync(10);
            enlace.password = bcrypt.hashSync(password, salt);
        }

        // Asignar autor
        enlace.autor = req.usuario.id;
    }

    // Almacenar en la BD
    try {

        await enlace.save();
        res.json({ msg: `${enlace.url}` });
        next();

    } catch (error) {
        console.log(error);
    }
}

const getEnlaceById = async (req, res, next) => {
    
    const url = req.params.url;

    // Verificar si existe el enlace
    const enlace = await Enlace.findOne({ url });

    if(!enlace) {
        res.status(404).json({
            msg: 'Ese enlace no existe'
        });

        return next();
    }

    // Si el enlace existe
    res.json({ archivo: enlace.nombre, password: false });

    // Si las descargas son iguales a 1
    // Borrar la entrada y borrar el archivo
    const { descargas, nombre } = enlace;

    if(descargas === 1) {
        console.log('Solo 1');

        // Eliminar archivo
        req.archivo = nombre;

        // Eliminar de la BD

        next();
    } else {
        // Si las descargar son mayores a 1
        // Restar 1 a las descargas
        enlace.descargas--;
        await enlace.save();
    }
}

const todosEnlaces = async (req, res) => {
    try {

        const enlaces = await Enlace.find({}).select('url -_id');

        res.json({enlaces});
        
    } catch (error) {
        console.log(error);
    }
}

const tienePassword = async (req, res, next) => {
    try {
        
        const url = req.params.url;

        // Verificar si existe el enlace
        const enlace = await Enlace.findOne({ url });
    
        if(!enlace) {
            res.status(404).json({
                msg: 'Ese enlace no existe'
            });
    
            return next();
        }

        if(enlace.password) {
            return res.json({ password: true, enlace: enlace.url });
        }

        next();

    } catch (error) {
        console.log(error);
    }
}

const verificarPassword = async (req, res, next) => {

    const { url } = req.params;
    const { password } = req.body;

    const enlace = await Enlace.findOne({ url });

    // Verificar el password
    if(bcrypt.compareSync(password, enlace.password)) {
        // Permitir al usuario descargar el archivo
        next();
    } else {
        return res.status(401).json({
            msg: 'Password Incorrecto'
        });
    }

}

module.exports = {
    nuevoEnlace,
    getEnlaceById,
    todosEnlaces,
    tienePassword,
    verificarPassword
}