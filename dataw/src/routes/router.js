const { response } = require('express');
const express = require('express');
const router = express.Router();
const path = require('path');

//Controllers
const loginCtrl = require('../controllers/login');


//Renderizo pagina inicial de login
router.route('/').get((req,res)=>{

    //Pagina de inicio es login
    res.sendFile(path.join(__dirname, '../public/login.html'));

})

router.route('/login').post(loginCtrl.login);




module.exports = router;