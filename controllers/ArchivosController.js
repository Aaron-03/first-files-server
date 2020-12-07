const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlace = require('../models/Enlace');

// upload.single('archivo')
const subirArchivo = async (req, res, next) => {

    const multerConfig = {
        limits: { fileSize: req.usuario ? 1024 * 1024 * 10 : 1024 * 1024 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname + '/../uploads')
            },
            filename: (req, file, cb) => {
                const originName = file.originalname;
                const extension = originName.substring(originName.lastIndexOf('.'), originName.length);
                cb(null, `${shortid.generate()}${extension}`);
            }
            // Para filtrar por tipo
            // fileFilter: (req, file, cb) => {
            //     if(file.mimetype === 'application/pdf') {
            //         return cb(null, true);
            //     }
            // }
        })
    }
    
    const upload = multer(multerConfig).single('archivo');    

    upload(req, res, async (error) => {
        console.log(req.file);
        if(!error) {
            res.json({ archivo: req.file.filename });
        } else {
            return next();
        }
    });
}

const eliminarArchivo = async (req, res) => {
    console.log('Desde eliminar archivo');

    try {
        console.log(req.archivo);
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
        console.log('Archivo eliminado');
        await Enlace.findOneAndRemove(req.params.url);

    } catch (error) {
        console.log(error);
    }
}

const descargarArchivo = async (req, res) => {
    try {

        // Obtener enlace
        const archivo = req.params.archivo;
        const enlace = await Enlace.findOne({ nombre: archivo });

        const archivoDescarga = __dirname + '/../uploads/' + archivo;
        res.download(archivoDescarga);
        
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    subirArchivo,
    eliminarArchivo,
    descargarArchivo
}