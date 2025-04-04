// admin.js
import { auth, db, storage } from "./firebase-config.js";
import {
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";

// Kiểm tra người dùng đăng nhập và là admin
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists() || docSnap.data().role !== "admin") {
      alert("Bạn không có quyền truy cập!");
      window.location.href = "index.html";
    } else {
      loadUsers();
    }
  } else {
    window.location.href = "index.html";
  }
});

// Đăng xuất
document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// Load danh sách người dùng
async function loadUsers() {
  const usersRef = collection(db, "users");
  const querySnapshot = await getDocs(usersRef);
  const userList = document.getElementById("user-list-ul");
  userList.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${data.email}</strong> - Role: ${data.role || "none"}
      <button data-id="${docSnap.id}" data-role="admin">Set Admin</button>
      <button data-id="${docSnap.id}" data-role="user">Set User</button>
    `;
    userList.appendChild(li);
  });

  // Gán sự kiện nút
  document.querySelectorAll("#user-list-ul button").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const role = btn.getAttribute("data-role");
      await updateDoc(doc(db, "users", id), { role });
      loadUsers();
    });
  });
}

// Thêm sản phẩm
document.getElementById("add-product-btn").addEventListener("click", async () => {
  const name = document.getElementById("product-name").value.trim();
  const price = document.getElementById("product-price").value.trim();
  const file = document.getElementById("product-image").files[0];

  if (!name || !price || !file) {
    alert("Điền đầy đủ thông tin và chọn hình ảnh.");
    return;
  }

  try {
    // Upload hình ảnh
    const storageRef = ref(storage, "product-images/" + file.name);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

    // Lưu sản phẩm
    const productId = Date.now().toString();
    await setDoc(doc(db, "products", productId), {
      name,
      price,
      imageUrl,
      createdAt: new Date()
    });

    alert("Thêm sản phẩm thành công!");
    document.getElementById("product-name").value = "";
    document.getElementById("product-price").value = "";
    document.getElementById("product-image").value = "";
  } catch (err) {
    alert("Lỗi khi thêm sản phẩm: " + err.message);
  }
});
