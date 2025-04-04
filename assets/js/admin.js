import { auth, db } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

document.addEventListener("DOMContentLoaded", async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  const userTable = document.getElementById("user-table");

  querySnapshot.forEach((doc) => {
    const user = doc.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.email}</td>
      <td>${user.role || "User"}</td>
      <td><button onclick="deleteUser('${doc.id}')">Delete</button></td>
    `;
    userTable.appendChild(row);
  });
});

async function deleteUser(docId) {
  // Xóa người dùng từ Firestore
  await deleteDoc(doc(db, "users", docId));
  window.location.reload();  // Tải lại trang để cập nhật danh sách
}
