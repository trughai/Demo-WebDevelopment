import { auth, db } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { collection, getDocs, addDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Lắng nghe trạng thái người dùng
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "index.html"; // Nếu chưa đăng nhập, chuyển hướng về trang login
    return;
  }

  // Kiểm tra quyền admin
  const userRef = doc(db, "users", user.email); // Sử dụng email làm ID
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    const userData = userDoc.data();
    if (userData.role !== "admin") {
      window.location.href = "index.html"; // Nếu không phải admin, chuyển hướng ra ngoài trang admin
    }
  }
});

// Đăng xuất
document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html"; // Chuyển hướng về trang login
});

// Thêm người dùng
document.getElementById("add-user-btn").addEventListener("click", async () => {
  const email = document.getElementById("new-email").value;
  const role = document.getElementById("new-role").value;

  if (email && role) {
    try {
      await addDoc(collection(db, "users"), {
        email: email,
        role: role,
      });
      alert("User added successfully");
      loadUserList(); // Tải lại danh sách người dùng
    } catch (error) {
      alert("Error adding user: " + error.message);
    }
  } else {
    alert("Please enter a valid email and role.");
  }
});

// Hiển thị danh sách người dùng
async function loadUserList() {
  const userTable = document.getElementById("user-table");
  userTable.innerHTML = ""; // Xóa danh sách người dùng hiện tại

  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    const userData = doc.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${userData.email}</td>
      <td>${userData.role}</td>
      <td><button class="delete-btn" data-id="${doc.id}">Delete</button></td>
    `;
    userTable.appendChild(row);
  });

  // Xử lý xóa người dùng
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach(button => {
    button.addEventListener("click", async (event) => {
      const userId = event.target.getAttribute("data-id");
      try {
        await deleteDoc(doc(db, "users", userId));
        alert("User deleted successfully");
        loadUserList(); // Tải lại danh sách người dùng
      } catch (error) {
        alert("Error deleting user: " + error.message);
      }
    });
  });
}

// Lấy danh sách người dùng ngay khi trang được tải
loadUserList();
