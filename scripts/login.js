document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById("loginButton");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const loginError = document.getElementById("loginError");
    const registerBtn = document.getElementById("register");

    loginButton.addEventListener("click", function() {
        const users = JSON.parse(localStorage.getItem("userData")) || [];
        const foundUser = users.find(user => user.email === email.value && user.password === password.value);

        if (foundUser) {
            localStorage.setItem("CurrentUser", JSON.stringify(foundUser));
            window.location.href = '../pages/home.html';
        } else {
            loginError.innerText = "Invalid email or password";
        }
    });

    registerBtn.addEventListener("click", function() {
        window.location.href = '../pages/register.html';
    });
});
