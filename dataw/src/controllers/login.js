const response = require('../responses/response');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const {jwtSign} = require('../global/envs');
const {loginSchema} = require('../controllers/joiValidations');


class LoginController {

    async login(req,res){

        let {email,password} = req.body;

        //Validar con Joi primero
        const { error }= loginSchema.validate(req.body);

        if( error ){

            res.send( error );
            return;
        }
        
        //Verifico que exista el usuario
        // Busco todos los usuarios en db
        let users = await User.find();

        const findByEmail = users.find(user => user.email === email);
        
        
        //Si el email = undefined quiere decir que no existe tal usuario
        if(findByEmail == undefined){

            let resp = new response(true,403,'No existe usuario con ese email');
            res.send(resp);
        }else{
            const emailDB = findByEmail.email;
            const hashedPass = findByEmail.password;

            //Creo objeto usuario para enviar dentrod el payload
            let infoUser= {
                email: emailDB
            };

            try{
                // Si la contraseña corresponde CREO Y ENVIO token

                if(await bcrypt.compare(password,hashedPass)) {

                    // Creo el Token
                    const accessToken = jwt.sign(infoUser,jwtSign);

    
                    let resp = new response(false,202,'Token creado',accessToken);
                    res.send(resp);
    
                }else{
    
                    let resp = new response(true,403,'Contraseña incorrecta');
                    res.send(resp);
                }
    
            }catch(error){
    
                res.status(500).send();
            }

        }

    }
}

module.exports = new LoginController();