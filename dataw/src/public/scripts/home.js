//*Event Listeners
import { basepathServer } from './globals.js';
fetchAuth();


async function fetchAuth(){

    const token = JSON.parse(localStorage.getItem('token'));

    if(token === null){

        window.location.href = `${basepathServer}`;
        return;
    }

    let fetchLogin = await fetch(`${basepathServer}auth`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let fetchJson = await fetchLogin.json();

    console.log(fetchJson);

    if(fetchJson.codigo === 403){

        window.location.href = `${basepathServer}login`;
    }
}


