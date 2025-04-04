import { auth, db } from "./firebase-config.js";  // Import db từ firebase-config.js
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js"; // Import Firestore

document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const message = document.getElementById("login-message");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    message.textContent = "Login successful!";

    const user = auth.currentUser;
    const docRef = doc(db, "users", user.uid);  // Lấy tài liệu người dùng từ Firestore
    const docSnap = await getDoc(docRef);  // Lấy dữ liệu tài liệu người dùng

    if (docSnap.exists() && docSnap.data().role === "admin") {
      window.location.href = "admin.html"; // Nếu là admin, chuyển đến trang admin
    } else {
      window.location.href = "user.html"; // Nếu là user, chuyển đến trang user
    }
  } catch (error) {
    message.textContent = "Login failed: " + error.message;
  }
});
