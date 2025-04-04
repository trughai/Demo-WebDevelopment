// auth.js
import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("register-btn").addEventListener("click", async () => {
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();
  const confirmPassword = document.getElementById("register-confirm-password").value.trim();
  const msg = document.getElementById("register-message");

  // Kiểm tra mật khẩu và xác nhận mật khẩu
  if (password !== confirmPassword) {
    msg.textContent = "Mật khẩu và xác nhận mật khẩu không khớp.";
    return;
  }

  try {
    // Tạo người dùng mới bằng Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Lưu thông tin người dùng vào Firestore
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      email: email,
      role: "user",  // Vai trò mặc định là 'user'
    });

    // Thông báo thành công
    msg.textContent = "Tạo tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.";
    
    // Sau 2 giây, chuyển hướng người dùng đến trang đăng nhập
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
    
  } catch (err) {
    // Hiển thị thông báo lỗi nếu tạo tài khoản thất bại
    msg.textContent = "Đăng ký không thành công: " + err.message;
  }
});
