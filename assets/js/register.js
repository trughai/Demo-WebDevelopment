import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const db = getFirestore();

document.getElementById("register-btn").addEventListener("click", async () => {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const message = document.getElementById("register-message");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      role: "user",  // Default role is user
      username: email.split('@')[0]
    });

    message.textContent = "Registration successful!";
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  } catch (error) {
    message.textContent = "Registration failed: " + error.message;
  }
});
