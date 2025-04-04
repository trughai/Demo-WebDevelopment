import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("register-btn").addEventListener("click", async () => {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const message = document.getElementById("register-message");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, "users", uid), {
      uid: uid,
      email: email,
      role: "user"
    });

    message.textContent = "Registration successful!";
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  } catch (error) {
    message.textContent = "Registration failed: " + error.message;
  }
});
