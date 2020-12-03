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
    async getContacts(req,res){

        try{

            let contacts = await contactSchema.find({},{__v:0}).populate(
                {   
                    path:'company region country city',
                    select: 'name'
                }
            );

            let resp = new response(false,200,"Lista de conctactos completa", contacts)
            res.send(resp);

        }catch(e){

            let resp = new response(true,400,e)
            res.send(resp);
        }
    }
    async deleteContacts(req,res){

        let idsContacts = req.body;

        console.log(idsContacts);

        try{
            //Por cada id del array voy a eliminar uno por uno
            idsContacts.forEach(async (contactId) => {

                let deleted = await contactSchema.findByIdAndDelete({_id: contactId});
                console.log(deleted);
            });

            let resp = new response(false,202,"Contactos eliminado correctamente");
            res.send(resp);

        }catch(e){

            let resp = new response(true,400,"No se pudo eliminar Contactos correctamente",e );
            res.send(resp);
        }

    }
}

module.exports = new Contacts();


