let usersFromLocalStorage = JSON.parse(localStorage.getItem("userData"));
console.log(usersFromLocalStorage);

let button = document.getElementById("button");
let loginBtn = document.getElementById("login");
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let email = document.getElementById("email");
let password = document.getElementById("password");
let wrongData = document.getElementById("wrongData");

class Users {
    constructor( firstName, lastName, email, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}

function register() {
    if (firstName.value == "" ||  lastName.value == "" ||  email.value == "" || password.value == "") {
        wrongData.innerText = "Missing Data";
    } else {
        let user1 = new Users(firstName.value, lastName.value, email.value, password.value)
                users.push(user1);
                localStorage.setItem("userData", JSON.stringify(users));
                wrongData.innerText = "User successfully created";
                wrongData.style.color = "rgb(0, 192, 22)";
                setTimeout(() => {
                    window.location.href = '../pages/login.html';
                }, 2000);
    };
}

function login_handler() {
    window.location.href = '../pages/login.html';

}

button.addEventListener("click", register);
loginBtn.addEventListener("click", login_handler);

