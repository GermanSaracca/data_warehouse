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

module.exports = {
   
    loginSchema : loginSchema,
    registerSchema : registerSchema
}