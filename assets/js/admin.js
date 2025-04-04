import { auth, db } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getDocs, collection, doc, updateDoc, deleteDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html"; // Quay lại trang đăng nhập
});

// Lấy danh sách người dùng
async function fetchUsers() {
  const querySnapshot = await getDocs(collection(db, "users"));
  const usersList = [];
  querySnapshot.forEach((doc) => {
    usersList.push({ id: doc.id, ...doc.data() });
  });
  return usersList;
}

// Hiển thị danh sách người dùng
fetchUsers().then((users) => {
  const tableBody = document.getElementById("user-table");
  tableBody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <button onclick="updateUserRole('${user.id}')">Update Role</button>
        <button onclick="deleteUser('${user.id}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
});

// Thêm người dùng mới
document.getElementById("add-user-btn").addEventListener("click", async () => {
  const email = document.getElementById("new-user-email").value;
  const role = document.getElementById("new-user-role").value;

  if (email && role) {
    // Thêm người dùng vào Firestore
    const userRef = doc(db, "users", email);
    await setDoc(userRef, { email: email, role: role });

    // Hiển thị lại danh sách người dùng
    fetchUsers();
  }
});

// Cập nhật vai trò người dùng
async function updateUserRole(userId) {
  const newRole = prompt("Enter new role for the user (admin/user):");

  if (newRole !== null) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { role: newRole });
    alert(`User role updated to ${newRole}`);

    fetchUsers(); // Reload danh sách người dùng
  }
}

// Xóa người dùng
async function deleteUser(userId) {
  if (confirm("Are you sure you want to delete this user?")) {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);

    fetchUsers(); // Reload danh sách người dùng
  }
}
