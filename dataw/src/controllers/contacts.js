const response = require('../responses/response');
const { contactSchema } = require('../models/Contacts');
const { contactJoi }  = require('../validations/joiValidations');


class Contacts{


    async newContact(req,res){

        let { name, lastname, position, email, company, region, country, city, address, interest, contactChannels } = req.body;

        try{
            //Valido con Joi los campos requeridos
            let { error } = contactJoi.validate(req.body);
            if(error) throw error;

            let contact = {
                name: name,
                lastname: lastname,
                position: position,
                email: email,
                company: company,
                region: region,
                country: country,
                city: city,
                address: address,
                interest: interest
            }

            console.log(contact);
            
            let newContact = new contactSchema(contact);
    
            //Guardo el contacto y obtengo el id creado
            let {_id} = await newContact.save();

            //Busco el contacto recien creado y le agrego los canales de contacto
            let thisContact = await contactSchema.findById(_id);
            await thisContact.contactChannel.push(contactChannels);
            await thisContact.save();
    
            let resp = new response(false,200,"Id de contacto", thisContact);
            res.send(resp);

        }catch(e){

            let resp = new response(true,400,e);
            res.send(resp);
            console.log(e)
        }
    }
}

module.exports = new Contacts();


