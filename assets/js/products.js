import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

// Thêm sản phẩm vào giỏ hàng
function addToCart(id, name, price, imageUrl) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  const existingProduct = cart.find(item => item.id === id);
  if (existingProduct) {
    alert("Sản phẩm đã có trong giỏ hàng!");
  } else {
    cart.push({
      id,
      name,
      price,
      imageUrl,
      quantity: 1, // Số lượng mặc định là 1
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Thêm vào giỏ hàng thành công!");
  }
}
