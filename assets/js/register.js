// register.js
import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("register-btn").addEventListener("click", async () => {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const message = document.getElementById("register-message");

  try {
    // Tạo người dùng mới với email và mật khẩu
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Lưu thông tin người dùng vào Firestore với vai trò mặc định là 'user'
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      role: 'user' // Vai trò mặc định là user
    });

    message.textContent = "Registration successful!";
    setTimeout(() => {
      window.location.href = "login.html"; // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
    }, 2000);
  } catch (error) {
    message.textContent = "Registration failed: " + error.message;
  }
});
