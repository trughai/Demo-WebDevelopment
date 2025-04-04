import { auth, db } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const logoutBtn = document.getElementById("logout-btn");
const addUserBtn = document.getElementById("add-user-btn");

// Đăng xuất
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html"; // Quay lại trang đăng nhập
});

// Kiểm tra nếu người dùng là admin khi vào trang admin
const checkAdmin = async () => {
  const user = auth.currentUser;
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      if (userData.role !== "admin") {
        alert("You do not have permission to access this page.");
        window.location.href = "index.html";  // Quay lại trang đăng nhập nếu không phải admin
      }
    }
  } else {
    alert("Please log in first.");
    window.location.href = "index.html";  // Chuyển về trang login nếu chưa đăng nhập
  }
};

// Thêm người dùng và chỉnh sửa role
addUserBtn.addEventListener("click", async () => {
  const userId = document.getElementById("user-id").value;
  const newRole = document.getElementById("new-role").value;

  if (userId && newRole) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      role: newRole // Cập nhật role người dùng
    });

    alert("User role updated successfully!");
    window.location.reload();
  }
});

// Kiểm tra quyền admin khi vào trang admin
checkAdmin();
