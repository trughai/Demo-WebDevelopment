import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Đăng nhập
document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const message = document.getElementById("login-message");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    message.textContent = "Login successful!";
    window.location.href = "admin.html"; // Chuyển hướng đến trang admin
  } catch (error) {
    message.textContent = "Login failed: " + error.message;
  }
});

// Đăng ký
document.getElementById("register-btn").addEventListener("click", async () => {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const message = document.getElementById("register-message");

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    message.textContent = "Registration successful!";
    setTimeout(() => {
      window.location.href = "index.html"; // Chuyển hướng đến trang đăng nhập
    }, 2000);
  } catch (error) {
    message.textContent = "Registration failed: " + error.message;
  }
});
