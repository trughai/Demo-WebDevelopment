import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const message = document.getElementById("login-message");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists() && userDoc.data().role === "admin") {
      message.textContent = "Login success!";
      window.location.href = "admin.html";
    } else {
      message.textContent = "You are not an admin!";
    }
  } catch (error) {
    message.textContent = "Login failed: " + error.message;
  }
});
