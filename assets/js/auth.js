import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const message = document.getElementById("login-message");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      
      // Kiểm tra nếu user không phải admin
      if (userData.role !== "admin") {
        message.textContent = "You do not have permission to access the Admin Panel.";
        setTimeout(() => {
          window.location.href = "index.html";  // Chuyển hướng người dùng không phải admin ra trang login
        }, 2000);
      } else {
        message.textContent = "Login successful!";
        setTimeout(() => {
          window.location.href = "admin.html"; // Chuyển hướng admin vào trang admin
        }, 2000);
      }
    } else {
      message.textContent = "User not found!";
    }
  } catch (error) {
    message.textContent = "Login failed: " + error.message;
  }
});
