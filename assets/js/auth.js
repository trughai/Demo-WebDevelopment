import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const message = document.getElementById("login-message");

  try {
    // Đăng nhập với email và mật khẩu
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Kiểm tra vai trò của người dùng sau khi đăng nhập
    const user = userCredential.user;
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.role === "admin") {
        message.textContent = "Login successful! Redirecting to Admin page.";
        window.location.href = "admin.html";  // Chuyển đến trang Admin
      } else {
        message.textContent = "Login successful! You are a user.";
        window.location.href = "user-home.html";  // Chuyển đến trang người dùng
      }
    } else {
      message.textContent = "User not found!";
    }
  } catch (error) {
    message.textContent = "Login failed: " + error.message;
  }
});
