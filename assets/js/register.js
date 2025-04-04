import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("register-btn").addEventListener("click", async () => {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const message = document.getElementById("register-message");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Lưu người dùng vào Firestore và gán role "user" mặc định
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: "user", // Vai trò mặc định
    });

    message.textContent = "Registration successful!";
    setTimeout(() => {
      window.location.href = "index.html"; // Chuyển hướng về trang đăng nhập
    }, 2000);
  } catch (error) {
    message.textContent = "Registration failed: " + error.message;
  }
});
