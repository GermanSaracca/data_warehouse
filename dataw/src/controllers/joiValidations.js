const Joi = require('joi');


const loginSchema = Joi.object({

    email: Joi.string().email({ tlds: { allow: false } }).required(),
    
    password: Joi.string().min(8).alphanum().required()
});

module.exports = {
   
    loginSchema : loginSchema
}