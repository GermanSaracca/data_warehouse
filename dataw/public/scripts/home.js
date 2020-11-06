//Variables
const logOut = document.getElementById('logOut');
import { basepathClient, basepathServer } from './globals.js';
const welcome = document.getElementById('welcome');
//*Event Listeners
document.addEventListener('DOMContentLoaded',fetchAuth);


//Funciones

//Funcion para detectar que este logueado, si no lo esta lo mandamos a la pagina de login
async function fetchAuth(){

    const token = JSON.parse(localStorage.getItem('token'));

    if(token === null){

        window.location.href = `${basepathClient}login.html`;
        return;
    }else{

        let fetchLogin = await fetch(`${basepathServer}auth`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
    
        let fetchJson = await fetchLogin.json();

        let email = fetchJson.token.email;

        welcome.innerText = `Welcome ${email}`;

        if(fetchJson.codigo === 403){
    
            window.location.href = `${basepathServer}login`;
        }
    }
}

//Desloguea usuario, remueve token de local storage y llama de nuevo a la funcion fetchAuth
logOut.addEventListener('click',()=>{

    localStorage.removeItem('token');
    fetchAuth();
})

