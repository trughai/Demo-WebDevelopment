import { auth, db } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const logoutBtn = document.getElementById("logout-btn");

const checkAdmin = async () => {
  const user = auth.currentUser;
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      const userData = docSnap.data();
      if (userData.role !== "admin") {
        alert("You do not have permission to access this page.");
        window.location.href = "index.html";  // Chuyển hướng ra trang đăng nhập nếu không phải admin
      }
    }
  } else {
    alert("Please log in first.");
    window.location.href = "index.html";  // Nếu không đăng nhập, chuyển hướng về trang login
  }
};

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "index.html";  // Đăng xuất và quay lại trang đăng nhập
  } catch (error) {
    console.error("Logout error: ", error.message);
  }
});

// Kiểm tra quyền admin khi vào trang admin
checkAdmin();
