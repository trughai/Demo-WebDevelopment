import { auth, db } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Đăng xuất người dùng
document.getElementById("logout-btn").addEventListener("click", async () => {
  try {
    await signOut(auth);  // Đăng xuất
    window.location.href = "index.html";  // Chuyển hướng về trang đăng nhập
  } catch (error) {
    console.error("Error during sign out: ", error);
  }
});

// Thêm người dùng mới vào Firestore
document.getElementById("add-user-btn").addEventListener("click", async () => {
  const username = document.getElementById("new-username").value;
  const role = document.getElementById("new-role").value;

  if (username && role) {
    try {
      // Thêm người dùng vào Firestore
      const docRef = await addDoc(collection(db, "users"), {
        username: username,
        role: role
      });

      // Hiển thị người dùng vừa thêm vào bảng
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${username}</td>
        <td>${role}</td>
        <td><button onclick="this.parentElement.parentElement.remove()">Delete</button></td>
      `;
      document.getElementById("user-table").appendChild(row);

      // Reset các input
      document.getElementById("new-username").value = '';
      document.getElementById("new-role").value = '';
    } catch (error) {
      console.error("Error adding user: ", error);
    }
  } else {
    alert("Please fill in both username and role fields.");
  }
});

// Tải danh sách người dùng từ Firestore khi trang được tải lại
document.addEventListener("DOMContentLoaded", async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  const tableBody = document.getElementById("user-table");

  // Hiển thị tất cả người dùng từ Firestore
  querySnapshot.forEach((doc) => {
    const user = doc.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.username}</td>
      <td>${user.role}</td>
      <td><button onclick="this.parentElement.parentElement.remove()">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
});
