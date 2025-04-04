import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getIdTokenResult } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

document.getElementById("add-user-btn").addEventListener("click", async () => {
  const username = document.getElementById("new-username").value;
  const role = document.getElementById("new-role").value;

  // Kiểm tra nếu người dùng có quyền admin
  const user = auth.currentUser;
  if (user) {
    const idTokenResult = await getIdTokenResult(user);
    if (idTokenResult.claims.role === 'admin') {
      // Nếu là admin, cho phép thêm người dùng mới
      if (username && role) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${username}</td>
          <td>${role}</td>
          <td><button onclick="this.parentElement.parentElement.remove()">Delete</button></td>
        `;
        document.getElementById("user-table").appendChild(row);
      }
    } else {
      alert("You do not have permission to add users.");
    }
  }
});
