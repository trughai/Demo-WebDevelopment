import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

document.getElementById("register-btn").addEventListener("click", async () => {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const message = document.getElementById("register-message");

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    message.textContent = "Registration successful!";
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  } catch (error) {
    message.textContent = "Registration failed: " + error.message;
  }
});
