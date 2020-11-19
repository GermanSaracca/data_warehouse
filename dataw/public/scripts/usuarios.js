//Elementos
const token = JSON.parse(localStorage.getItem('token'));


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

const userEdit = document.getElementsByClassName('fa-user-edit');
const userDelete = document.getElementsByClassName('fa-trash-alt');
const usersTable = document.getElementById('users-table');

//Variable Global
import { basepathClient, basepathServer } from './globals.js';


//Event Listeners
document.addEventListener('DOMContentLoaded',checkIfAdmin);//Chequea si quien quiere acceder a esta seccion es Admin o Usuario
document.addEventListener('DOMContentLoaded',getUsers);
eye.addEventListener('click',visiblePass);
firstPassword.addEventListener('focus',()=>{helpPassword.style.display = 'unset' });
firstPassword.addEventListener('blur',()=>{helpPassword.style.display = 'none' });
confirmPassword.addEventListener('keyup',passwordConfirm);
butonSubmit.addEventListener('click',registerUser);

//Funciones
//Obtener todos los usuarios
async function getUsers(params) {
    
    let fetchUsers = await fetch(`${basepathServer}getUsers`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let allUsers = await fetchUsers.json();
    let users = allUsers.data;
    console.log(users);

    for(let i=0; i<users.length; i++){

        let name = users[i].name;
        let lastname = users[i].lastname;
        let email = users[i].email;
        let profile = users[i].profile;
        let id = users[i]._id;

        createUserRow(name, lastname, email, profile, id);
        
    }
}
//Registrar usuario nuevo
async function registerUser(event) {
    
    // Prevent form to submit
    event.preventDefault();

    

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

    let data = await register.json();

    console.log(data);

    //Si existe error dentro de la validacion de joi en servidor
    if(data.details){

        errorsMessage.innerText = data.details[0].message;

        //Si no existe en base de datos  
    } else if(data.codigo == 403){

        errorsMessage.innerText = data.mensaje;

    }

    //Alerta de usuario creado y reseteo de formulario
    if(data.codigo == 202){

        alertCreation.style.display = 'block';
        name.value = '';
        lastname.value = '';
        email.value = '';
        firstPassword.value = '';
        confirmPassword.value = '';
        errorsMessage.innerText = '';
        getUsers();
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

//Obtener info de usuario al clickear sobre editar o eliminar
function infoUsersByClick(event){

    let name = event.currentTarget.parentNode.parentNode.children[0].innerText;
    let lastname = event.currentTarget.parentNode.parentNode.children[1].innerText;
    let email = event.currentTarget.parentNode.parentNode.children[2].innerText;
    let profile = event.currentTarget.parentNode.parentNode.children[3].innerText;
    let id = event.currentTarget.parentNode.parentNode.id;
    


    let user = {
        name: name,
        lastname: lastname,
        email: email,
        profile: profile,
        id: id
    }
    return user;
}

function createUserRow(a,b,c,d,e){

    let userRow = document.createElement('div');
    let div1 = document.createElement('div');
    let div2 = document.createElement('div');
    let div3 = document.createElement('div');
    let div4 = document.createElement('div');
    let divEdits = document.createElement('div');
    let iEdit = document.createElement('i');
    let iDelete = document.createElement('i');

    userRow.className = 'user-row';
    userRow.id = e;
    div1.className = 'user-info';
    div2.className = 'user-info';
    div3.className = 'user-info';
    div4.className = 'user-info';
    divEdits.className = 'user-edit';
    iEdit.className = 'fas fa-user-edit';
    iDelete.className = 'fas fa-trash-alt';

    div1.innerText = a;
    div2.innerText = b;
    div3.innerText = c;
    div4.innerText = d;

    userRow.appendChild(div1);
    userRow.appendChild(div2);
    userRow.appendChild(div3);
    userRow.appendChild(div4);
    divEdits.appendChild(iEdit);
    divEdits.appendChild(iDelete);
    userRow.appendChild(divEdits);
    usersTable.appendChild(userRow);

    iEdit.addEventListener('click',(event)=>{

        let user = infoUsersByClick(event);
        console.log(user)
    });

    iDelete.addEventListener('click',(event)=>{

        //Obtengo los datos del usuario clickeado para borrar
        let {name,lastname,id} = infoUsersByClick(event);
        //Le pido confirmacion al administrador
        let alert = confirm(`Esta seguro que desea eliminar al usuario ${name} ${lastname}?`);
        
        if(alert){
            deleteUser(id);
        }
        
    });

};

async function deleteUser(id){

    let fetchDelete = await fetch(`${basepathServer}deleteUser/${id}`, {
    method: 'DELETE',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
    });

    let data = await fetchDelete.json();
    console.log(data);
    if(!data.error){

        alert(data.mensaje);
        window.location.reload();
    }else{
        alert(e);
    }
}