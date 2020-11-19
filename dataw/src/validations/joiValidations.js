const Joi = require('joi');


const loginSchema = Joi.object({

    email: Joi.string().email({ tlds: { allow: false } }).required(),
    
    password: Joi.string().min(8).alphanum().required()
});

const registerSchema = Joi.object({

    name: Joi.string().min(2).required(),

    lastname: Joi.string().min(2).required(),

    email: Joi.string().email({ tlds: { allow: false } }).required(),

    profile: Joi.string().required(),

    password: Joi.string().min(8).alphanum().required()

});

const nameSchema = Joi.object({

    name: Joi.string().min(2)
});
const idSchema = Joi.object({

    _id: Joi.string().alphanum().min(24).max(24).required()
})




module.exports = {
   
    loginJoi : loginSchema,

    registerJoi : registerSchema,

    nameJoi : nameSchema,

    idJoi : idSchema

}

            // //Validar con Joi primero
            // const { error } = nameJoi.validate(pais);
            // if( error ){
            //     throw error.details[0].message;
            // }