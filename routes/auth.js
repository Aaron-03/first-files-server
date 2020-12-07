const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { check } = require('express-validator');
const getUserAuthenticated = require('../middlewares/AuthMiddleware');

router.post(
    '/',
    [
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password no puede ir vacío').not().isEmpty()
    ],
    AuthController.autenticarUsuario
);

router.get(
    '/',
    [getUserAuthenticated],
    AuthController.usuarioAutenticado
);

module.exports = router;