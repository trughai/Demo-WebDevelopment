import { auth, db } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

document.addEventListener("DOMContentLoaded", async () => {
  // Kiểm tra người dùng có phải là Admin hay không
  const user = auth.currentUser;
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists() && userDoc.data().role !== "Admin") {
      alert("You do not have permission to access this page.");
      window.location.href = "index.html";
      return;
    }
  } else {
    alert("You need to log in first.");
    window.location.href = "index.html";
    return;
  }

  const querySnapshot = await getDocs(collection(db, "users"));
  const userTable = document.getElementById("user-table");

  querySnapshot.forEach((doc) => {
    const user = doc.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <button onclick="changeRole('${doc.id}')">Change Role</button>
        <button onclick="deleteUser('${doc.id}')">Delete</button>
      </td>
    `;
    userTable.appendChild(row);
  });
});

// Thay đổi vai trò người dùng
async function changeRole(docId) {
  const newRole = prompt("Enter new role (Admin/User):");
  if (newRole !== "Admin" && newRole !== "User") {
    alert("Invalid role.");
    return;
  }

  const userRef = doc(db, "users", docId);
  await updateDoc(userRef, {
    role: newRole
  });
  alert("Role updated successfully.");
  window.location.reload();  // Tải lại trang để cập nhật danh sách
}

// Xóa người dùng
async function deleteUser(docId) {
  const confirmDelete = confirm("Are you sure you want to delete this user?");
  if (confirmDelete) {
    await deleteDoc(doc(db, "users", docId));
    alert("User deleted successfully.");
    window.location.reload();  // Tải lại trang để cập nhật danh sách
  }
}
