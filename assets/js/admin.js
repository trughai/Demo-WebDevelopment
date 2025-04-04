import { auth, db } from "./firebase-config.js";
import {
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Kiểm tra quyền truy cập admin
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists() || userDoc.data().role !== "admin") {
      alert("Bạn không có quyền truy cập trang admin!");
      window.location.href = "index.html";
    } else {
      loadUsers(); // Chỉ admin mới load danh sách user
    }
  } else {
    alert("Vui lòng đăng nhập trước.");
    window.location.href = "index.html";
  }
});

// Logout
document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// Load user list từ Firestore
async function loadUsers() {
  const userTable = document.getElementById("user-table");
  userTable.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((docSnap) => {
    const user = docSnap.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <input type="text" placeholder="New Role" class="update-role-input" />
        <button class="update-role-btn" data-uid="${docSnap.id}">Update</button>
      </td>
    `;
    userTable.appendChild(row);
  });
}

// Cập nhật vai trò
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("update-role-btn")) {
    const uid = e.target.dataset.uid;
    const newRoleInput = e.target.previousElementSibling;
    const newRole = newRoleInput.value.trim();

    if (!newRole) {
      alert("Vui lòng nhập vai trò mới!");
      return;
    }

    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { role: newRole });
      alert("Cập nhật vai trò thành công!");
      newRoleInput.value = "";
      loadUsers();
    } catch (error) {
      console.error("Lỗi khi cập nhật role:", error);
      alert("Cập nhật thất bại!");
    }
  }
});
