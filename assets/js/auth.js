import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const db = getFirestore();

document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const message = document.getElementById("login-message");

  try {
    // Đăng nhập người dùng
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Kiểm tra vai trò của người dùng trong Firestore
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const role = userData.role;

      // Lưu vai trò và UID của người dùng vào sessionStorage
      sessionStorage.setItem("userRole", role);
      sessionStorage.setItem("userUID", user.uid);

      message.textContent = "Login successful!";

      // Nếu là admin, chuyển đến trang admin
      if (role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "index.html";  // Quay lại trang chính nếu không phải admin
      }
    } else {
      message.textContent = "User data not found!";
    }
  } catch (error) {
    message.textContent = "Login failed: " + error.message;
  }
});
