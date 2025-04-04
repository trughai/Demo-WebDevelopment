import { auth, db } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getIdTokenResult } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

document.getElementById("add-user-btn").addEventListener("click", async () => {
  const username = document.getElementById("new-username").value;
  const role = document.getElementById("new-role").value;

  const user = auth.currentUser;
  if (user) {
    // Kiểm tra xem người dùng có phải là admin hay không
    const idTokenResult = await getIdTokenResult(user);
    if (idTokenResult.claims.role === 'admin') {
      // Kiểm tra thông tin đầu vào
      if (username && role) {
        // Thêm hoặc cập nhật người dùng vào Firestore
        const userRef = doc(db, "users", username); // Tạo ref đến document người dùng mới
        await updateDoc(userRef, { role: role });  // Cập nhật vai trò cho người dùng

        alert("User role updated!");
      }
    } else {
      alert("You don't have permission to add or modify users.");
    }
  }
});
