function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let message = document.getElementById("message");

    if (username === "admin" && password === "123") {
        window.location.href = "admin.html";
    } else {
        message.textContent = "Invalid username or password!";
        message.style.color = "red";
    }
}
