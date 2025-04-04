import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Đăng xuất
document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// Thêm người dùng
document.getElementById("add-user-btn").addEventListener("click", async () => {
  const username = document.getElementById("new-username").value;
  const role = document.getElementById("new-role").value;
  
  if (username && role) {
    const db = getFirestore();
    try {
      await addDoc(collection(db, "users"), {
        username: username,
        role: role
      });
      alert("User added successfully!");
      document.getElementById("new-username").value = "";
      document.getElementById("new-role").value = "";
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  } else {
    alert("Please fill in both fields!");
  }
});
