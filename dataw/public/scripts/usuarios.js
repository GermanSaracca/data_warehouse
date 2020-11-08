//Elementos
const usuariosLi = document.getElementById('usuariosLi');
usuariosLi.style.color = '#E9C46A';

const name = document.getElementById('name');
const lastname = document.getElementById('lastname');
const email = document.getElementById('email');
const profile = document.getElementById('profile');
const firstPassword = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

const eye = document.getElementById('eye');
const errorsMessage = document.getElementById('errors');
const alertCreation = document.getElementById('alertCreation');
const butonSubmit = document.getElementById('btnSubmit');

const helpPassword = document.getElementById('helpPassword')
helpPassword.style.display = 'none';
//Variable Global
import { basepathClient, basepathServer } from './globals.js';


//Event Listeners
document.addEventListener('DOMContentLoaded',checkIfAdmin);//Chequea si quien quiere acceder a esta seccion es Admin o Usuario
eye.addEventListener('click',visiblePass);
firstPassword.addEventListener('focus',()=>{helpPassword.style.display = 'unset' });
firstPassword.addEventListener('blur',()=>{helpPassword.style.display = 'none' });
confirmPassword.addEventListener('keyup',passwordConfirm);
butonSubmit.addEventListener('click',registerUser);

//Funciones

//Registrar usuario nuevo
async function registerUser(event) {
    
    // Prevent form to submit
    event.preventDefault();

    const token = JSON.parse(localStorage.getItem('token'));

    let newUser = {
        name: name.value,
        lastname: lastname.value,
        email: email.value,
        profile: profile.value,
        password: firstPassword.value
    };
    console.table(newUser);

    let register = await fetch(`${basepathServer}register`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
    });

    let respRegister = await register.json();

    console.log(respRegister);

    //Si existe error dentro de la validacion de joi en servidor
    if(respRegister.details){

        errorsMessage.innerText = respRegister.details[0].message;

        //Si no existe en base de datos  
    } else if(respRegister.codigo == 403){

        errorsMessage.innerText = respRegister.mensaje;

    }

    //Alerta de usuario creado y reseteo de formulario
    if(respRegister.codigo == 202){

        alertCreation.style.display = 'block';
        name.value = '';
        lastname.value = '';
        email.value = '';
        firstPassword.value = '';
        confirmPassword.value = '';
        errorsMessage.innerText = '';
    }
}

//Ver password al tipearla
function visiblePass() {
    
    if (firstPassword.type === "password") {
        eye.className =  "fas fa-eye";
        firstPassword.type = "text";
    }else {
        eye.className =  "fas fa-eye-slash";
        firstPassword.type = "password";
    }
};
// Confirm password
function passwordConfirm(){

    if(firstPassword.value != confirmPassword.value){

        errors.innerText = 'Las contraseñas no coinciden';
        butonSubmit.setAttribute('disabled',true);
    }else{
        errors.innerText = '';
        butonSubmit.removeAttribute('disabled');
    }
}
function checkIfAdmin() {

    //Recupero info del local que me dice si es admin o user
    const profile = JSON.parse(localStorage.getItem('profile'));

    //Si no es User lo mando de vuelta a la home
    if(profile == 'User'){

        window.location.href = `${basepathClient}home.html`;
    }
}