const response = require('../responses/response');
//Models
const { citySchema, countrySchema, regionSchema } = require('../models/Regions');



class Countries{


    async newCountry(req,res) {

        let country = req.body;
        let idRegion = req.params;

        try{
            
            let region = await regionSchema.findById(idRegion);

            if(region == null) throw "No existe region con ese id";

            let existCountry = await countrySchema.find(country);

            if(existCountry != '') throw "Ya existe el pais que quiere crear";

            //Creo el pais
            let newCountry = new countrySchema(country);


            //Guardo el pais y obtengo el id
            let { _id } = await newCountry.save();

            //Pusheo dentro de la region a quien pertenece
            await region.countries.push( newCountry );

            //Guardo nuvamente region
            await region.save();

            let resp = new response(false,202,"Pais creado correctamente", _id);
            res.send(resp);

        }catch(e){

            let resp = new response(true,400,e);
            res.send(resp);
            console.log(e);
        }
    };

    async deleteCountry(req,res) {

    };
    async updateCountry (req,res) {

    };
    async getCountries(req,res) {

    };


}

module.exports = new Countries();