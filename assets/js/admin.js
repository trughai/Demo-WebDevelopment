import { auth } from './firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const db = getFirestore();

// Đăng xuất
document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});

// Thêm sản phẩm mới
document.getElementById("add-product-btn").addEventListener("click", async () => {
  const name = document.getElementById("new-product-name").value;
  const price = document.getElementById("new-product-price").value;
  const image = document.getElementById("new-product-image").files[0];

  if (name && price && image) {
    const imageUrl = await uploadImage(image); // Hàm tải ảnh lên Firebase Storage
    await addDoc(collection(db, "products"), {
      name,
      price,
      imageUrl,
      stock: 10
    });
  }
});

// Hàm tải ảnh lên Firebase Storage
async function uploadImage(image) {
  const storageRef = firebase.storage().ref('product-images/' + image.name);
  const snapshot = await storageRef.put(image);
  return await snapshot.ref.getDownloadURL();
}

// Hiển thị sản phẩm từ Firestore
async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((doc) => {
    const product = doc.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td><button onclick="deleteProduct('${doc.id}')">Delete</button></td>
    `;
    document.getElementById("product-table").appendChild(row);
  });
}

// Xóa sản phẩm
async function deleteProduct(id) {
  await deleteDoc(doc(db, "products", id));
  loadProducts(); // Reload lại danh sách sản phẩm
}

loadProducts();
