const { response } = require('express');
const express = require('express');
const router = express.Router();
const path = require('path');

//Controllers
const login = require('../controllers/login');
const register = require('../controllers/register');
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');//Middleware de autenticacion de Administrador
const regiones = require('../controllers/regiones');


//Rutas

router.route('/login').post(login); // Log in de usuario 

router.route('/auth').get(auth); //Autenticacion con token de usuario para cualquier seccion del sitio

router.route('/register').post(authAdmin,register); //Registro de usuarios nuevos

//Region

router.route('/nuevaRegion/').post(regiones.nuevaRegion); //Ingresar nueva Region

router.route('/borrarRegion').post(); // Borrar pais

router.route('/actualizarRegion').post();

//Pais

router.route('/nuevoPais').post(regiones.nuevoPais);


//Ciudad
router.route('/nuevaCiudad').post(regiones.nuevaCiudad);





module.exports = router;