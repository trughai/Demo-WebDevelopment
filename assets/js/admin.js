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
  deleteDoc
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
      loadProducts();  // Tải danh sách sản phẩm
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
  const price = parseInt(document.getElementById("product-price").value.trim());
  const file = document.getElementById("product-image").files[0];

  if (!name || isNaN(price) || !file) {
    alert("Điền đầy đủ thông tin và chọn hình ảnh.");
    return;
  }

  try {
    const storageRef = ref(storage, "product-images/" + file.name);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

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

    loadProducts();
  } catch (err) {
    alert("Lỗi khi thêm sản phẩm: " + err.message);
  }
});

// Load danh sách sản phẩm
async function loadProducts() {
  const productsRef = collection(db, "products");
  const querySnapshot = await getDocs(productsRef);
  const productList = document.getElementById("product-list-ul");
  productList.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${data.name}</strong><br>
      Price: ${Number(data.price).toLocaleString("vi-VN")} ₫ <br>
      <img src="${data.imageUrl}" alt="${data.name}" width="100" /><br>
      <button class="edit-product-btn" data-id="${docSnap.id}" data-name="${data.name}" data-price="${data.price}">Edit</button>
      <button class="delete-product-btn" data-id="${docSnap.id}">Delete</button>
    `;
    productList.appendChild(li);
  });

  document.querySelectorAll(".delete-product-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        await deleteDoc(doc(db, "products", id));
        loadProducts();
      }
    });
  });

  document.querySelectorAll(".edit-product-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const name = btn.getAttribute("data-name");
      const price = btn.getAttribute("data-price");

      document.getElementById("edit-id").value = id;
      document.getElementById("edit-name").value = name;
      document.getElementById("edit-price").value = price;
      document.getElementById("edit-modal").style.display = "block";
    });
  });
}

// Lưu thay đổi chỉnh sửa sản phẩm
document.getElementById("save-edit").addEventListener("click", async () => {
  const id = document.getElementById("edit-id").value;
  const name = document.getElementById("edit-name").value;
  const price = parseInt(document.getElementById("edit-price").value);

  if (!name || isNaN(price)) {
    alert("Điền đầy đủ thông tin hợp lệ.");
    return;
  }

  await updateDoc(doc(db, "products", id), {
    name,
    price
  });
  document.getElementById("edit-modal").style.display = "none";
  loadProducts();
});

// Đóng modal chỉnh sửa
document.getElementById("close-edit").addEventListener("click", () => {
  document.getElementById("edit-modal").style.display = "none";
});

// Đóng modal khi click ra ngoài nội dung modal
window.addEventListener("click", (e) => {
  const modal = document.getElementById("edit-modal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
