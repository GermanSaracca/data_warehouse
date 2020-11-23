const token = JSON.parse(localStorage.getItem('token'));
const idUser = JSON.parse(localStorage.getItem('id'));

//Elementos de Arbol de Regiones
const bigContainer = document.getElementById('big-container');

//Borrar
const deleteTitle = document.getElementById('deleteModalTitle');
const submitDelete = document.getElementById('deleteOk');
const modalBody = document.getElementById('modal-body');

//Actualizar
const updateTitle = document.getElementById('updateModalTitle');
const updateText = document.getElementById('update-text');
const submitUpdate = document.getElementById('updateOk');
const updateModalBody = document.getElementById('update-modal-body');

//Crear
const createTitle = document.getElementById('createModalTitle');
const createText = document.getElementById('create-text');
const submitCreate = document.getElementById('createOk')
const createModalBody = document.getElementById('create-modal-body');

//Crear nueva Region
const inputRegion = document.getElementById('inputRegion');
const submitRegion = document.getElementById('submitRegion');

//Alert errores
const treeAlert = document.getElementById('tree-alert');
const treeAlertText = document.getElementById('tree-alert-text');
treeAlert.style.display = 'none';


//Variable Global
import { basepathClient, basepathServer } from './globals.js';


//EventListeners
document.addEventListener('DOMContentLoaded',getRegions);
submitDelete.addEventListener('click',deleteMe);
submitUpdate.addEventListener('click',updateMe);
submitCreate.addEventListener('click',createMe);
submitRegion.addEventListener('click',createRegion);



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

    //Por cada region existente voy a crear dinamicamente su arbol de region => paises => ciudades
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
    pRegion.addEventListener('click',(event)=>{

        let regionElements = event.currentTarget.parentNode.parentNode.children;

        toggleSection(regionElements);
    });

    let iDelete = document.createElement('i');
    iDelete.className = 'fas fa-trash-alt';
    iDelete.setAttribute('data-target','#deleteModal');
    iDelete.setAttribute('data-toggle','modal');

    iDelete.addEventListener('click',()=>{

        deleteTitle.textContent = 'Eliminar Región';
        // Le paso el id de la region  al atributo id del modal
        modalBody.id = regionId;
        //Le paso el parametro de 'deleteRegion' al title del modal
        //que luego va a ser usado en la funcion deleteMe
        modalBody.title = 'deleteRegion';
        modalBody.innerText = `Esta seguro que desea eliminar a ${regionName}?`;
    });

    let iEdit = document.createElement('i');
    iEdit.className = 'fas fa-edit';

    iEdit.setAttribute('data-target','#updateModal');
    iEdit.setAttribute('data-toggle','modal');

    iEdit.addEventListener('click',()=>{
        
        updateTitle.textContent = 'Actualizar Región';
        // Le paso el id de la region  al atributo id del modal
        updateModalBody.id = regionId;
        //Le paso el parametro de 'updateRegion' al title del modal
        //que luego va a ser usado en la funcion updateMe
        updateModalBody.title = 'updateRegion';
        
    })

    let iNewCountry = document.createElement('i');
    iNewCountry.className = 'fas fa-plus-circle';
    iNewCountry.setAttribute('data-target','#createModal');
    iNewCountry.setAttribute('data-toggle','modal');

    iNewCountry.addEventListener('click', ()=>{

        createTitle.textContent = 'Crear nuevo país';
        createModalBody.id = regionId;
        createModalBody.title = 'newCountry';
        createText.setAttribute('placeholder', 'Ingrese nombre de pais');
        
    })

    
    
    let countries = region.countries;

    divRegion.appendChild(pRegion);
    divRegion.appendChild(iDelete);
    divRegion.appendChild(iEdit);
    divRegion.appendChild(iNewCountry);
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
        pCountry.addEventListener('click',(event)=>{

            let regionElements = event.currentTarget.parentNode.parentNode.children;
            toggleSection(regionElements);
        });

        let iDeleteCountry = document.createElement('i');
        iDeleteCountry.setAttribute('data-target','#deleteModal');
        iDeleteCountry.setAttribute('data-toggle','modal');

        iDeleteCountry.addEventListener('click',()=>{

            deleteTitle.textContent = 'Eliminar País';
            // Le paso el id del pais al atributo id del modal
            modalBody.id = countryId;
            //Le paso el parametro de 'deleteCountry' al title del modal
            //que luego va a ser usado en la funcion deleteMe
            modalBody.title = 'deleteCountry';
            modalBody.innerText = `Esta seguro que desea eliminar a ${countryName}?`;
        })


        let iEditCountry = document.createElement('i');
        iEditCountry.setAttribute('data-target','#updateModal');
        iEditCountry.setAttribute('data-toggle','modal');

        iEditCountry.addEventListener('click',()=>{

            updateTitle.textContent = 'Actualizar Pais';
            // Le paso el id del pais  al atributo id del modal
            updateModalBody.id = countryId;
            //Le paso el parametro de 'updateCountry' al title del modal
            //que luego va a ser usado en la funcion updateMe
            updateModalBody.title = 'updateCountry';
        })

        let iNewCity = document.createElement('i');
        iNewCity.className = 'fas fa-plus-circle';
        iNewCity.setAttribute('data-target','#createModal');
        iNewCity.setAttribute('data-toggle','modal');
    
        iNewCity.addEventListener('click', ()=>{
    
            createTitle.textContent = 'Crear nueva ciudad';
            createModalBody.id = countryId;
            createModalBody.title = 'newCity';
            createText.setAttribute('placeholder', 'Ingrese nombre de ciudad');
            
        })


        iDeleteCountry.className = 'fas fa-trash-alt';
        iEditCountry.className = 'fas fa-edit';


        divCountry.appendChild(pCountry);
        divCountry.appendChild(iDeleteCountry);
        divCountry.appendChild(iEditCountry);
        divCountry.appendChild(iNewCity);
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
            iDeleteCity.setAttribute('data-target','#deleteModal');
            iDeleteCity.setAttribute('data-toggle','modal');
            iDeleteCity.addEventListener('click',()=>{
                
                deleteTitle.textContent = 'Borrar Ciudad';
                // Le paso el id de la ciudad al atributo id del modal
                modalBody.id = cityId;
                //Le paso el parametro de 'deleteCity' al title del modal
                //que luego va a ser usado en la funcion deleteMe
                modalBody.title = 'deleteCity';
                modalBody.innerText = `Esta seguro que desea eliminar a ${cityName}?`;
            })


            let iEditCity = document.createElement('i');
            iEditCity.setAttribute('data-target','#updateModal');
            iEditCity.setAttribute('data-toggle','modal');
            iEditCity.addEventListener('click',()=>{

                updateTitle.textContent = 'Actualizar Ciudad';
                // Le paso el id del pais  al atributo id del modal
                updateModalBody.id = cityId;
                //Le paso el parametro de 'updateCity' al title del modal
                //que luego va a ser usado en la funcion updateMe
                updateModalBody.title = 'updateCity';
            })


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

//Para desplegar o replegar elementos del arbol de regiones
function toggleSection(elements){

    for(let k = 1; k< elements.length; k++){

        if(!elements[k].classList.contains('hidden')){

            elements[k].classList.add("hidden");

        }else{

            elements[k].classList.remove('hidden');
        } 
    }
}

async function deleteMe(event) {
    
    let id = event.currentTarget.parentNode.parentNode.children[1].id;
    let deleteWhat = event.currentTarget.parentNode.parentNode.children[1].title;
    console.log(deleteWhat);

    try{

        let deleteMe = await fetch(`${basepathServer}${deleteWhat}/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
    
        let data = await deleteMe.json();
        
        if(data.error){

            console.log(data);
            treeAlert.style.display = 'unset';
            treeAlertText.textContent = 'Campo invalido o ya existe un campo con ese mismo nombre';

        }else{

            location.reload();
        }


    }catch(e){

        console.log(e);
        alert(e);
    }
}

async function updateMe(event) {
    
    let id = event.currentTarget.parentNode.parentNode.children[1].id;
    let updateWhat = event.currentTarget.parentNode.parentNode.children[1].title;
    let textValue = updateText.value;


    let newName = {
        name : textValue
    }

    try{

        let updateMe = await fetch(`${basepathServer}${updateWhat}/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newName)
        });
    
        let data = await updateMe.json();

        if(data.error){

            console.log(data);
            treeAlert.style.display = 'unset';
            treeAlertText.textContent = 'Campo invalido o ya existe un campo con ese mismo nombre';

        }else{

            location.reload();
        }


    }catch(e){

        console.log(e);
        alert(e);
    }
}

async function createMe(event){

    let id = event.currentTarget.parentNode.parentNode.children[1].id;
    let updateWhat = event.currentTarget.parentNode.parentNode.children[1].title;
    let textValue = createText.value;
    console.log(id)
    console.log(updateWhat)
    console.log(textValue)

    let newName = {
        name : textValue
    }

    try{

        let createMe = await fetch(`${basepathServer}${updateWhat}/${id}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newName)
        });
    
        let data = await createMe.json();

        if(data.error){

            console.log(data);
            treeAlert.style.display = 'unset';
            treeAlertText.textContent = 'Campo invalido o ya existe un campo con ese mismo nombre';

        }else{

            location.reload();
        }


    }catch(e){

        console.log(e);
        alert(e);
    }
}
async function createRegion(){

    let regionName = inputRegion.value;

    let region = {
        name : regionName
    }

    try{

        let createRegion = await fetch(`${basepathServer}newRegion`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(region)
        });
    
        let data = await createRegion.json();

        if(data.error){

            console.log(data);
            treeAlert.style.display = 'unset';
            treeAlertText.textContent = 'Campo invalido o ya existe un campo con ese mismo nombre';

        }else{

            location.reload();
        }
        
    }catch(e){

        console.log(e);
        alert(e);
    }

}


