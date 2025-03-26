function deleteUser(button) {
    let row = button.parentElement.parentElement;
    let username = row.cells[0].innerText;

    if (confirm(`Are you sure you want to delete ${username}?`)) {
        row.remove();
    }
}

function logout() {
    window.location.href = "index.html";
}
