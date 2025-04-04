import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

document.getElementById("register-btn").addEventListener("click", async () => {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const message = document.getElementById("register-message");

  if (email && password) {
    try {
      // Đăng ký người dùng mới
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Lưu thông tin người dùng vào Firestore (ví dụ lưu email và role là "user")
      await setDoc(doc(db, "users", user.email), {
        email: user.email,
        role: "user",
      });

      message.textContent = "Registration successful!";
      setTimeout(() => {
        window.location.href = "index.html"; // Chuyển hướng về trang đăng nhập
      }, 2000);
    } catch (error) {
      message.textContent = "Registration failed: " + error.message;
    }
  } else {
    message.textContent = "Please enter a valid email and password.";
  }
});
