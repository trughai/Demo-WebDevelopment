import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";

// --- Firebase config ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// --- Init ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);

// --- Auth check: chỉ admin mới vào được ---
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists() || userDoc.data().role !== "admin") {
      alert("Bạn không có quyền truy cập trang admin.");
      window.location.href = "index.html";
    }
  } else {
    window.location.href = "index.html";
  }
});

// --- Thêm sản phẩm ---
const addProductBtn = document.getElementById("add-product-btn");

addProductBtn.addEventListener("click", async () => {
  const name = document.getElementById("product-name").value.trim();
  const price = document.getElementById("product-price").value.trim();
  const imageFile = document.getElementById("product-image").files[0];

  if (!name || !price || !imageFile) {
    alert("Vui lòng nhập đầy đủ thông tin sản phẩm và chọn hình ảnh.");
    return;
  }

  try {
    const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
    const snapshot = await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(snapshot.ref);

    await addDoc(collection(db, "products"), {
      name,
      price,
      imageUrl,
      createdAt: new Date(),
    });

    alert("Thêm sản phẩm thành công!");

    // Reset form
    document.getElementById("product-name").value = "";
    document.getElementById("product-price").value = "";
    document.getElementById("product-image").value = "";
  } catch (error) {
    console.error("Lỗi thêm sản phẩm:", error);
    alert("Thêm sản phẩm thất bại.");
  }
});

// --- Đăng xuất ---
document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});
