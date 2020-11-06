const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');
const submitBtn = document.getElementById('btn');
const emailHelper = document.getElementById('emailHelpBlock');
const passHelper = document.getElementById('passwordHelpBlock');
const errorsMessage = document.getElementById('errors');

//Variable Global
import { basepathServer } from './globals.js';
import { basepathClient } from './globals.js';


//Event Listeners
document.addEventListener('DOMContentLoaded',alreadyLogIn);

submitBtn.addEventListener('click',validateAndSend);

//Funciones

//Funcion para detectar que no este logueado, si lo esta no puede acceder al login
function alreadyLogIn(){

    const token = JSON.parse(localStorage.getItem('token'));

    if(token != null){

        window.location.href = `${basepathClient}home.html`;
        return;
    }
}

//Enviar form de login a servidor para acceder a homepage
async function validateAndSend(event){

    // Prevent form to submit
    event.preventDefault();

    let email = inputEmail.value;
    let password = inputPassword.value;
    
    //Codigo para enviar datos
    let user = {
        email : email,
        password: password
    }

    let fetchLogin = await fetch(`${basepathServer}login`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    let respFetchLogin = await fetchLogin.json();

    console.log(respFetchLogin);
    //Si existe error dentro de la validacion de joi en servidor
    if(respFetchLogin.details){

        errorsMessage.innerText = respFetchLogin.details[0].message;

      //Si no existe en base de datos  
    } else if(respFetchLogin.codigo == 403){

        errorsMessage.innerText = respFetchLogin.mensaje;

    } else {

        //RECIBO EL TOKEN!!!!!------
        let token = respFetchLogin.token;
        // Guardo el token en localStorage
        localStorage.setItem("token", JSON.stringify(token));

        window.location.href = `${basepathClient}home.html`;
    }
    
}
