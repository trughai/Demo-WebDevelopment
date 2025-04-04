// auth.js
import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const message = document.getElementById("login-message");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    message.textContent = "Login successful!";

    // Kiểm tra role từ Firestore
    const userRef = db.collection("users").doc(user.uid);
    const doc = await userRef.get();
    if (doc.exists && doc.data().role === 'admin') {
      window.location.href = "admin.html";
    } else {
      window.location.href = "user.html";
    }
  } catch (error) {
    message.textContent = "Login failed: " + error.message;
  }
});
