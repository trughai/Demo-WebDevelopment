// register.js
import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("register-btn").addEventListener("click", async () => {
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();
  const msg = document.getElementById("register-message");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Lưu vào Firestore users/{uid}
    await setDoc(doc(db, "users", uid), {
      email: email,
      uid: uid,
      role: "user"
    });

    msg.textContent = "Đăng ký thành công!";
    setTimeout(() => (window.location.href = "index.html"), 1500);
  } catch (error) {
    msg.textContent = "Lỗi đăng ký: " + error.message;
  }
});
