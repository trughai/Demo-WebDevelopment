import { db } from "./firebaseConfig.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const productList = document.getElementById("product-list");

  try {
    const querySnapshot = await getDocs(collection(db, "products"));

    if (querySnapshot.empty) {
      productList.innerHTML = "<p>Chưa có sản phẩm nào được thêm.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const productHTML = `
        <div class="product-card">
          <img src="${data.imageUrl}" alt="${data.name}" />
          <h3>${data.name}</h3>
          <p>${Number(data.price).toLocaleString()}đ</p>
          <button class="add-to-cart-btn" data-id="${doc.id}">Thêm vào giỏ</button>
        </div>
      `;
      productList.innerHTML += productHTML;
    });
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
    productList.innerHTML = "<p>Lỗi khi tải sản phẩm.</p>";
  }
});
