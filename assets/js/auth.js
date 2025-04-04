import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const message = document.getElementById("login-message");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    message.textContent = "Login successful!";
    window.location.href = "admin.html";
  } catch (error) {
    message.textContent = "Login failed: " + error.message;
  }
});
