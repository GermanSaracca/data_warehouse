const response = require('../responses/response');
const User = require('../models/User');
const {idJoi} = require('../validations/joiValidations');

class Admin{

    async getUsers(req,res){

        // Busco todos los usuarios en db
        let users = await User.find({},{ __v:0, password:0, date:0 });
        let resp = new response(false,200,"Lista de usuarios",users)
        res.send(resp);
    };

    async deleteUser(req,res){

        let id = req.params;
        try{
            //Validar con Joi primero
            const { error } = idJoi.validate(id);

            if(error) throw error.details[0].message;

            let deleted = await User.findByIdAndDelete(id);

            if(deleted === null) throw "Id de usuario no encontrado";

            let resp = new response(false,202,"Usuario eliminado correctamente",deleted)
            res.send(resp);

        }catch(e){

            console.log(e);
            let resp = new response(true,400,e)
            res.send(resp);
        }

    }
}

module.exports = new Admin();