const response = require('../responses/response');
//Models
const { citySchema, countrySchema, regionSchema } = require('../models/Regions');

class Cities{

    async newCity(req,res){

        let city = req.body;
        let idCountry = req.params;

        try{

            let country = await countrySchema.findById(idCountry);

            if(country == null) throw "No existe pais con ese id";

            let existsCity = await citySchema.find(city);

            if(existsCity != '') throw "Ya existe la ciudad que quiere crear";

            //Creo la ciudad
            let newCity = new citySchema(city);

            //Guardo la nueva ciudad y obtengo el id creado
            let {_id} = await newCity.save();

            //Pusheo nueva ciudad dentro de su pais
            await country.cities.push(newCity);

            //Guardo nuevamente el pais
            await country.save();

            let resp = new response(false,202,"Ciudad creada correctamente", _id);
            res.send(resp);

        }catch(e){

            let resp = new response(true,400,e);
            res.send(resp);
            console.log(e);
        }

    };

    async borrarCiudad(req,res) {

    };

    async actualizarCiudad(req,res){

    };

    async obtenerCiudades(req,res){

    };

}

module.exports = new Cities();