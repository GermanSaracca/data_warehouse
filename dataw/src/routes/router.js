const { response } = require('express');
const express = require('express');
const router = express.Router();
const path = require('path');

//Controllers
const login = require('../controllers/login');
const register = require('../controllers/register');
const admin = require('../controllers/admin');

const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');//Middleware de autenticacion de Administrador

const regionCtrl = require('../controllers/regions');
const countryCtrl =  require('../controllers/countries');
const cityCtrl = require('../controllers/cities');


//Rutas

//Logueo

router.route('/login').post(login); // Log in de usuario 

router.route('/auth').get(auth); //Autenticacion con token de usuario para cualquier seccion del sitio

// Admin

router.route('/register').post(authAdmin,register); //Registro de usuarios nuevos

router.route('/getUsers').get(admin.getUsers);

router.route('/updateUser').put();

router.route('/deleteUser/:_id').delete(admin.deleteUser);


//Region

router.route('/nuevaRegion').post(regionCtrl.newRegion); //Cargar nueva Region

router.route('/actualizarRegion/:_id').put(regionCtrl.updateRegion); //Editar nombre de region

router.route('/borrarRegion/:_id').delete(regionCtrl.deleteRegion); // Borrar Region

router.route('/regiones').get(regionCtrl.getRegions); // Obtener Regiones



//Pais

router.route('/nuevoPais/:_id').post(countryCtrl.newCountry); //Cargar nuevo Pais


//Ciudad
router.route('/nuevaCiudad/:_id').post(cityCtrl.newCity); //Cargar nueva Ciudad





module.exports = router;