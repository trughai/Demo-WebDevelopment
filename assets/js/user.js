import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Hiển thị danh sách sản phẩm
async function loadProducts() {
  const productsRef = collection(db, "products");
  const querySnapshot = await getDocs(productsRef);
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${data.name}</strong><br>
      Price: ${data.price} <br>
      <img src="${data.imageUrl}" alt="${data.name}" width="100" />
    `;
    productList.appendChild(li);
  });
}

// Gọi hàm loadProducts khi trang được tải
loadProducts();

// Đăng xuất
document.getElementById("logout-btn").addEventListener("click", () => {
  window.location.href = "index.html";
});
