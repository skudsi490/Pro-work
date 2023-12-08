import { fetchUsers } from "../utils/fetchUsers.js";

let users = await fetchUsers();
let usersFromLocalStorage = JSON.parse(localStorage.getItem("userData")) || [];
console.log(usersFromLocalStorage);

let button = document.getElementById("button");
let loginBtn = document.getElementById("login");
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let email = document.getElementById("email");
let password = document.getElementById("password");
let wrongData = document.getElementById("wrongData");

class Users {
    constructor(id, firstName, lastName, email, password) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}

function register() {
    if (firstName.value == "" || lastName.value == "" || email.value == "" || password.value == "") {
        wrongData.innerText = "Missing Data";
    } else {
        let userExists = usersFromLocalStorage.some(user => user.email === email.value);
        if (userExists) {
            wrongData.innerText = "This user already exists in the system";
        } else {
            let newUser = new Users(users.length + 1, firstName.value, lastName.value, email.value, password.value);
            users.push(newUser);
            usersFromLocalStorage.push(newUser);
            localStorage.setItem("userData", JSON.stringify(usersFromLocalStorage));
            localStorage.setItem("CurrentUser", JSON.stringify(newUser));
            wrongData.innerText = "User successfully created";
            wrongData.style.color = "rgb(0, 192, 22)";
            setTimeout(() => {
                window.location.href = '../pages/home.html';
            }, 2000);
        }
    }
}

function login_handler() {
    window.location.href = '../pages/login.html';
}

button.addEventListener("click", register);
loginBtn.addEventListener("click", login_handler);
