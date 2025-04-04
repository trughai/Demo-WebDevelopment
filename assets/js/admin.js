import { auth, db } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { addDoc, collection, getDoc, doc, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Kiểm tra nếu người dùng đã đăng nhập và có quyền admin
async function checkAdminRole() {
  const user = auth.currentUser;
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.role === "admin") {
        // Nếu là admin, cho phép truy cập chức năng quản trị
        document.getElementById("add-user-btn").disabled = false;
        document.getElementById("logout-btn").disabled = false;
      } else {
        // Nếu không phải admin, chuyển hướng hoặc ẩn các chức năng quản trị
        alert("You do not have admin privileges.");
        window.location.href = "index.html"; // Chuyển về trang login
      }
    }
  }
}

// Đăng xuất người dùng
document.getElementById("logout-btn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error during sign out: ", error);
  }
});

// Thêm người dùng vào Firestore
document.getElementById("add-user-btn").addEventListener("click", async () => {
  const username = document.getElementById("new-username").value;
  const role = document.getElementById("new-role").value;

  if (username && role) {
    try {
      // Thêm người dùng vào Firestore
      await addDoc(collection(db, "users"), {
        username: username,
        role: role
      });

      // Thêm người dùng vào bảng hiển thị
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${username}</td>
        <td>${role}</td>
        <td><button onclick="this.parentElement.parentElement.remove()">Delete</button></td>
      `;
      document.getElementById("user-table").appendChild(row);

      // Reset các input sau khi thêm người dùng
      document.getElementById("new-username").value = '';
      document.getElementById("new-role").value = '';
    } catch (error) {
      console.error("Error adding user: ", error);
      alert("There was an error adding the user: " + error.message);
    }
  } else {
    alert("Please fill in both username and role fields.");
  }
});

// Tải danh sách người dùng từ Firestore khi trang được tải lại
document.addEventListener("DOMContentLoaded", async () => {
  try {
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
  } catch (error) {
    console.error("Error loading users: ", error);
  }
});

// Kiểm tra quyền admin khi trang Admin được tải
checkAdminRole();
