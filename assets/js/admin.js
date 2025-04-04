import { auth } from "./firebase-config.js";
import { getIdTokenResult } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Kiểm tra quyền admin trước khi truy cập trang
document.addEventListener("DOMContentLoaded", async () => {
  const user = auth.currentUser;
  if (user) {
    const idTokenResult = await getIdTokenResult(user);
    if (idTokenResult.claims.role !== 'admin') {
      alert("You do not have permission to access this page.");
      window.location.href = "index.html";  // Điều hướng về trang đăng nhập
    }
  } else {
    window.location.href = "index.html";  // Điều hướng nếu chưa đăng nhập
  }
});
