import { auth, db } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { addDoc, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Kiểm tra quyền Admin
async function checkAdminRole() {
  const user = auth.currentUser;
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.role === "admin") {
        document.getElementById("add-user-btn").disabled = false;
      } else {
        alert("You do not have admin privileges.");
        window.location.href = "index.html";
      }
    }
  }
}

// Đăng xuất người dùng
document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// Thêm người dùng vào Firestore
document.getElementById("add-user-btn").addEventListener("click", async () => {
  const username = document.getElementById("new-username").value;
  const role = document.getElementById("new-role").value;

  if (username && role) {
    await addDoc(collection(db, "users"), {
      username: username,
      role: role
    });

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${username}</td>
      <td>${role}</td>
      <td><button onclick="this.parentElement.parentElement.remove()">Delete</button></td>
    `;
    document.getElementById("user-table").appendChild(row);
  }
});

// Kiểm tra quyền admin khi trang Admin được tải
checkAdminRole();
