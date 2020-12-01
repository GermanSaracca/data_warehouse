//Elementos
const token = JSON.parse(localStorage.getItem('token'));
//Variable Global
import { basepathServer } from './globals.js';


//Nuevo contacto
const newContactBtn = document.getElementById('createContact');

const newContactContainer = document.getElementById('newContactContainer');
const selectCompany = document.getElementsByClassName('selectpicker')[0];

const name = document.getElementById('name');
const lastname = document.getElementById('lastname');
const position = document.getElementById('position');
const email = document.getElementById('email');
const company = document.getElementById('company');

const selectRegion = document.getElementById('region');
const selectCountry = document.getElementById('country');
const selectCity = document.getElementById('city');
const address = document.getElementById('address');
let interest = document.getElementById('interest');
let rangeOutput = document.getElementById('range-span');

const phone = document.getElementById('phone');
const phonePreference = document.getElementById('phonePreference');

const whatsapp = document.getElementById('whatsapp');
const whatsappPreference = document.getElementById('whatsappPreference');

const instagram = document.getElementById('instagram');
const instagramPreference = document.getElementById('instagramPreference');

const facebook = document.getElementById('facebook');
const facebookPreference = document.getElementById('facebookPreference');

const linkedin = document.getElementById('linkedin');
const linkedinPreference = document.getElementById('linkedinPreference');

const profileImage = document.getElementById('profile-image');
const btnSubmit = document.getElementById('btnSubmit');
const errors = document.getElementById('errors');



//Event Listener
document.addEventListener('DOMContentLoaded',appendCompaniesToSelectOne);
document.addEventListener('DOMContentLoaded',appendRegionsToSelects);
interest.addEventListener("change",rangeOutputValue);
newContactBtn.addEventListener('click',() => newContactContainer.style.display = 'flex');

btnSubmit.addEventListener('click', createNewContact);





//Funciones

async function createNewContact(event) {

    event.preventDefault();

    let companyId;
    if (company.options[company.selectedIndex] != undefined){

        companyId = company.options[company.selectedIndex].id;
    }
    let regionId;
    let countryId;
    let cityId;
    if (selectRegion.options[selectRegion.selectedIndex] != undefined){

        regionId = selectRegion.options[selectRegion.selectedIndex].id;
        countryId = selectCountry.options[selectCountry.selectedIndex].id;
        cityId = selectCity.options[selectCity.selectedIndex].id;
    }

    let nuevoContacto = {
        
        name: name.value,
        lastname: lastname.value,
        position: position.value,
        email: email.value,
        company: companyId,
        region: regionId ,
        country: countryId ,
        city: cityId ,
        address: address.value,
        interest: rangeOutput.innerText,
        contactChannels: []
    };

    if(phone.value != ''){
        
        let phoneChannel = {
            contactChannel : "Phone",
            usserAccount: phone.value,
            preferences: phonePreference.value
        };
        nuevoContacto.contactChannels.push(phoneChannel)
    };
    if(whatsapp.value != ''){
        
        let whatsappChannel = {
            contactChannel : "Whatsapp",
            usserAccount: whatsapp.value,
            preferences: whatsappPreference.value
        };
        nuevoContacto.contactChannels.push(whatsappChannel)
    };
    if(instagram.value != ''){
        
        let instagramChannel = {
            contactChannel : "Instagram",
            usserAccount: instagram.value,
            preferences: instagramPreference.value
        };
        nuevoContacto.contactChannels.push(instagramChannel)
    };
    if(facebook.value != ''){
        
        let facebookChannel = {
            contactChannel : "Facebook",
            usserAccount: facebook.value,
            preferences: facebookPreference.value
        };
        nuevoContacto.contactChannels.push(facebookChannel)
    };
    if(linkedin.value != ''){
        
        let linkedinChannel = {
            contactChannel : "Linkedin",
            usserAccount: linkedin.value,
            preferences: linkedinPreference.value
        };
        nuevoContacto.contactChannels.push(linkedinChannel)
    };

    console.log(nuevoContacto);
    console.table(nuevoContacto);

    let sendNewContact = await fetch(`${basepathServer}newContact`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(nuevoContacto)
    });

    let newContact = await sendNewContact.json();

    console.log(newContact);
    
    if(newContact.mensaje.details){

        errors.textContent = newContact.mensaje.details[0].message;
    }else if (newContact.mensaje.code == 11000){

        errors.textContent = "Email ya en uso";
    }else{

        location.reload();

    }
}

async function appendCompaniesToSelectOne() {
    
    let fetchCompanies = await fetch(`${basepathServer}companies`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let allCompanies = await fetchCompanies.json();
    let companies = allCompanies.data;

    companies.forEach(element => {

        let option = document.createElement('option');
        option.innerText = element.name;
        option.id = element._id;
        selectCompany.appendChild(option);
    });
    // Para refrescar el elemento select una vez que previamente le cargamos los options de companias.
    $('.selectpicker').selectpicker('refresh');
}


function  rangeOutputValue(){

    let value = interest.value;
    if(value == 0) rangeOutput.innerText = '0';
    if(value == 1) rangeOutput.innerText = '25';
    if(value == 2) rangeOutput.innerText = '50';
    if(value == 3) rangeOutput.innerText = '75';
    if(value == 4) rangeOutput.innerText = '100';
}

async function appendRegionsToSelects(params) {

    let fetchRegions = await fetch(`${basepathServer}regions`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let allRegions= await fetchRegions.json();
    let regions = allRegions.data;


    regions.forEach(element =>{

        let option = document.createElement('option');
        option.innerText = element.name;
        option.id = element._id;
        selectRegion.appendChild(option);

    })

    // Al cambiar de region , alimento el select de paises segun la region seleccionada
    //  y el select de ciudades con el pais que caiga en la primer opcion del select paises
    selectRegion.addEventListener('change',() => {

        selectCountry.innerHTML = '';
        selectCity.innerHTML = '';

        let thisRegion = regions.filter(element => element.name == selectRegion.value );

        let countries = thisRegion[0].countries;
        countries.forEach(country =>{

            let countryOption = document.createElement('option');
            countryOption.innerText = country.name;
            countryOption.id = country._id;
            selectCountry.appendChild(countryOption);
        })
        let thisCountry = countries.filter(element => element.name == selectCountry.value);
        let cities = thisCountry[0].cities;

        cities.forEach(city =>{

            let cityOption = document.createElement('option');
            cityOption.innerText = city.name;
            cityOption.id = city._id;
            selectCity.appendChild(cityOption);
        })


    });
    // Al cambiar de pais , alimento el select de ciudades segun el pais seleccionado
    selectCountry.addEventListener('change', ()=>{

        selectCity.innerHTML = '';

        let thisRegion = regions.filter(element => element.name == selectRegion.value);
        let countries = thisRegion[0].countries;
        
        let thisCountry = countries.filter(element => element.name == selectCountry.value);
        let cities = thisCountry[0].cities;

        cities.forEach(city =>{

            let cityOption = document.createElement('option');
            cityOption.innerText = city.name;
            cityOption.id = city._id;
            selectCity.appendChild(cityOption);
        })
    });

};

