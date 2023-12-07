export async function fetchUsers() {
    let users = new Promise((res) => {
        let xhr = new XMLHttpRequest();

        xhr.open(`GET`, '../data/users.json', true);

        xhr.onload = function () {
            let response = JSON.parse(this.responseText);
            if(!localStorage.getItem("userData")){
                localStorage.setItem("userData", JSON.stringify(response.users));
            }
            res(response.users);
        }
        xhr.send();
    });
    return users;
}