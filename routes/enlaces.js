const express = require('express');
const router = express.Router();
const EnlaceController = require('../controllers/EnlaceController');
const ArchivosController = require('../controllers/ArchivosController');
const { check } = require('express-validator');
const getUserAuthenticated = require('../middlewares/AuthMiddleware');


router.post(
    '/',
    [
        check('nombre', 'Sube un archivo').not().isEmpty(),
        check('nombre_original', 'Sube un archivo').not().isEmpty(),
        getUserAuthenticated
    ],
    EnlaceController.nuevoEnlace
);

router.get(
    '/',
    [],
    EnlaceController.todosEnlaces
);

router.get(
    '/:url',
    [
        EnlaceController.tienePassword,
        EnlaceController.getEnlaceById
    ],
    ArchivosController.descargarArchivo
);

router.post(
    '/:url',
    EnlaceController.verificarPassword
);

module.exports = router;