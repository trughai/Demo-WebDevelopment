// auth.js
import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const msg = document.getElementById("login-message");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      msg.textContent = "Tài khoản chưa được cấp quyền truy cập.";
      return;
    }

    const role = userDoc.data().role;
    if (role === "admin") {
      window.location.href = "admin.html";
    } else if (role === "user") {
      window.location.href = "user.html";
    } else {
      msg.textContent = "Vai trò không hợp lệ.";
    }
  } catch (err) {
    msg.textContent = "Login failed: " + err.message;
  }
});
