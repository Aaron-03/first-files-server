const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });


const getUserAuthenticated = async (req, res, next) => {
    const authheader = req.get('Authorization');

   if(authheader) {
    // Obtener el Token

    const token = authheader.split(' ')[1];

    // Comprobar el JWT
    try {
        const usuario = jwt.verify(token, process.env.SECRET_WORD);
        req.usuario = usuario;
    } catch (error) {
        console.log('JWT no válido');
    }
   }

   return next();
}

module.exports = getUserAuthenticated;