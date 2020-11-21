const token = JSON.parse(localStorage.getItem('token'));
const idUser = JSON.parse(localStorage.getItem('id'));

//Elementos de Arbol de Regiones
const bigContainer = document.getElementById('big-container');

const regionDiv1 = document.getElementById('sudamerica');
const countryUl = document.getElementsByClassName('ul-country'); //Despliega los paises de la region y sus ciudades
const countryDiv1 = document.getElementById('Argentina');
const countryDiv2 = document.getElementById('Brasil');
const cityLi = document.getElementsByClassName('li-city');//Despliega las ciuades de cada pais

//Variable Global
import { basepathClient, basepathServer } from './globals.js';


//EventListeners
document.addEventListener('DOMContentLoaded',getRegions);



//Funciones



//Obtener todos los usuarios
async function getRegions(params) {
    
    let fetchRegions = await fetch(`${basepathServer}regions`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let data = await fetchRegions.json();
    let regions = data.data;


    for(let p = 0; p < regions.length; p++){

        let region = regions[p];

        createRegionUl(region);

    }

}

function createRegionUl(region){

    let regionName = region.name;

    let regionId = region._id;

    let ulRegion = document.createElement('ul');
    ulRegion.className = 'ul-region';
    ulRegion.title = regionName;
    ulRegion.id = regionId;


    let divRegion = document.createElement('div');
    divRegion.className = 'region-div';
    divRegion.id = regionName;


    let pRegion = document.createElement('p');
    pRegion.textContent = regionName;

    let iDelete = document.createElement('i');
    let iEdit = document.createElement('i');
    iDelete.className = 'fas fa-trash-alt';
    iEdit.className = 'fas fa-edit';

    let countries = region.countries;


    divRegion.appendChild(pRegion);
    divRegion.appendChild(iDelete);
    divRegion.appendChild(iEdit);
    ulRegion.appendChild(divRegion);

    //Append de la region al contenedor 
    bigContainer.appendChild(ulRegion)

    //Genero el UL de cada pais con sus ciudades
    for(let a = 0; a< countries.length; a++){

        
        let countryName = countries[a].name;
        let countryId = countries[a]._id;

        let ulCountry = document.createElement('ul');
        ulCountry.className = 'ul-country';
        ulCountry.title = countryName;
        ulCountry.id = countryId;

        let divCountry = document.createElement('div');
        divCountry.className = 'country-div';
        

        let pCountry = document.createElement('p');
        pCountry.textContent = countryName;

        let iDeleteCountry = document.createElement('i');
        let iEditCountry = document.createElement('i');
        iDeleteCountry.className = 'fas fa-trash-alt';
        iEditCountry.className = 'fas fa-edit';
        

        divCountry.appendChild(pCountry);
        divCountry.appendChild(iDeleteCountry);
        divCountry.appendChild(iEditCountry);
        ulCountry.appendChild(divCountry);

        //Append del cada pais a la region
        ulRegion.appendChild(ulCountry)

        let cities = countries[a].cities;
        //
        for(let b = 0; b < cities.length; b++){

            let cityName = cities[b].name;
            let cityId = cities[b]._id;

            let cityDiv = document.createElement('div');
            cityDiv.className = 'city-div';

            let cityLi = document.createElement('li');
            cityLi.className = 'li-city';
            cityLi.id = cityId;
            cityLi.textContent = cityName;

            let iDeleteCity = document.createElement('i');
            let iEditCity = document.createElement('i');
            iDeleteCity.className = 'fas fa-trash-alt';
            iEditCity.className = 'fas fa-edit';


            cityLi.appendChild(iDeleteCity);
            cityLi.appendChild(iEditCity);
            cityDiv.appendChild(cityLi);

            //Append de cada ciudad a sus paises
            ulCountry.appendChild(cityDiv);

        }
    }
}




// //Para hacer que la region
// regionDiv1.addEventListener('click', (event) => {

//     //Accedo al elem padre y luego recorro los hijos(pais) excepto el primer hijo que seria la region
//     let regionElements = event.currentTarget.parentNode.children;

//     for(let k = 1; k< regionElements.length; k++){

//         if(!regionElements[k].classList.contains('hidden')){

//             regionElements[k].classList.add("hidden");

//         }else{

//             regionElements[k].classList.remove('hidden');
//         } 
//     }
// })

// countryDiv1.addEventListener('click', (event) => {

//     //Accedo al elem padre y luego recorro los hijos(ciudades) excepto el primer hijo que seria el pais
//     let arrayElements = event.currentTarget.parentNode.children;

//     for(let k = 1; k< arrayElements.length; k++){

//         if(!arrayElements[k].classList.contains('hidden')){

//             arrayElements[k].classList.add("hidden");

//         }else{

//             arrayElements[k].classList.remove('hidden');
//         }  
//     }
// })

// countryDiv2.addEventListener('click', (event) => {
//     //Accedo al elem padre y luego recorro los hijos(ciudades) excepto el primer hijo que seria el pais
//     let arrayElements = event.currentTarget.parentNode.children;

//     for(let k = 1; k< arrayElements.length; k++){

//         if(!arrayElements[k].classList.contains('hidden')){

//             arrayElements[k].classList.add("hidden");

//         }else{

//             arrayElements[k].classList.remove('hidden');
//         }
        
//     }
// })