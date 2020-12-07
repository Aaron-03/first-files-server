const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');
const { check } = require('express-validator');

router.post(
    '/create',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password es incorrecto').isLength({ min: 6 })
    ],
    UsuarioController.newUser
);

module.exports = router;