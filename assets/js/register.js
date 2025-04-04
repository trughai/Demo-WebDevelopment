import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const db = getFirestore();

document.getElementById('register-btn').addEventListener('click', async () => {
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const message = document.getElementById('register-message');

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Lưu thông tin người dùng vào Firestore với role 'user'
    await setDoc(doc(db, "users", user.uid), {
      role: "user", // default role is 'user'
      email: email,
    });

    message.textContent = "Registration successful!";
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  } catch (error) {
    message.textContent = "Registration failed: " + error.message;
  }
});
