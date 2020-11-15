const { Schema, model } = require('mongoose');
const { ciudadJoi } = require('../validations/joiValidations');

//Creo Schema de ciudades
const ciudadSchema = new Schema({

    name: { type: String, unique: true }
});
const ciudad = model('Ciudad', ciudadSchema);

const paisSchema = new Schema({

    name: { type: String, unique: true },

    ciudad: [{
        type: Schema.Types.ObjectId,
        ref: 'Ciudad'
    }]
});
const pais = model('Pais',paisSchema);


const regionSchema = new Schema ({

    name: { type: String, unique: true },

    pais : [{
        type: Schema.Types.ObjectId,
        ref: 'Pais'
    }]
});


module.exports = {

    regionSchema : model('Region',regionSchema),
    paisSchema : pais,
    ciudadSchema : ciudad

};
