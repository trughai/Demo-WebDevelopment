import { auth, db } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Lắng nghe trạng thái đăng nhập của người dùng
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "index.html"; // Nếu chưa đăng nhập, chuyển hướng về trang login
    return;
  }

  // Chỉ admin mới có quyền thêm người dùng
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("role", "==", "admin"));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    alert("You do not have admin privileges.");
    window.location.href = "index.html"; // Nếu không phải admin, chuyển hướng về trang login
  }
});

// Đăng xuất
document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html"; // Chuyển hướng về trang login
});

// Thêm người dùng
document.getElementById("add-user-btn").addEventListener("click", async () => {
  const username = document.getElementById("new-username").value;
  const role = document.getElementById("new-role").value;

  if (username && role) {
    try {
      await addDoc(collection(db, "users"), {
        username: username,
        role: role,
      });
      alert("User added successfully");
    } catch (error) {
      alert("Error adding user: " + error.message);
    }
  } else {
    alert("Please enter a username and role.");
  }
});
