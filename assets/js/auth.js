// auth.js
import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();
  const confirmPassword = document.getElementById("register-confirm-password").value.trim();
  const msg = document.getElementById("register-message");

  if (password !== confirmPassword) {
    msg.textContent = "Passwords do not match!";
    return;
  }

  try {
    // Tạo tài khoản người dùng với Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Lưu thông tin người dùng vào Firestore
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      email: email,
      role: "user",  // Mặc định người dùng là "user"
    });

    msg.textContent = "Account created successfully! You can now log in.";
    // Chuyển hướng đến trang đăng nhập
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  } catch (err) {
    msg.textContent = "Registration failed: " + err.message;
  }
});
