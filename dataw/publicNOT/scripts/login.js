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

submitBtn.addEventListener('click',validateAndSend);



//Funciones
async function validateAndSend(){

    let email = inputEmail.value;
    let password = inputPassword.value;
    
    if(!validateEmail(email)){

        emailHelper.style.display = 'unset';
    }
    if(!validatePass(password)){

        passHelper.style.display = 'unset';
    }
    if(validateEmail(email) && validatePass(password)){

        //Codigo para enviar datos
        let user = {
            email : email,
            password: password
        }

        fetch(`${basepathServer}login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then(resp => resp.json())
        .then(data =>{

            //RECIBO EL TOKEN!!!!!------***************-----------------------------************
            console.log(data);

            if(data.codigo == 403){

                errorsMessage.innerText = data.mensaje;
                console.log(data);
            }
        })


    }
}





function validateEmail(param){
    // un @ que separe y un '.[algo]' al final
    const emailReqs = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    //validacion nombre de usuario
    if(emailReqs.test(param)){

        return true;
    }else {

        return false;
    }
};

function validatePass(param){
    // Minimo 8 caracteres, al menos una letra mayuscula, una letra minuscula y un numero.
    const passReqs= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,36}$/;

    //validacion nombre de usuario
    if(passReqs.test(param)){

        return true;
    }else {

        return false;
    }
};
