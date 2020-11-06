const { response } = require('express');
const express = require('express');
const router = express.Router();
const path = require('path');

//Controllers
const loginCtrl = require('../controllers/login');
const auth = require('../middlewares/auth');

// Rutas


//Renderizo pagina inicial de login
router.route('/').get()


//Rutas

router.route('/login').post(loginCtrl.login); // Log in de usuario 

router.route('/auth').get(auth); //Autenticacion con token de usuario 





module.exports = router;