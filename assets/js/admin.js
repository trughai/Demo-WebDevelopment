import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Đăng xuất người dùng
document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// Xử lý sự kiện click nút "Add User"
document.getElementById("add-user-btn").addEventListener("click", () => {
  const username = document.getElementById("new-username").value;
  const role = document.getElementById("new-role").value;

  // Kiểm tra nếu cả 2 trường đều có giá trị
  if (username && role) {
    console.log("Adding user:", username, "Role:", role); // Debugging console log

    // Tạo dòng mới trong bảng để hiển thị người dùng
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${username}</td>
      <td>${role}</td>
      <td><button onclick="this.parentElement.parentElement.remove()">Delete</button></td>
    `;
    document.getElementById("user-table").appendChild(row);

    // Xóa giá trị input sau khi thêm
    document.getElementById("new-username").value = '';
    document.getElementById("new-role").value = '';
  } else {
    alert("Please fill in both fields!"); // Thông báo nếu thiếu thông tin
  }
});
