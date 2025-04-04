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
    userRole = sessionStorage.getItem("userRole");

    if (userRole !== "admin") {
      alert("You do not have permission to access this page.");
      window.location.href = "index.html";  // Chuyển hướng về trang login nếu không phải admin
    }
  } else {
    window.location.href = "index.html";  // Chuyển hướng về trang login nếu chưa đăng nhập
  }
});
