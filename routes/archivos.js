const express = require('express');
const router = express.Router();
const ArchivosController = require('../controllers/ArchivosController');
const getUserAuthenticated = require('../middlewares/AuthMiddleware');

// Subida de archivos
const multer = require('multer');
const upload = multer({ dest: './uploads/' });
// upload.single('archivo')

router.post(
    '/',
    [],
    ArchivosController.subirArchivo
);

router.get(
    '/:archivo',
    [],
    ArchivosController.descargarArchivo
);

router.delete(
    '/:id',
    [],
    ArchivosController.eliminarArchivo
);

module.exports = router;