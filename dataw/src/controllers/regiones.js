const response = require('../responses/response');
//Models
const { ciudadSchema, paisSchema, regionSchema } = require('../models/Regiones');


class Regiones{

    //Region
    async nuevaRegion(req,res) {

        let {region} = req.body;

        //Creo una nueva region
        const nuevaRegion = new regionSchema({

            name: region
        });

        //E intento guardarla
        try{
            const guardarRegion = await nuevaRegion.save();
            console.log(guardarRegion);

            let resp = new response(false,202, guardarRegion);
            res.send(resp);

        }catch(e){

            console.log(e);
            let resp = new response(true,400,'No se pudo crear Region');
            res.send(resp);
        }

    };
    async borrarRegion(req,res) {

            
    };
    async actualizarRegion(req,res) {

            
    };
    async obtenerRegiones(req,res) {

    };

    //Pais
    async nuevoPais(req,res) {
        //El pais que quiero agregar y el id de la region padre
        let { idRegion, pais } = req.body;

        const nuevoPais = new paisSchema({
            name:pais
        })

        try{   
            //Guardo el pais nuevo 
            const guardarPais = await nuevoPais.save();
            //Obtengo el id del pais recien creado
            const idPais = guardarPais.id;
            //Update pusheando el nuevo pais dentro de la region 
            const updateRegion = await regionSchema.updateOne(
                {_id: idRegion},
                { $push:{
                        pais: idPais
                    }
                }
            );
            
            let resp = new response(false,202,"Pais creado correctamente",idPais );
            res.send(resp);

        }catch(e){

            console.log(e);
            let resp = new response(true,500,"No se pudo cargar pais",e );
            res.send(resp)
            return;
        }
    };
    async borrarPais(req,res) {

    };
    async actualizarPais (req,res) {

    };
    async obtenerPaises(req,res) {

    };

    //Ciudad
    async nuevaCiudad(req,res){

        //La ciudad que quiero agregar y el pais donde pertenece
        let {idPais,ciudad} = req.body;

        const nuevaCiudad = new ciudadSchema({
            name: ciudad
        })
        try{
            //Guardo ciudad
            const guardarCiudad = await nuevaCiudad.save();
            const idCiudad = guardarCiudad.id;

            //Update pusheando la nueva ciudad dentro del pais padre
            const updatePais = await paisSchema.updateOne(
                {_id: idPais},
                { $push:{
                        ciudad: idCiudad
                    }
                }
            );
            console.log(updatePais);
            
            let resp = new response(false,202,"Ciudad creada correctamente",idCiudad);
            res.send(resp);

        }catch(e){

            console.log(e);
            let resp = new response(true,500,"No se pudo cargar ciudad",e );
            res.send(resp)
            return;
        }
    };
    async borrarCiudad(req,res) {

    };
    async actualizarCiudad(req,res){

    };
    async obtenerCiudades(req,res){

    };

}

module.exports = new Regiones();