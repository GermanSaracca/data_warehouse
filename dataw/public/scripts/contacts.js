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
const btnSubmit = document.getElementById('btnSubmit');
const errors = document.getElementById('errors');

//Tabla de contactos
let contactTable = document.getElementById('contacts-table');

//Borrar contactos seleccionados
let deleteContactsBtn = document.getElementById('deleteContacts');
deleteContactsBtn.innerText = "Borrar contactos seleccionados (0)";
let selectedContacts = [];
let selectedCounter = 0;
//Modal de borrado de contacto
const deleteBody = document.getElementById('deleteBody');
const submitDeleteContacts = document.getElementById('deleteOk');

//Modal de actualizacion de usuario
const updateContactContainer = document.getElementById('updateContactContainer');


//Event Listener
document.addEventListener('DOMContentLoaded',appendCompaniesToSelectOne);
document.addEventListener('DOMContentLoaded',appendRegionsToSelects);
document.addEventListener('DOMContentLoaded',getContacts);
document.addEventListener('DOMContentLoaded',deleteAllSelectedFromLocal);
interest.addEventListener("change",rangeOutputValue);
newContactBtn.addEventListener('click',() => newContactContainer.style.display = 'flex');

btnSubmit.addEventListener('click', createNewContact);
deleteContactsBtn.addEventListener('click',textDelete)
submitDeleteContacts.addEventListener('click',deleteSelectedContacts);





//Funciones

async function createNewContact(event) {

    event.preventDefault();

    let companyId;
    if (company.options[company.selectedIndex] != undefined){

        companyId = company.options[company.selectedIndex].id;
    }
    let address = '';
    let regionId;
    let countryId;
    let cityId;
    if (selectRegion.options[selectRegion.selectedIndex] != undefined
        && selectCountry.options[selectCountry.selectedIndex] != undefined
        && selectCity.options[selectCity.selectedIndex] != undefined){

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
};

async function deleteSelectedContacts() {

    let selectedContacts = checkIfSelectedContacts();  
    console.log(selectedContacts); 

    let fetchDeleteContacts = await fetch(`${basepathServer}deleteContacts`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(selectedContacts)
    });

    let deletedData = await fetchDeleteContacts.json();

    console.log(deletedData);
    if(deletedData.codigo == 202){
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

async function getContacts() {

    let fetchContacts = await fetch(`${basepathServer}contacts`,{
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    let allContacts = await fetchContacts.json();
    let contacts = allContacts.data;
    console.log(contacts);


    contacts.forEach(contact =>{

        createContactRow(contact);
    })
    
};
async function getContactById(contactId) {
    
    console.log(contactId);

    let fetchContact = await fetch(`${basepathServer}contact/${contactId}`,{
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    let info = await fetchContact.json();
    let contact = info.data;
    console.log(contact);
    
    return contact;
}

function createContactRow(contact) {

    let contactId = contact._id;
    let name = contact.name;
    let lastname = contact.lastname;
    let email = contact.email;
    let address = contact.address;

    let region;
    let country;
    let city;
    if (contact.region[0] == undefined || contact.country[0] == undefined || contact.city[0] == undefined  ){

        region = 'No brindado por el contacto';
        country = '';
        city = '';
    }else{
        region = contact.region[0].name;
        country = contact.country[0].name;
        city = contact.city[0].name;
    }

    let company = contact.company[0].name;
    let position = contact.position;
    let interest = contact.interest;

    let contactChannelsArray = contact.contactChannel;

    //Empiezo a crear contenido dinamicamente
    let contactRow = document.createElement('div');
    let checkbox = document.createElement('input');

    //Nombre,apellido y email
    let div1 = document.createElement('div');

    let pName = document.createElement('p');
    let smallEmail = document.createElement('small');

    //Pais y Region
    let div2 = document.createElement('div');
    let smallCity = document.createElement('small');
    let pCountry = document.createElement('p');
    let smallRegion = document.createElement('small');


    let div3 = document.createElement('div');
    let div4 = document.createElement('div');
    //Intereses
    let div5 = document.createElement('div');

    managinContactChannels(contactChannelsArray,div5);

    let div6 = document.createElement('div');
    let divProgress = document.createElement('div');
    let divProgressBar = document.createElement('div');
   
    let divEdits = document.createElement('div');
    let iEdit = document.createElement('i');

    contactRow.className = 'contact-row';
    contactRow.id = contactId;
    checkbox.className = 'contact-checkbox';
    div1.className = 'contact-info';
    div2.className = 'contact-info';
    div3.className = 'contact-info';
    div4.className = 'contact-info';
    div5.className = 'contact-info';
    div6.className = 'contact-info';
    divProgress.className = 'progress';
    divProgressBar.className = 'progress-bar';

    checkbox.setAttribute('type','checkbox')
    divProgressBar.setAttribute('role','progressbar');
    divProgressBar.setAttribute('style',`width: ${interest}%`);
    if(interest == 25) divProgressBar.style.backgroundColor = '#008080';
    if(interest == 50) divProgressBar.style.backgroundColor = '#008000';
    if(interest == 75) divProgressBar.style.backgroundColor = '#ffa500';
    if(interest == 100) divProgressBar.style.backgroundColor = '#ff0000';
    divProgressBar.innerText = `${interest}%`;

    divEdits.className = 'contact-edit';
    iEdit.className = 'fas fa-user-edit';
    iEdit.setAttribute('data-target','#updateModal');
    iEdit.setAttribute('data-toggle','modal');

    iEdit.addEventListener('click',()=>{
        
        updateContactContainer.style.display = 'flex';

        /* 
        Al clickear en editar el contacto hago un request al back con toda
        la informacion del contacto para llenar el modal con toda la info
        */
        let contactInfo = getContactById(contactId);
        console.log(contactInfo);
    });
    
    pName.innerText = `${name} ${lastname}`;
    smallEmail.innerText = email;

    smallCity.innerText = city;
    pCountry.innerText = country;
    smallRegion.innerText = region;

    div3.innerText = company;
    div4.innerText = position;
    

    checkbox.addEventListener('change',function(){

        if(this.checked){

            contactRow.className = 'contact-row selected-row' ;
            selectedCounter += 1;
            //Añado contacto al localstorage
            saveSelectedContact(contactId);
            deleteContactsBtn.innerText = `Borrar contactos seleccionados (${selectedCounter})`;

        }else{

            contactRow.className = 'contact-row'; 
            selectedCounter -= 1;
            //Remuevo contacto de localstorage
            removeSelectedContact(contactId);
            deleteContactsBtn.innerText = `Borrar contactos seleccionados (${selectedCounter})`;
        }
        // this.checked ? contactRow.className = 'contact-row selected-row' : contactRow.className = 'contact-row';
    });


    div1.appendChild(pName);
    div1.appendChild(smallEmail);

    div2.appendChild(smallCity);
    div2.appendChild(pCountry);
    div2.appendChild(smallRegion);

    divProgress.appendChild(divProgressBar);
    div6.appendChild(divProgress);
    
    contactRow.appendChild(checkbox);
    contactRow.appendChild(div1);
    contactRow.appendChild(div2);
    contactRow.appendChild(div3);
    contactRow.appendChild(div4);
    contactRow.appendChild(div5);
    contactRow.appendChild(div6);

    divEdits.appendChild(iEdit);
    contactRow.appendChild(divEdits);

    contactTable.appendChild(contactRow);
};

function managinContactChannels(contactChannelsArray,div5){

    contactChannelsArray.forEach(contactChannel =>{

        //Recorro cada canal de cada contacto, si es favorito lo voy a mostrar
        contactChannel.forEach(channel =>{

            if(channel.preferences == "Canal favorito"){

                let channelDiv = document.createElement('div');
                channelDiv.className = 'channel';
                channelDiv.innerText = channel.contactChannel;

                // evento para mostrar la informacion del canal al clickearlo
                channelDiv.addEventListener('click',()=>{
                    if(channelDiv.innerHTML == `${channel.contactChannel} <br> (${channel.usserAccount})`){

                        channelDiv.innerText = channel.contactChannel;
                    }else{
                        channelDiv.innerHTML = `${channel.contactChannel} <br> (${channel.usserAccount})`;
                    }
                })
                div5.appendChild(channelDiv);
            }

        });
        //Si el contacto no tiene canales preferidos solo se comunicara por email
        let canalesFav = contactChannel.filter(channel => channel.preferences == 'Canal favorito');
        let canalesSinPreferencia = contactChannel.filter(channel => channel.preferences == 'Sin preferencia');

        //Si el usuario no tiene canal preferido elegido y tampoco canal sin preferencia entonces solo comunicar por email
        if(canalesFav.length == 0){

            let noChannel = document.createElement('div');
            noChannel.className = 'channel';
            noChannel.innerText = 'Solo email';
            div5.appendChild(noChannel);
 
        }
        
    })
}

function checkIfSelectedContacts(){

    //Chequear si tengo algo en localstorage
    let selectedContacts;

    if(localStorage.getItem('selectedContacts') === null){
        selectedContacts = [];
    } else {

        selectedContacts = JSON.parse(localStorage.getItem('selectedContacts'));
    }
    return selectedContacts;
};

function saveSelectedContact(contactId){

    //Chequear si tengo algo en localstorages
    let selectedContacts = checkIfSelectedContacts();

    selectedContacts.push(contactId);
    localStorage.setItem('selectedContacts', JSON.stringify(selectedContacts));
};

function removeSelectedContact(contactId){

    //Chequear si tengo algo en localstorage
    let selectedContacts = checkIfSelectedContacts();

    //Busco el valor de texto del elem clickeado
    const selectedIndex = selectedContacts.indexOf( contactId );
    //elimino el valor del array de todos
    selectedContacts.splice( selectedIndex, 1);

    
    //Vuelvo a guardar el array
    localStorage.setItem('selectedContacts',JSON.stringify(selectedContacts));

};

function deleteAllSelectedFromLocal(){

    localStorage.setItem('selectedContacts', JSON.stringify(selectedContacts));
};

function textDelete() {
    let selectedContacts = checkIfSelectedContacts();

    let contactsLength = selectedContacts.length;

    if(contactsLength == 1){
        deleteBody.innerText = `¿Esta seguro que desea eliminar el contacto?`;
        submitDeleteContacts.removeAttribute('disabled');

    } else if (contactsLength > 1) {
        deleteBody.innerText = `¿Esta seguro que desea eliminar los ${contactsLength} contactos seleccionados?`;
        submitDeleteContacts.removeAttribute('disabled');

    } else {
        deleteBody.innerText = `No tiene ningun contacto seleccionado`;
        submitDeleteContacts.setAttribute('disabled',true);
    }
};

//Obtener info del contacto al clickear sobre editar
function infoUsersByClick(){



    return user;
}



