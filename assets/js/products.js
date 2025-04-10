import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { addToCart } from "./cart.js"; // Đảm bảo đã import đúng hàm addToCart từ cart.js

document.addEventListener("DOMContentLoaded", async () => {
  const productList = document.getElementById("product-list");

  try {
    // Lấy tất cả sản phẩm từ Firestore
    const querySnapshot = await getDocs(collection(db, "products"));
    if (querySnapshot.empty) {
      productList.innerHTML = "<p>Không có sản phẩm nào.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${data.imageUrl}" alt="${data.name}" />
        <h3>${data.name}</h3>
        <p>Giá: ${Number(data.price).toLocaleString()}đ</p>
        <button class="add-to-cart" data-id="${doc.id}" data-name="${data.name}" data-price="${data.price}" data-imageurl="${data.imageUrl}">Thêm vào giỏ</button>
      `;
      productList.appendChild(card);
    });

    // Gán sự kiện cho nút "Thêm vào giỏ"
    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.target.getAttribute("data-id");
        const productName = e.target.getAttribute("data-name");
        const productPrice = e.target.getAttribute("data-price");
        const productImage = e.target.getAttribute("data-imageurl");

        // Thêm sản phẩm vào giỏ hàng
        addToCart(productId, productName, productPrice, productImage);
      });
    });
  } catch (err) {
    console.error("Lỗi tải sản phẩm:", err);
    productList.innerHTML = "<p>Lỗi tải sản phẩm.</p>";
  }
});
