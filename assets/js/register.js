import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const db = getFirestore();

document.getElementById("register-btn").addEventListener("click", async () => {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const message = document.getElementById("register-message");

  try {
    // Tạo người dùng mới với email và mật khẩu
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Lưu thông tin người dùng vào Firestore, bao gồm UID
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      role: "user", // Mặc định người dùng mới có vai trò là 'user'
      username: email.split('@')[0] // Đặt tên người dùng theo email (hoặc có thể thay đổi theo ý bạn)
    });

    message.textContent = "Registration successful!";
    setTimeout(() => {
      window.location.href = "index.html";  // Quay lại trang đăng nhập
    }, 2000);
  } catch (error) {
    message.textContent = "Registration failed: " + error.message;
  }
});
