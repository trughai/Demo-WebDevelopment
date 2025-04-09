import { db, auth } from "./firebase-config.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const cartList = document.getElementById("cart-list");
  const totalPriceElement = document.getElementById("total-price");

  const user = auth.currentUser;
  if (!user) {
    alert("Bạn cần đăng nhập để xem giỏ hàng.");
    return;
  }

  try {
    const cartRef = collection(db, "carts");
    const cartQuery = query(cartRef, where("userId", "==", user.uid));
    const cartSnapshot = await getDocs(cartQuery);

    cartList.innerHTML = ""; // Làm mới giỏ hàng
    let totalPrice = 0;

    cartSnapshot.forEach((doc) => {
      const data = doc.data();
      const li = document.createElement("li");
      li.innerHTML = `
        <img src="${data.imageUrl}" alt="${data.name}" width="50" />
        <strong>${data.name}</strong>
        <p>Giá: ${data.price}đ</p>
        <p>Số lượng: ${data.quantity}</p>
        <p>Tổng: ${data.price * data.quantity}đ</p>
      `;
      cartList.appendChild(li);

      totalPrice += data.price * data.quantity;
    });

    totalPriceElement.innerHTML = `Tổng cộng: ${totalPrice.toLocaleString()}đ`;
  } catch (err) {
    console.error("Lỗi khi tải giỏ hàng:", err);
  }
});
