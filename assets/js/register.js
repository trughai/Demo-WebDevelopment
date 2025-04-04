import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("register-btn").addEventListener("click", async () => {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const message = document.getElementById("register-message");

  try {
    // Đăng ký người dùng với email và mật khẩu
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Lấy thông tin người dùng
    const user = userCredential.user;

    // Lưu thông tin người dùng vào Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      role: "user",  // Mặc định role là "user", có thể thay đổi nếu cần
      uid: user.uid,
    });

    message.textContent = "Registration successful!";
    
    // Chuyển hướng về trang đăng nhập sau 2 giây
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  } catch (error) {
    message.textContent = "Registration failed: " + error.message;
  }
});
