import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const productList = document.getElementById("product-list");

  try {
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
        <p>${Number(data.price).toLocaleString()}đ</p>
        <button>Thêm vào giỏ</button>
      `;
      productList.appendChild(card);
    });
  } catch (err) {
    console.error("Lỗi tải sản phẩm:", err);
    productList.innerHTML = "<p>Lỗi tải sản phẩm.</p>";
  }
});
