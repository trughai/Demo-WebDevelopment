import { auth } from "./firebase-config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const db = getFirestore();

let userRole = "";  // Để lưu role người dùng hiện tại
let currentUserId = ""; // Để lưu ID của người dùng đang đăng nhập

// Kiểm tra trạng thái đăng nhập
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUserId = user.uid;  // Lưu ID người dùng
    const userRef = doc(db, "users", currentUserId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      userRole = docSnap.data().role;
      if (userRole !== 'admin') {
        alert("You do not have permission to access this page.");
        window.location.href = "index.html";  // Chuyển hướng về trang login nếu không phải admin
      }
    } else {
      console.log("No such document!");
    }
  } else {
    window.location.href = "index.html";  // Chuyển hướng về trang login nếu chưa đăng nhập
  }
});

document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

document.getElementById("add-user-btn").addEventListener("click", async () => {
  const username = document.getElementById("new-username").value;
  const role = document.getElementById("new-role").value;

  if (username && role) {
    // Thêm người dùng mới vào Firestore
    await addDoc(collection(db, "users"), {
      username: username,
      role: role
    });

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${username}</td>
      <td>${role}</td>
      <td>
        <button onclick="updateRole('${username}')">Update Role</button>
        <button onclick="deleteUser('${username}')">Delete</button>
      </td>
    `;
    document.getElementById("user-table").appendChild(row);
  }
});

// Hàm để cập nhật vai trò
async function updateRole(username) {
  const role = prompt("Enter new role for " + username);
  if (role) {
    // Tìm người dùng trong Firestore và cập nhật vai trò
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      if (doc.data().username === username) {
        const userRef = doc(db, "users", doc.id); // Lấy ID người dùng
        updateDoc(userRef, { role });
        alert("Role updated to " + role);
      }
    });
  }
}

// Hàm xóa người dùng
async function deleteUser(username) {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    if (doc.data().username === username) {
      const userRef = doc(db, "users", doc.id); // Lấy ID người dùng
      deleteDoc(userRef);
      alert("User deleted");
    }
  });
}
